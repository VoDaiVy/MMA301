import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard    from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import useCart        from '../hooks/useCart';
import useFavorites   from '../hooks/useFavorites';
import useGeminiAI, { extractPriceHint } from '../hooks/useGeminiAI';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING, RADIUS } from '../constants/theme';

const LIMIT    = 10;
const BASE_URL = 'https://dummyjson.com/products';

const AI_SUGGESTION_CHIPS = [
  { label: '📱 smartphones < $500',  category: 'smartphones',    priceHint: { mode: 'under', value: 500  } },
  { label: '💻 Laptop < $1,999',    category: 'laptops',        priceHint: { mode: 'under', value: 1999 } },
  { label: '💄 Skincare',           category: 'skin-care' },
  { label: '👗 Women\'s Dresses < $50',          category: 'womens-dresses', priceHint: { mode: 'under', value: 50   } },
  { label: '⌚ Men\'s Watches',        category: 'mens-watches' },
  { label: '🌸 Fragrances',          category: 'fragrances' },
];

const CATEGORIES = [
  { emoji: '✦', name: 'All',   value: '' },
  { emoji: '📱', name: 'Phones', value: 'smartphones' },
  { emoji: '💻', name: 'Laptop',    value: 'laptops' },
  { emoji: '⌚', name: 'Watches',  value: 'mens-watches' },
  { emoji: '👗', name: 'Dresses', value: 'womens-dresses' },
  { emoji: '💄', name: 'Beauty',  value: 'beauty' },
  { emoji: '🛋', name: 'Home', value: 'home-decoration' },
];

export default function ProductListScreen({ navigation }) {
  const { addToCart }                       = useCart();
  const { isFavorite, toggleFavorite }       = useFavorites();
  const { analyzeRequest, loading: aiLoading } = useGeminiAI();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [products,    setProducts   ] = useState([]);
  const [loading,     setLoading    ] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip,        setSkip       ] = useState(0);
  const [total,       setTotal      ] = useState(0);
  const [error,       setError      ] = useState(null);

  // ── Search state ────────────────────────────────────────────────────────────
  const [searchQuery,      setSearchQuery     ] = useState('');
  const [searching,        setSearching       ] = useState(false);
  const [activePriceFilter, setActivePriceFilter] = useState(''); // label hiển thị chip giá
  const searchTimeout                            = useRef(null);
  const trimmedQuery                             = searchQuery.trim();
  const isSearch                                 = trimmedQuery.length >= 2;

  // ── AI Modal state ──────────────────────────────────────────────────────────
  const [aiModalVisible,  setAiModalVisible ] = useState(false);
  const [aiInput,         setAiInput        ] = useState('');
  // 'input' → 'thinking' → 'results'
  const [aiStep,          setAiStep         ] = useState('input');
  const [aiResults,       setAiResults      ] = useState([]);
  const [aiResultKeyword, setAiResultKeyword] = useState('');
  const [aiResultExpl,    setAiResultExpl   ] = useState('');
  // Shown in the top-of-screen chip after modal closes
  const [aiKeyword,       setAiKeyword      ] = useState('');
  const [aiResultText,    setAiResultText   ] = useState('');
  const fabScale          = useRef(new Animated.Value(1)).current;
  const fabPulse          = useRef(new Animated.Value(1)).current;
  const [activeCategory,  setActiveCategory ] = useState('');
  const [searchFocused,   setSearchFocused  ] = useState(false);
  const aiJustSearchedRef = useRef(false);

  // ── Fetch helpers ────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (currentSkip = 0, replace = false) => {
    try {
      replace ? setLoading(true) : setLoadingMore(true);
      setError(null);
      const res  = await fetch(`${BASE_URL}?limit=${LIMIT}&skip=${currentSkip}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(prev => replace ? data.products : [...prev, ...data.products]);
      setTotal(data.total);
      setSkip(currentSkip + data.products.length);
    } catch (e) {
      setError('Failed to load products. Tap Retry.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const searchProducts = useCallback(async (query) => {
    try {
      setSearching(true);
      setError(null);

      let priceFilter = null;
      let cleanQuery  = query.trim();
      let priceLabel  = '';

      // ── 1. Range pattern: "$50-$200", "50 to 200", "$50–$300" ─────────────
      const rangeMatch = cleanQuery.match(
        /\$?\s*([\d,.]+)\s*(?:[-–]|\bto\b)\s*\$?\s*([\d,.]+)/i
      );
      if (rangeMatch) {
        const lo = parseFloat(rangeMatch[1].replace(/,/g, ''));
        const hi = parseFloat(rangeMatch[2].replace(/,/g, ''));
        if (!isNaN(lo) && !isNaN(hi)) {
          const minP = Math.min(lo, hi);
          const maxP = Math.max(lo, hi);
          priceFilter = { mode: 'range', lo: minP, hi: maxP };
          priceLabel  = `$${minP} – $${maxP}`;
          cleanQuery  = cleanQuery.replace(rangeMatch[0], '').replace(/\s{2,}/g, ' ').trim();
        }
      }

      // ── 2. under / over / around via extractPriceHint ────────────────────
      if (!priceFilter) {
        const hint = extractPriceHint(cleanQuery);
        if (hint) {
          priceFilter = hint;
          if (hint.mode === 'under')  priceLabel = `Under $${hint.value}`;
          else if (hint.mode === 'over')  priceLabel = `Over $${hint.value}`;
          else                            priceLabel = `Around $${hint.value}`;
          // Strip price tokens so the keyword search is clean
          cleanQuery = cleanQuery
            .replace(/(?:under|below|less\s+than|<)\s*\$?\s*[\d,.]+/gi, '')
            .replace(/(?:over|above|more\s+than|greater\s+than|>)\s*\$?\s*[\d,.]+/gi, '')
            .replace(/\$\s*[\d,.]+/g, '')
            .replace(/[\d,.]+\s*\$/g, '')
            .replace(/[\d,.]+\s*(?:usd|vnd|eur|gbp|đ)/gi, '')
            .replace(/\b\d[\d,.]*\b/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
        }
      }

      setActivePriceFilter(priceLabel);

      // ── 3. Fetch products ────────────────────────────────────────────────
      let apiProducts = [];

      if (cleanQuery.length < 2) {
        // Price-only search → fetch all products then filter client-side
        const res  = await fetch(`${BASE_URL}?limit=200&skip=0`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        apiProducts  = data.products;
      } else {
        const res  = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(cleanQuery)}&limit=200`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Client-side word filter removes loosely-related fuzzy results
        const lq = cleanQuery.toLowerCase();
        const SKIP_WORDS = new Set(['the','and','for','under','over','with','from','best','good','some','any']);
        const qWords = lq.split(/\s+/).filter(w => w.length >= 3 && !SKIP_WORDS.has(w));
        apiProducts = data.products.filter((p) => {
          const haystack = [p.title, p.category, ...(p.tags ?? [])].join(' ').toLowerCase();
          return qWords.length > 0
            ? qWords.some(w => haystack.includes(w))
            : haystack.includes(lq);
        });
      }

      // ── 4. Apply price filter ────────────────────────────────────────────
      if (priceFilter) {
        const TOLERANCE = 0.20; // ±20% cho mode 'around'
        if (priceFilter.mode === 'range') {
          apiProducts = apiProducts.filter(p => p.price >= priceFilter.lo && p.price <= priceFilter.hi);
        } else if (priceFilter.mode === 'under') {
          apiProducts = apiProducts.filter(p => p.price <= priceFilter.value);
        } else if (priceFilter.mode === 'over') {
          apiProducts = apiProducts.filter(p => p.price >= priceFilter.value);
        } else {
          // around ±20%
          apiProducts = apiProducts.filter(p =>
            p.price >= priceFilter.value * (1 - TOLERANCE) &&
            p.price <= priceFilter.value * (1 + TOLERANCE)
          );
        }
      }

      setProducts(apiProducts);
      setTotal(apiProducts.length);
    } catch (e) {
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  }, []);

  // ── Initial load ─────────────────────────────────────────────────────────────
  useEffect(() => { fetchProducts(0, true); }, [fetchProducts]);

  // ── FAB idle pulse ───────────────────────────────────────────────────────────
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(fabPulse, { toValue: 1.13, duration: 900, useNativeDriver: true }),
        Animated.timing(fabPulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [fabPulse]);

  // ── Debounced search ─────────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    // Check ref FIRST so category / AI fetches are never overridden by this effect
    if (aiJustSearchedRef.current) {
      aiJustSearchedRef.current = false;
      return;
    }
    if (trimmedQuery === '') {
      setActivePriceFilter('');
      fetchProducts(0, true);
      return;
    }
    if (trimmedQuery.length < 2) return;
    searchTimeout.current = setTimeout(() => searchProducts(trimmedQuery), 500);
    return () => clearTimeout(searchTimeout.current);
  }, [trimmedQuery, fetchProducts, searchProducts]);

  // ── Pagination ───────────────────────────────────────────────────────────────
  const handleEndReached = () => {
    if (isSearch || loadingMore || loading || skip >= total) return;
    fetchProducts(skip, false);
  };

  // ── FAB spring animation ─────────────────────────────────────────────────────
  const animateFab = () => {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.78, duration: 80,  useNativeDriver: true }),
      Animated.spring(fabScale,  { toValue: 1,    tension: 260, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  // ── Category chip tap ────────────────────────────────────────────────────────
  const handleCategoryPress = async (cat) => {
    setActiveCategory(cat.value);
    setAiKeyword('');
    setAiResultText('');
    setActivePriceFilter('');
    aiJustSearchedRef.current = true; // prevent debounced-search from overriding
    setSearchQuery('');
    if (!cat.value) {
      fetchProducts(0, true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/category/${encodeURIComponent(cat.value)}?limit=200`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total ?? data.products.length);
      setSkip(data.products.length);
    } catch {
      setError('Failed to load category.');
    } finally {
      setLoading(false);
    }
  };

  // ── AI helpers ────────────────────────────────────────────────────────────────
  const resetAiModal = () => {
    setAiStep('input');
    setAiInput('');
    setAiResults([]);
    setAiResultKeyword('');
    setAiResultExpl('');
  };

  const closeAiModal = () => {
    setAiModalVisible(false);
    resetAiModal();
  };

  // Push AI results to the main product grid
  const handleViewAllAiResults = () => {
    aiJustSearchedRef.current = true;
    setAiKeyword(aiResultKeyword);
    setAiResultText(aiResultExpl);
    setProducts(aiResults);
    setTotal(aiResults.length);
    setSearchQuery(aiResultKeyword);
    setAiModalVisible(false);
    resetAiModal();
  };

  // Direct chip handler — bypasses Gemini, hits /category/ endpoint for exact results
  const handleChipTap = async (chip) => {
    setAiStep('thinking');
    try {
      const res  = await fetch(`${BASE_URL}/category/${encodeURIComponent(chip.category)}?limit=200`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      let products = data.products;
      let priceLabel = '';
      if (chip.priceHint) {
        products   = products.filter(p => p.price <= chip.priceHint.value);
        priceLabel = ` < $${chip.priceHint.value}`;
      }
      setAiResults(products);
      setAiResultKeyword(chip.label + priceLabel);
      setAiResultExpl(`${products.length} sản phẩm tìm thấy`);
      setAiStep('results');
    } catch {
      setAiStep('input');
    }
  };

  // 3-step: input → thinking → results
  // `text` param lets chip taps pass text directly (avoids stale state issue)
  const handleAiSubmit = async (text) => {
    const query = (typeof text === 'string' ? text : aiInput).trim();
    if (!query || aiLoading) return;
    setAiStep('thinking');
    const result = await analyzeRequest(query);
    if (!result) { setAiStep('input'); return; }
    try {
      // Trust dummyjson's own search — no category word-filter applied here.
      const res  = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(result.keyword)}&limit=200`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // ── Price filter ────────────────────────────────────────────────────────
      // If the user mentioned a price, narrow results to that budget range.
      let products = data.products;
      let priceLabel = '';
      const ph = result.priceHint;
      if (ph && !isNaN(ph.value)) {
        const TOLERANCE = 0.30; // ±30 % for "around" mode
        if (ph.mode === 'under') {
          products  = products.filter(p => p.price <= ph.value);
          priceLabel = ` under $${ph.value}`;
        } else if (ph.mode === 'over') {
          products  = products.filter(p => p.price >= ph.value);
          priceLabel = ` over $${ph.value}`;
        } else {
          // 'around' — ±30% bracket
          const lo = ph.value * (1 - TOLERANCE);
          const hi = ph.value * (1 + TOLERANCE);
          products  = products.filter(p => p.price >= lo && p.price <= hi);
          priceLabel = ` around $${ph.value}`;
        }
      }

      setAiResults(products);
      setAiResultKeyword(result.keyword + priceLabel);
      setAiResultExpl(result.explanation);
      setAiStep('results');
    } catch {
      setAiStep('input');
    }
  };

  // ── FlatList helpers ─────────────────────────────────────────────────────────
  const renderItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      onAddToCart={() => addToCart({
        id:       String(item.id),
        name:     item.title,
        price:    item.price,
        image:    item.thumbnail,
        category: item.category,
      })}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={() => toggleFavorite(item)}
    />
  );

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.footerLoaderText}>Loading more…</Text>
      </View>
    ) : null;

  const renderEmpty = () =>
    loading || searching ? null : (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyText}>
          {trimmedQuery.length > 0 && trimmedQuery.length < 2
            ? 'Type at least 2 characters to search'
            : 'No products found.'}
        </Text>
        {isSearch && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.clearSearchBtn}
            onPress={() => { setSearchQuery(''); setAiResultText(''); setAiKeyword(''); setActivePriceFilter(''); }}
          >
            <Text style={styles.clearSearchBtnText}>Clear search</Text>
          </TouchableOpacity>
        )}
      </View>
    );

  // ── Error (no data) ──────────────────────────────────────────────────────────
  if (error && products.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => fetchProducts(0, true)}>
          <LinearGradient colors={['#6C63FF','#4152C8']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>

      {/* ══ HERO HEADER ══ */}
      <LinearGradient
        colors={['#3D4FC4', '#6C63FF', '#9B8FFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.blobTL} />
        <View style={styles.blobBR} />
        <Text style={styles.heroGreeting}>Welcome back 👋</Text>
        <Text style={styles.heroTitle}>{'Find your next\nfavourite item'}</Text>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Text style={styles.searchIconHero}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or price, e.g. laptop < $500…"
            placeholderTextColor="rgba(79,99,210,0.45)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
          {searching
            ? <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 4 }} />
            : null
          }
        </View>
      </LinearGradient>

      {/* ── Category chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
        style={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.value;
          return (
            <TouchableOpacity key={cat.value} activeOpacity={0.75} onPress={() => handleCategoryPress(cat)}>
              {active ? (
                <LinearGradient
                  colors={['#6C63FF', '#3D4FC4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.catChipActive}
                >
                  <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
                  <Text style={styles.catChipTextActive}>{cat.name}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.catChip}>
                  <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
                  <Text style={styles.catChipText}>{cat.name}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── AI result chip ── */}
      {!!aiKeyword && (
        <View style={styles.aiChip}>
          <Text style={styles.aiChipIcon}>✦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiChipKeyword} numberOfLines={1}>"{aiKeyword}"</Text>
            {!!aiResultText && (
              <Text style={styles.aiChipText} numberOfLines={1}>{aiResultText}</Text>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => { setAiResultText(''); setAiKeyword(''); setSearchQuery(''); setActiveCategory(''); setActivePriceFilter(''); }}
          >
            <Text style={styles.aiChipClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Price filter chip ── */}
      {!!activePriceFilter && !aiKeyword && (
        <View style={styles.priceChip}>
          <Text style={styles.priceChipIcon}>💰</Text>
          <Text style={styles.priceChipLabel} numberOfLines={1}>{activePriceFilter}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => { setActivePriceFilter(''); setSearchQuery(''); fetchProducts(0, true); }}
          >
            <Text style={styles.aiChipClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Min-length hint ── */}
      {trimmedQuery.length === 1 && (
        <Text style={styles.searchHint}>Type 1 more character to search…</Text>
      )}

      {/* ── Results count ── */}
      {!loading && trimmedQuery.length !== 1 && (
        <View style={styles.resultsRow}>
          <Text style={styles.resultsCount}>
            {isSearch
              ? `${products.length} result${products.length !== 1 ? 's' : ''} for "${trimmedQuery}"`
              : `${total} products`}
          </Text>
          {(isSearch || activeCategory !== '') && (
            <TouchableOpacity
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => { setSearchQuery(''); setActiveCategory(''); setAiKeyword(''); setAiResultText(''); setActivePriceFilter(''); fetchProducts(0, true); }}
            >
              <Text style={styles.clearAllText}>Clear ✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ── Skeleton OR product grid ── */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* ── FAB ── */}
      <Animated.View style={[styles.fabWrap, { transform: [{ scale: fabPulse }] }]}>
        <View style={styles.fabGlow} />
        <Animated.View style={{ transform: [{ scale: fabScale }] }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { animateFab(); resetAiModal(); setAiModalVisible(true); }}
          >
            <LinearGradient
              colors={['#9B8FFF', '#6C63FF', '#3D4FC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabInner}
            >
              <Text style={styles.fabSparkIcon}>✦</Text>
              <Text style={styles.fabLabel}>AI</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* ── AI Assistant Modal ── */}
      <Modal
        visible={aiModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeAiModal}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closeAiModal} />

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.modalSheet, aiStep === 'results' && styles.modalSheetTall]}>
              <View style={styles.modalHandle} />

              {/* ── Header (always visible) ── */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <LinearGradient
                    colors={['#9B8FFF', '#6C63FF', '#3D4FC4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalAiIcon}
                  >
                    {aiStep === 'thinking'
                      ? <ActivityIndicator size="small" color={COLORS.white} />
                      : <Text style={styles.modalAiIconText}>✦</Text>}
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>AI Shopping Assistant</Text>
                    <Text style={styles.modalSubtitle}>
                      {aiStep === 'input'    && 'Describe what you\'re looking for'}
                      {aiStep === 'thinking' && 'Finding the best products for you…'}
                      {aiStep === 'results'  && `Found ${aiResults.length} product${aiResults.length !== 1 ? 's' : ''} for “${aiResultKeyword}”`}
                    </Text>
                  </View>
                  {aiStep === 'results' && (
                    <TouchableOpacity onPress={() => setAiStep('input')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Text style={styles.modalBackText}>← Back</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* ── INPUT state ── */}
              {aiStep === 'input' && (
                <>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsRow}>
                    {AI_SUGGESTION_CHIPS.map((chip) => (
                      <TouchableOpacity
                        key={chip.label} activeOpacity={0.7}
                        style={styles.suggChip}
                        onPress={() => handleChipTap(chip)}
                      >
                        <Text style={styles.suggChipText}>{chip.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.aiInputWrap}>
                    <TextInput
                      style={styles.aiInput}
                      placeholder="E.g. Find me a smartphone under $200…"
                      placeholderTextColor={COLORS.textDisabled}
                      value={aiInput}
                      onChangeText={setAiInput}
                      multiline maxLength={200} autoFocus
                    />
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.cancelBtn} onPress={closeAiModal}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.searchAiBtnWrap}
                      onPress={() => handleAiSubmit()}
                      disabled={!aiInput.trim()}
                    >
                      <LinearGradient
                        colors={aiInput.trim() ? ['#9B8FFF', '#3D4FC4'] : [COLORS.textDisabled, COLORS.textDisabled]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.searchAiBtn}
                      >
                        <Text style={styles.searchAiBtnText}>✦ Search with AI</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* ── THINKING state ── */}
              {aiStep === 'thinking' && (
                <View style={styles.thinkingContainer}>
                  <View style={styles.thinkingDots}>
                    <View style={[styles.thinkingDot, { opacity: 1 }]} />
                    <View style={[styles.thinkingDot, { opacity: 0.6 }]} />
                    <View style={[styles.thinkingDot, { opacity: 0.3 }]} />
                  </View>
                  <Text style={styles.thinkingText}>AI is analyzing your request…</Text>
                  <Text style={styles.thinkingCaption}>Searching the catalog for the best matches</Text>
                </View>
              )}

              {/* ── RESULTS state ── */}
              {aiStep === 'results' && (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
                  {aiResults.length === 0 ? (
                    <View style={styles.aiNoResults}>
                      <Text style={styles.aiNoResultsIcon}>🔍</Text>
                      <Text style={styles.aiNoResultsText}>No products found for this request.{`\n`}Try a different description.</Text>
                      <TouchableOpacity style={styles.aiBackBtn} onPress={() => setAiStep('input')}>
                        <Text style={styles.aiBackBtnText}>← Try again</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <FlatList
                        data={aiResults.slice(0, 4)}
                        keyExtractor={item => String(item.id)}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.aiResultsRow}
                        contentContainerStyle={styles.aiResultsList}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.aiResultCard}
                            activeOpacity={0.7}
                            onPress={() => { closeAiModal(); navigation.navigate('ProductDetail', { product: item }); }}
                          >
                            <Image source={{ uri: item.thumbnail }} style={styles.aiResultImg} resizeMode="contain" />
                            <Text style={styles.aiResultTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.aiResultPrice}>${item.price.toFixed(2)}</Text>
                          </TouchableOpacity>
                        )}
                      />
                      <View style={styles.aiResultsFooter}>
                        <TouchableOpacity activeOpacity={0.7} onPress={handleViewAllAiResults}>
                          <LinearGradient
                            colors={['#6C63FF', '#3D4FC4']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.viewAllBtn}
                          >
                            <Text style={styles.viewAllBtnText}>View all {aiResults.length} results →</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setAiStep('input')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <Text style={styles.newSearchText}>← New search</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </ScrollView>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2FF',
  },

  // ── Hero header
  hero: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.base,
    overflow: 'hidden',
  },
  blobTL: {
    position: 'absolute', top: -50, left: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  blobBR: {
    position: 'absolute', bottom: -30, right: -20,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroGreeting: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.extraBold,
    color: '#FFFFFF',
    lineHeight: 30,
    marginBottom: SPACING.lg,
    letterSpacing: 0.1,
  },

  // ── Search bar (inside hero, white card)
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 13,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
  searchBarFocused: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.22,
  },
  searchIconHero: { fontSize: 15, marginRight: SPACING.sm, color: COLORS.primary },
  searchInput:    { flex: 1, fontSize: FONT_SIZES.base, color: COLORS.textPrimary, paddingVertical: 0 },
  searchHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textDisabled,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
    fontStyle: 'italic',
  },

  // ── Category chips
  categoryScroll: {
    flexShrink: 0,
    height: 62,
  },
  categoryRow: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: '#818CF8',
    backgroundColor: '#EEF2FF',
    gap: 5,
  },
  catChipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 5,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  catChipEmoji:      { fontSize: 14, lineHeight: 18 },
  catChipText:       { fontSize: 13, color: '#3730A3', fontWeight: '700' },
  catChipTextActive: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },

  // ── AI chip
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  aiChipIcon:    { fontSize: 13, color: COLORS.primary },
  aiChipKeyword: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: FONT_WEIGHTS.bold },
  aiChipText:    { fontSize: 10, color: COLORS.textSecondary, marginTop: 1 },
  aiChipClose:   { fontSize: 12, color: COLORS.primary, fontWeight: FONT_WEIGHTS.bold, padding: 2 },

  // ── Price filter chip (displayed below AI chip when user searches by price)
  priceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  priceChipIcon:  { fontSize: 13 },
  priceChipLabel: { flex: 1, fontSize: FONT_SIZES.sm, color: '#16A34A', fontWeight: FONT_WEIGHTS.bold },

  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
  },
  resultsCount: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: 0.3,
  },
  clearAllText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semiBold,
  },

  // ── Grid
  list: { paddingHorizontal: SPACING.base, paddingBottom: 100 },
  row:  { justifyContent: 'space-between', gap: SPACING.md, marginBottom: SPACING.md },

  // ── Footer loader
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  footerLoaderText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },

  // ── Centered states
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xxl,
    gap: SPACING.md,
  },
  errorIcon: { fontSize: 48 },
  errorText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: 'center' },
  retryBtn: {
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
    alignItems: 'center',
  },
  retryBtnText: { color: COLORS.white, fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.bold },

  // ── Empty
  emptyContainer: { alignItems: 'center', paddingTop: SPACING.huge, gap: SPACING.md },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  clearSearchBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  clearSearchBtnText: { color: COLORS.primary, fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.semiBold },

  // ── FAB
  fabWrap: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabGlow: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(108,99,255,0.22)',
  },
  fabInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 12,
  },
  fabSparkIcon: { fontSize: 22, color: COLORS.white, lineHeight: 26 },
  fabLabel: { fontSize: 9, color: 'rgba(255,255,255,0.92)', fontWeight: FONT_WEIGHTS.bold, letterSpacing: 1 },

  // ── Modal
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  modalHeader: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  modalAiIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAiIconText: { fontSize: 20, color: COLORS.white },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  modalSubtitle: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },

  // Suggestion chips
  suggestionsRow: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  suggChip: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  suggChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  suggChipLoading: {
    opacity: 0.7,
  },
  suggChipText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.medium },
  suggChipTextActive: { color: COLORS.primary },

  // AI Input
  aiInputWrap: {
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.md,
    minHeight: 80,
    marginBottom: SPACING.md,
  },
  aiInput: { fontSize: FONT_SIZES.base, color: COLORS.textPrimary, lineHeight: 22 },

  // Modal actions
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    gap: SPACING.md,
  },
  cancelBtn: {
    paddingHorizontal: SPACING.xl,
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.medium },
  searchAiBtnWrap: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 5,
  },
  searchAiBtn: {
    height: 50,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchAiBtnText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  // ── Modal variants
  modalSheetTall: { maxHeight: '88%' },
  modalBackText: { fontSize: FONT_SIZES.xs, color: COLORS.primary, fontWeight: FONT_WEIGHTS.semiBold },

  // ── Thinking state
  thinkingContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: SPACING.lg,
  },
  thinkingDots: { flexDirection: 'row', gap: 8 },
  thinkingDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  thinkingText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textPrimary,
  },
  thinkingCaption: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },

  // ── Results state
  aiResultsList: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm },
  aiResultsRow:  { gap: SPACING.sm, marginBottom: SPACING.sm },
  aiResultCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 4,
  },
  aiResultImg: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F0F3FF',
  },
  aiResultTitle: {
    fontSize: 11,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 15,
    minHeight: 30,
  },
  aiResultPrice: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#1E40AF',
  },
  aiResultsFooter: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.md,
  },
  viewAllBtn: {
    width: '100%',
    height: 50,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 5,
  },
  viewAllBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
  },
  newSearchText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  aiNoResults: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: SPACING.base,
    gap: SPACING.md,
  },
  aiNoResultsIcon: { fontSize: 44 },
  aiNoResultsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  aiBackBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  aiBackBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
});
