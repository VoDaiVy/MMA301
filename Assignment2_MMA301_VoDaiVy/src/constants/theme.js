// ─── Color Palette ────────────────────────────────────────────────────────────
export const COLORS = {
  // Primary – Modern Blue / Indigo family
  primary:        '#4F63D2',   // main brand indigo-blue
  primaryDark:    '#3A4EB8',   // pressed / active state
  primaryLight:   '#EEF0FD',   // subtle tint backgrounds

  // Accent
  accent:         '#6C63FF',   // vibrant purple-blue for highlights

  // Background
  background:     '#F8F9FA',   // off-white page background
  surface:        '#FFFFFF',   // cards / modals
  border:         '#E9ECEF',   // dividers and input borders

  // Text
  textPrimary:    '#212529',   // headings & body – dark grey
  textSecondary:  '#6C757D',   // captions, meta
  textDisabled:   '#ADB5BD',   // placeholder / disabled

  // Semantic
  success:        '#28A745',
  warning:        '#FFC107',
  error:          '#DC3545',
  info:           '#17A2B8',

  // Misc
  white:          '#FFFFFF',
  black:          '#000000',
  transparent:    'transparent',
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const FONTS = {
  regular:   'System',
  medium:    'System',
  bold:      'System',
};

export const FONT_SIZES = {
  xs:   11,
  sm:   13,
  md:   15,
  base: 16,
  lg:   18,
  xl:   22,
  xxl:  28,
  huge: 34,
};

export const FONT_WEIGHTS = {
  regular:    '400',
  medium:     '500',
  semiBold:   '600',
  bold:       '700',
  extraBold:  '800',
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const SPACING = {
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  xxl:  32,
  huge: 48,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm:   6,
  md:   10,
  lg:   16,
  xl:   24,
  full: 999,
};

// ─── Shadows (iOS) ────────────────────────────────────────────────────────────
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
  },
};
