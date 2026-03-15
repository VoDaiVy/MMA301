import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NotificationService from './notificationService';
import * as DB from './database';

const NOTIFICATION_TEMPLATE = {
  title: 'MMA301 Deadline Alert',
  message: 'Check your Slot 11 task before the deadline closes.',
};

const QUICK_TEMPLATES = [
  {
    id: 'deadline',
    label: 'Deadline',
    title: 'MMA301 Deadline Alert',
    message: 'Check your Slot 11 task before the deadline closes.',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    title: 'Mini Quiz Reminder',
    message: 'Review key concepts now so you can finish the quiz faster.',
  },
  {
    id: 'focus',
    label: 'Focus',
    title: 'Focus Session Starts',
    message: 'Take 25 focused minutes and finish one meaningful task.',
  },
];

const INITIAL_PERMISSION_STATE = {
  granted: false,
  isPhysicalDevice: false,
  status: 'unknown',
  message: 'Checking notification permission...',
};

function formatTimestamp(timestamp) {
  if (!timestamp) {
    return 'Just now';
  }

  const normalizedTimestamp = timestamp.includes('T')
    ? timestamp
    : `${timestamp.replace(' ', 'T')}Z`;
  const parsedDate = new Date(normalizedTimestamp);

  if (Number.isNaN(parsedDate.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
}

export default function App() {
  const [history, setHistory] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const [permissionState, setPermissionState] = useState(INITIAL_PERMISSION_STATE);
  const [selectedTemplateId, setSelectedTemplateId] = useState(QUICK_TEMPLATES[0].id);
  const [draftTitle, setDraftTitle] = useState(NOTIFICATION_TEMPLATE.title);
  const [draftMessage, setDraftMessage] = useState(NOTIFICATION_TEMPLATE.message);
  const [toast, setToast] = useState({
    visible: false,
    tone: 'success',
    title: '',
    message: '',
  });

  const isMountedRef = useRef(true);
  const handledNotificationIdsRef = useRef(new Set());

  const showToast = (tone, title, message) => {
    if (!isMountedRef.current) {
      return;
    }

    setToast({
      visible: true,
      tone,
      title,
      message,
    });
  };

  const loadNotificationHistory = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator && isMountedRef.current) {
      setIsRefreshing(true);
    }

    try {
      const records = await DB.getNotificationLogs();

      if (isMountedRef.current) {
        setHistory(records);
      }
    } catch (error) {
      showToast(
        'error',
        'History unavailable',
        error.message || 'Unable to read notification logs.'
      );
    } finally {
      if (showRefreshIndicator && isMountedRef.current) {
        setIsRefreshing(false);
      }
    }
  };

  const persistTriggeredNotification = async (notification) => {
    const notificationId = notification?.request?.identifier;

    if (notificationId && handledNotificationIdsRef.current.has(notificationId)) {
      return;
    }

    if (notificationId) {
      handledNotificationIdsRef.current.add(notificationId);
    }

    const title = notification?.request?.content?.title || 'Smart Notification Hub';
    const message =
      notification?.request?.content?.body ||
      'A local notification was delivered on this device.';

    await DB.saveNotificationLog(title, message);
    await loadNotificationHistory();
  };

  useEffect(() => {
    if (!toast.visible) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setToast((currentToast) => ({
        ...currentToast,
        visible: false,
      }));
    }, 2400);

    return () => clearTimeout(timer);
  }, [toast.visible]);

  useEffect(() => {
    isMountedRef.current = true;

    let removeNotificationListeners = () => {};

    const initializeScreen = async () => {
      try {
        await DB.initDatabase();

        const permission =
          await NotificationService.requestNotificationPermissionsAsync();

        if (isMountedRef.current) {
          setPermissionState(permission);
        }

        await loadNotificationHistory();

        removeNotificationListeners = NotificationService.registerNotificationListeners({
          onNotificationReceived: (notification) => {
            persistTriggeredNotification(notification).catch((error) => {
              showToast(
                'error',
                'Log sync failed',
                error.message || 'The notification arrived but could not be saved.'
              );
            });
          },
          onNotificationResponse: (response) => {
            persistTriggeredNotification(response.notification).catch((error) => {
              showToast(
                'error',
                'Log sync failed',
                error.message || 'The notification opened but could not be saved.'
              );
            });
          },
        });
      } catch (error) {
        showToast(
          'error',
          'Setup failed',
          error.message || 'Unable to prepare notifications and database.'
        );
      } finally {
        if (isMountedRef.current) {
          setIsInitializing(false);
        }
      }
    };

    initializeScreen();

    return () => {
      isMountedRef.current = false;
      removeNotificationListeners();
    };
  }, []);

  const handleScheduleNotification = async () => {
    if (isInitializing || isScheduling) {
      return;
    }

    const trimmedTitle = draftTitle.trim();
    const trimmedMessage = draftMessage.trim();

    if (!trimmedTitle || !trimmedMessage) {
      showToast(
        'error',
        'Missing content',
        'Please enter both title and message before scheduling.'
      );
      return;
    }

    if (!permissionState.granted) {
      const nextPermission =
        await NotificationService.requestNotificationPermissionsAsync();

      if (isMountedRef.current) {
        setPermissionState(nextPermission);
      }

      if (!nextPermission.granted) {
        showToast(
          'error',
          nextPermission.isPhysicalDevice
            ? 'Permission required'
            : 'Physical device required',
          nextPermission.message
        );
        return;
      }
    }

    if (isMountedRef.current) {
      setIsScheduling(true);
    }

    try {
      await NotificationService.scheduleLocalNotificationAsync(
        trimmedTitle,
        trimmedMessage
      );

      showToast(
        'success',
        'Notification scheduled',
        'A local notification will appear on your device in about 2 seconds.'
      );
    } catch (error) {
      showToast(
        'error',
        'Schedule failed',
        error.message || 'Unable to schedule the local notification.'
      );
    } finally {
      if (isMountedRef.current) {
        setIsScheduling(false);
      }
    }
  };

  const applyTemplate = (template) => {
    setSelectedTemplateId(template.id);
    setDraftTitle(template.title);
    setDraftMessage(template.message);
  };

  const loadDraftFromHistory = (item) => {
    setSelectedTemplateId('custom');
    setDraftTitle(item.title || 'Smart Notification Hub');
    setDraftMessage(item.message || 'Notification content');
    showToast('success', 'Loaded from history', 'You can schedule this message again.');
  };

  const openClearHistoryModal = () => {
    if (history.length === 0) {
      showToast('error', 'Nothing to clear', 'The history list is already empty.');
      return;
    }

    setIsClearModalVisible(true);
  };

  const closeClearHistoryModal = () => {
    if (isClearing) {
      return;
    }

    setIsClearModalVisible(false);
  };

  const handleConfirmClearHistory = async () => {
    if (isClearing) {
      return;
    }

    setIsClearing(true);

    try {
      await DB.clearNotificationLogs();
      await loadNotificationHistory();
      showToast('success', 'History cleared', 'All notification logs were removed.');
      setIsClearModalVisible(false);
    } catch (error) {
      showToast(
        'error',
        'Clear failed',
        error.message || 'Unable to clear the notification history.'
      );
    } finally {
      if (isMountedRef.current) {
        setIsClearing(false);
      }
    }
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.logCard}
      onPress={() => loadDraftFromHistory(item)}
    >
      <View style={styles.logHeader}>
        <Text style={styles.logTitle}>{item.title}</Text>
        <View style={styles.logBadge}>
          <Text style={styles.logBadgeText}>Tap to reuse</Text>
        </View>
      </View>

      <Text style={styles.logMessage}>{item.message}</Text>
      <Text style={styles.logTimestamp}>{formatTimestamp(item.created_at)}</Text>
    </TouchableOpacity>
  );

  const isReadyState = permissionState.granted && permissionState.isPhysicalDevice;
  const latestLog = history[0];
  const primaryButtonLabel = isInitializing
    ? 'Preparing the hub...'
    : isScheduling
      ? 'Scheduling notification...'
      : 'Schedule local notification';

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHistoryItem}
        refreshing={isRefreshing}
        onRefresh={() => loadNotificationHistory(true)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>Smart Notification Hub</Text>
            <Text style={styles.screenTitle}>
              Local notifications with clean SQLite history.
            </Text>
            <Text style={styles.screenSubtitle}>
              Built for Expo Go device testing with a polished card-based UI,
              Android high-importance channel, and asynchronous SQLite storage.
            </Text>

            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Ready to test the full flow</Text>
              <Text style={styles.heroDescription}>
                Tap once to schedule a local alert. The app gives immediate
                feedback now, then stores the delivered notification in SQLite.
              </Text>

              <View style={styles.pillRow}>
                <View
                  style={[
                    styles.pill,
                    isReadyState ? styles.pillSuccess : styles.pillMuted,
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isReadyState ? styles.pillSuccessText : styles.pillMutedText,
                    ]}
                  >
                    {permissionState.granted ? 'Permission ready' : 'Permission needed'}
                  </Text>
                </View>

                <View
                  style={[
                    styles.pill,
                    permissionState.isPhysicalDevice
                      ? styles.pillPrimary
                      : styles.pillWarning,
                  ]}
                >
                  <Text style={styles.pillTextLight}>
                    {permissionState.isPhysicalDevice
                      ? 'Physical device flow'
                      : 'Simulator limited'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Delay</Text>
                <Text style={styles.metricValue}>2s</Text>
                <Text style={styles.metricHelper}>Local notification trigger</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Logs</Text>
                <Text style={styles.metricValue}>{history.length}</Text>
                <Text style={styles.metricHelper}>
                  {latestLog
                    ? `Latest: ${formatTimestamp(latestLog.created_at)}`
                    : 'No delivery recorded yet'}
                </Text>
              </View>
            </View>

            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Schedule one test notification</Text>
              <Text style={styles.actionDescription}>
                Immediate in-app feedback appears first. The history list updates
                after the notification is delivered to the device.
              </Text>

              <View style={styles.templateRow}>
                {QUICK_TEMPLATES.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    activeOpacity={0.85}
                    style={[
                      styles.templatePill,
                      selectedTemplateId === template.id && styles.templatePillActive,
                    ]}
                    onPress={() => applyTemplate(template)}
                  >
                    <Text
                      style={[
                        styles.templatePillText,
                        selectedTemplateId === template.id &&
                          styles.templatePillTextActive,
                      ]}
                    >
                      {template.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  value={draftTitle}
                  onChangeText={(value) => {
                    setSelectedTemplateId('custom');
                    setDraftTitle(value);
                  }}
                  style={styles.input}
                  placeholder="Enter notification title"
                  placeholderTextColor="#9CA3AF"
                  maxLength={80}
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Message</Text>
                <TextInput
                  value={draftMessage}
                  onChangeText={(value) => {
                    setSelectedTemplateId('custom');
                    setDraftMessage(value);
                  }}
                  style={[styles.input, styles.inputMultiline]}
                  placeholder="Enter notification message"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  maxLength={180}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.primaryButton,
                  (isInitializing || isScheduling) && styles.primaryButtonDisabled,
                ]}
                onPress={handleScheduleNotification}
                disabled={isInitializing || isScheduling}
              >
                {isScheduling ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>{primaryButtonLabel}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.secondaryButton}
                onPress={() => loadNotificationHistory(true)}
              >
                <Text style={styles.secondaryButtonText}>Refresh history</Text>
              </TouchableOpacity>

              <Text style={styles.supportingText}>{permissionState.message}</Text>
            </View>

            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Notification history</Text>
              <View style={styles.historyActions}>
                <View style={styles.historyCountBadge}>
                  <Text style={styles.historyCountText}>{history.length}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.clearHistoryButton}
                  onPress={openClearHistoryModal}
                >
                  <Text style={styles.clearHistoryButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyOrb} />
            <Text style={styles.emptyTitle}>No notification logs yet</Text>
            <Text style={styles.emptyDescription}>
              Schedule a local notification and wait for it to arrive. Once it is
              delivered, the record will appear here automatically.
            </Text>
          </View>
        }
        ListFooterComponent={<View style={styles.listFooter} />}
      />

      {toast.visible ? (
        <View pointerEvents="none" style={styles.toastContainer}>
          <View
            style={[
              styles.toast,
              toast.tone === 'error' ? styles.toastError : styles.toastSuccess,
            ]}
          >
            <Text style={styles.toastTitle}>{toast.title}</Text>
            <Text style={styles.toastMessage}>{toast.message}</Text>
          </View>
        </View>
      ) : null}

      <Modal
        animationType="fade"
        transparent
        visible={isClearModalVisible}
        onRequestClose={closeClearHistoryModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Clear notification history?</Text>
            <Text style={styles.modalMessage}>
              This action removes every stored log from SQLite and cannot be undone.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.modalCancelButton}
                onPress={closeClearHistoryModal}
                disabled={isClearing}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.modalDangerButton}
                onPress={handleConfirmClearHistory}
                disabled={isClearing}
              >
                {isClearing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalDangerText}>Clear all</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F5F7',
  },
  contentContainer: {
    paddingTop: Platform.select({
      ios: 72,
      android: 52,
      default: 52,
    }),
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: '#F27123',
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#111827',
  },
  screenSubtitle: {
    marginTop: 12,
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 28,
    padding: 20,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroDescription: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#D1D5DB',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,
  },
  pillPrimary: {
    backgroundColor: '#F27123',
  },
  pillSuccess: {
    backgroundColor: '#DCFCE7',
  },
  pillMuted: {
    backgroundColor: '#E5E7EB',
  },
  pillWarning: {
    backgroundColor: '#92400E',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextLight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pillSuccessText: {
    color: '#166534',
  },
  pillMutedText: {
    color: '#4B5563',
  },
  metricRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#9CA3AF',
  },
  metricValue: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  metricHelper: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
    marginBottom: 22,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  actionDescription: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  templatePill: {
    backgroundColor: '#FFF3EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  templatePillActive: {
    backgroundColor: '#F27123',
  },
  templatePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  templatePillTextActive: {
    color: '#FFFFFF',
  },
  inputBlock: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    color: '#111827',
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 86,
    paddingTop: 12,
    paddingBottom: 12,
  },
  primaryButton: {
    minHeight: 56,
    marginTop: 20,
    borderRadius: 18,
    backgroundColor: '#F27123',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 52,
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: '#FFF3EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#C2410C',
    fontSize: 14,
    fontWeight: '700',
  },
  supportingText: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  historyCountBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F4D1BC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C2410C',
  },
  clearHistoryButton: {
    marginLeft: 10,
    minHeight: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
  },
  clearHistoryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3EB',
    borderWidth: 10,
    borderColor: '#FFE1CF',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptyDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
    textAlign: 'center',
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logTitle: {
    flex: 1,
    paddingRight: 12,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: '#111827',
  },
  logBadge: {
    backgroundColor: '#FFF3EB',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
  logMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  logTimestamp: {
    marginTop: 12,
    fontSize: 12,
    color: '#9CA3AF',
  },
  listFooter: {
    height: 20,
  },
  toastContainer: {
    position: 'absolute',
    top: Platform.select({
      ios: 58,
      android: 34,
      default: 34,
    }),
    left: 20,
    right: 20,
  },
  toast: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 4,
  },
  toastSuccess: {
    backgroundColor: '#143D2B',
  },
  toastError: {
    backgroundColor: '#6B1D1D',
  },
  toastTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toastMessage: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#F3F4F6',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.56)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
  },
  modalActions: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    marginRight: 6,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  modalDangerButton: {
    flex: 1,
    marginLeft: 6,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#B91C1C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDangerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});