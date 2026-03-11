import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

function SkimBox({ style }) {
  return <View style={[sk.box, style]} />;
}

function SkeletonCard({ animatedStyle }) {
  return (
    <Animated.View style={[sk.card, animatedStyle]}>
      <View style={sk.imageArea} />

      <View style={sk.body}>
        <SkimBox style={{ width: '40%', height: 10, borderRadius: 5 }} />
        <SkimBox style={{ width: '92%', height: 13, borderRadius: 5, marginTop: 7 }} />
        <SkimBox style={{ width: '68%', height: 13, borderRadius: 5, marginTop: 5 }} />
        <SkimBox style={{ width: '55%', height: 10, borderRadius: 5, marginTop: 7 }} />
        <View style={sk.footer}>
          <SkimBox style={{ width: '38%', height: 17, borderRadius: 5 }} />
          <SkimBox style={{ width: 32, height: 32, borderRadius: 16 }} />
        </View>
      </View>
    </Animated.View>
  );
}

export default function SkeletonLoader({ count = 6 }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 750, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const animatedStyle = {
    opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] }),
  };

  const rows = Array(Math.ceil(count / 2)).fill(null);

  return (
    <View style={sk.container}>
      {rows.map((_, rowIdx) => (
        <View key={rowIdx} style={sk.row}>
          <SkeletonCard animatedStyle={animatedStyle} />
          {rowIdx * 2 + 1 < count && <SkeletonCard animatedStyle={animatedStyle} />}
        </View>
      ))}
    </View>
  );
}

const sk = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  imageArea: {
    height: 140,
    backgroundColor: '#E9ECEF',
  },
  body: {
    padding: SPACING.md,
  },
  box: {
    backgroundColor: '#E9ECEF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
