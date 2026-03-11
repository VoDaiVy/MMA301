import { useState, useCallback } from 'react';
import { GEMINI_API_KEY, GEMINI_MODEL } from '../constants/config';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const KEYWORD_MAP = `
smartphone/mobile/phone → "phone"
laptop/computer/notebook → "laptop"
tablet/ipad → "tablet"
watch/timepiece → "watch"
fragrance/perfume/cologne → "fragrance"
skin care/skincare/moisturizer/serum → "skin"
beauty/makeup/cosmetics/lipstick/mascara → "Essence" or "lipstick"
groceries/food/snack → "grocery"
decoration/decor/home → "decoration"
furniture/sofa/chair/table → "Chair" or "sofa"
kitchen/cookware/utensil → "kitchen"
shirt/top/blouse → "shirt"
dress/skirt → "dress"
shoes/sneakers/heels → "shoe"
bag/purse/handbag → "bag"
jewellery/jewelry/necklace/ring → "jewellery"
sunglasses/glasses → "sunglasses"
sports/fitness/gym/exercise → "sports"
automotive/car/vehicle → "vehicle"
bike/motorcycle → "motorcycle"
headphones/earbuds/audio → "mobile accessories"
lighting/lamp/bulb → "decoration"
gifts for men → "watch" or "shirt"
gifts for women → "dress" or "bag"`;

const KEYWORD_NORMALIZE = {
  // phones
  smartphone: 'phone', smartphones: 'phone', mobiles: 'phone', 'cell phone': 'phone',
  'cell phones': 'phone', mobile: 'phone',
  // laptops
  laptops: 'laptop', computer: 'laptop', computers: 'laptop', notebook: 'laptop', notebooks: 'laptop',
  // tablets
  tablets: 'tablet', ipad: 'tablet',
  // watches
  watches: 'watch',
  'mens watch': 'watch', "men's watch": 'watch', 'mens watches': 'watch', "men's watches": 'watch',
  'womens watch': 'watch', "women's watch": 'watch', 'womens watches': 'watch', "women's watches": 'watch',
  // dresses / fashion
  dresses: 'dress', 'womens dress': 'dress', "women's dress": 'dress',
  'womens dresses': 'dress', "women's dresses": 'dress', skirt: 'dress', skirts: 'dress',
  // fragrances
  fragrances: 'fragrance', perfume: 'fragrance', perfumes: 'fragrance', cologne: 'fragrance',
  // kitchen
  'kitchen accessories': 'kitchen', kitchenware: 'kitchen', cookware: 'kitchen', cooking: 'kitchen',
  // skin
  skincare: 'skin', 'skin care': 'skin', moisturizer: 'skin', serum: 'skin',
  // shirts / tops
  shirts: 'shirt', 'mens shirt': 'shirt', "men's shirt": 'shirt', "men's shirts": 'shirt',
  blouse: 'shirt', blouses: 'shirt', tops: 'shirt',
  // shoes
  shoes: 'shoe', sneaker: 'shoe', sneakers: 'shoe', heels: 'shoe', heel: 'shoe',
  'mens shoes': 'shoe', "men's shoes": 'shoe', 'womens shoes': 'shoe', "women's shoes": 'shoe',
  // bags
  bags: 'bag', purse: 'bag', handbag: 'bag', handbags: 'bag', purses: 'bag',
  'womens bags': 'bag', "women's bags": 'bag',
  // jewellery
  jewelry: 'jewellery', necklace: 'jewellery', necklaces: 'jewellery',
  ring: 'jewellery', rings: 'jewellery', bracelet: 'jewellery',
  'womens jewellery': 'jewellery', "women's jewellery": 'jewellery',
  // sunglasses
  sunglass: 'sunglasses', glasses: 'sunglasses',
  // sports
  sport: 'sports', fitness: 'sports', gym: 'sports', exercise: 'sports', workout: 'sports',
  'sports accessories': 'sports', 'sports equipment': 'sports',
  // mobile accessories
  'mobile accessories': 'mobile', 'phone accessories': 'mobile',
  headphones: 'mobile', earphones: 'mobile', earbuds: 'mobile', charger: 'mobile',
  // vehicle / motorcycle
  car: 'vehicle', cars: 'vehicle', automotive: 'vehicle', auto: 'vehicle',
  bike: 'motorcycle', motorbike: 'motorcycle',
};

export function extractPriceHint(raw) {
  // Normalise: remove thousands-separators so "1,999" → "1999"
  const t = (raw ?? '').toLowerCase().replace(/,/g, '');

  let m;
  // "under/below/less than $X" or "< $X"
  m = t.match(/(?:under|below|less\s+than|<)\s*\$?\s*([\d.]+)/);
  if (m) return { value: parseFloat(m[1]), mode: 'under' };

  // "over/above/more than/greater than $X" or "> $X"
  m = t.match(/(?:over|above|more\s+than|greater\s+than|>)\s*\$?\s*([\d.]+)/);
  if (m) return { value: parseFloat(m[1]), mode: 'over' };

  // "$X" at start or inline
  m = t.match(/\$\s*([\d.]+)/);
  if (m) return { value: parseFloat(m[1]), mode: 'around' };

  // "X$" number-then-dollar
  m = t.match(/([\d.]+)\s*\$/);
  if (m) return { value: parseFloat(m[1]), mode: 'around' };

  // "X usd/vnd/eur/gbp/đ"
  m = t.match(/([\d.]+)\s*(?:usd|vnd|eur|gbp|đ)/);
  if (m) return { value: parseFloat(m[1]), mode: 'around' };

  // Standalone number >= 10 (plausible product price)
  m = t.match(/\b(\d{2,}(?:\.\d+)?)\b/);
  if (m && parseFloat(m[1]) >= 10) return { value: parseFloat(m[1]), mode: 'around' };

  return null;
}

function sanitizeInput(raw) {
  return (raw ?? '')
    .replace(/\$[\d,. ]+/g, '')                      // $1999.99 or $ 200
    .replace(/[\d,.]+\s*\$/g, '')                     // 1999.99$
    .replace(/[\d,.]+\s*(usd|vnd|eur|gbp|đ|usd)/gi, '') // 200 USD
    .replace(/\b\d[\d,.]*\b/g, '')                   // standalone numbers
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function normalizeKeyword(kw) {
  // Step 1 – strip surviving numbers / currency symbols from Gemini's output
  const stripped = (kw ?? '')
    .toLowerCase()
    .replace(/[\d$€£₫,.]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Step 2 – exact match in normalization table
  if (KEYWORD_NORMALIZE[stripped]) return KEYWORD_NORMALIZE[stripped];

  // Step 3 – try each word left-to-right; return first match found
  const words = stripped.split(/\s+/);
  for (const w of words) {
    if (KEYWORD_NORMALIZE[w]) return KEYWORD_NORMALIZE[w];
  }

  // Step 4 – return the stripped string (no numbers at least)
  return stripped;
}

const PROMPT_TEMPLATE = (userRequest) =>
  `You are a product-search assistant for an online store that uses the dummyjson API.

Mapping (user concept → search term to use):
${KEYWORD_MAP}

User request: "${userRequest}"

Rules:
1. IGNORE all prices, numbers, currencies, and budget constraints entirely.
2. Focus ONLY on the product type/category mentioned.
3. Your "keyword" MUST be EXACTLY one of the quoted strings from the RIGHT side of the arrows above (e.g. "phone", "laptop", "dress", "watch", "kitchen").
4. Do NOT include numbers, plural forms, possessives, or any word not shown in quotes on the right side.
5. If the request matches nothing, default to "phone".

Respond ONLY with this exact JSON (no markdown, no code fences):
{"keyword":"exact quoted term","explanation":"one short sentence describing what you found"}`;
export default function useGeminiAI() {
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState(null);

  const analyzeRequest = useCallback(async (userRequest) => {
    if (!userRequest?.trim()) return null;

    // Extract price BEFORE stripping numbers so we can filter results later
    const priceHint     = extractPriceHint(userRequest);
    // Strip prices/numbers so Gemini sees only the product type
    const cleanedRequest = sanitizeInput(userRequest);

    // ── Fallback when API key is not configured ──────────────────────────────
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      const keyword = normalizeKeyword(extractFallbackKeyword(cleanedRequest));
      return { keyword, explanation: `Searching for: "${keyword}"`, priceHint };
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(GEMINI_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: PROMPT_TEMPLATE(cleanedRequest) }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 120 },
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Gemini ${res.status}: ${errText.slice(0, 120)}`);
      }

      const data    = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      // Strip markdown code fences that some model versions add
      const cleaned   = rawText.replace(/```json|```/gi, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*?\}/);
      if (!jsonMatch) throw new Error('No JSON block found in AI response.');

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.keyword) throw new Error('AI response missing keyword field.');

      return {
        keyword:     normalizeKeyword(parsed.keyword),
        explanation: (parsed.explanation ?? '').trim(),
        priceHint,
      };
    } catch (err) {
      setError(err.message);
      const keyword = normalizeKeyword(extractFallbackKeyword(cleanedRequest));
      return { keyword, explanation: `Searching for: "${keyword}"`, priceHint };
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyzeRequest, loading, error };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Extract a meaningful product noun from free-text when AI is unavailable.
const STOPWORDS = new Set([
  'a','an','the','i','me','my','want','need','find','show','give','get','buy',
  'looking','for','some','any','best','good','cheap','under','over','about',
  'with','without','can','you','please','would','like','around','less','more',
  'product','item','things','stuff','price','budget','cost',
]);

function extractFallbackKeyword(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  // Exclude pure-numeric tokens (prices like "1999") and stopwords
  const meaningful = words.filter(w => w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
  return meaningful.slice(0, 2).join(' ') || text.trim().split(/\s+/).slice(0, 2).join(' ');
}
