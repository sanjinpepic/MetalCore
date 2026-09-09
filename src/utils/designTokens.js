/**
 * MetalCore Design System — "Molten Forge"
 * One accent (ember). Heat is the only color language.
 */

// Border Radius Scale — tighter, machined. Industrial parts are not bubbles.
export const RADIUS = {
  sm: 'rounded-lg',       // 8px  - Buttons, tags, inputs
  md: 'rounded-xl',       // 12px - Cards, containers
  lg: 'rounded-2xl',      // 16px - Large cards
  xl: 'rounded-3xl',      // 24px - Modals, major containers
  xxl: 'rounded-[2rem]',  // 32px - Hero surfaces
  full: 'rounded-full'    // Circles (buttons, avatars)
};

// View Themes — collapsed to the single ember accent.
// Keys are kept so every call site keeps working; views differentiate
// by composition and data, not by hue.
const EMBER = {
  id: 'accent',
  text: 'text-accent',
  bg: 'bg-accent',
  border: 'border-accent/25',
  glow: 'from-accent/[0.14]',
  sidebar: 'rgba(255, 90, 31, 0.07)'
};

export const THEMES = {
  emerald: EMBER,
  amber: EMBER,
  rose: EMBER,
  sky: EMBER,
  indigo: EMBER,
  orange: EMBER,
  cyan: EMBER,
  violet: EMBER
};

// Shadow Patterns
export const SHADOW = {
  card: 'shadow-plate',                       // Default cards
  elevated: 'shadow-plate-lg',                // Modals, overlays
  glow: 'shadow-ember-sm',                    // Interactive accent elements
  glowStrong: 'shadow-ember',                 // Strong emphasis
  none: 'shadow-none'
};

// Forged Plate Variants (class names kept for compatibility)
export const GLASS = {
  // Base plate (most common)
  base: 'glass-panel',

  // Plate with heat gradient (premium feel)
  gradient: 'glass-gradient',

  // Accent plate (featured cards)
  accentGradient: 'glass-accent',

  // Stronger plate (modals, overlays)
  strong: 'glass-strong',

  // Sidebar rail
  sidebar: 'glass-sidebar',

  // Subtle inset (nested elements)
  subtle: 'bg-white/[0.04] border border-white/[0.06]'
};

// Spacing Scale (for padding/margin)
export const SPACING = {
  // Card padding
  cardSmall: 'p-5 md:p-6',
  card: 'p-6 md:p-8',
  cardLarge: 'p-8 md:p-10',

  // Section spacing
  section: 'space-y-6',
  sectionLarge: 'space-y-8',

  // Gap patterns
  gapSmall: 'gap-2 md:gap-3',
  gap: 'gap-3 md:gap-4',
  gapLarge: 'gap-4 md:gap-6'
};

// Typography Patterns — Molten Forge voice:
// Display = Archivo Black, upright, uppercase, tight tracking. Never italic.
// Labels = medium weight, wide tracking. Never font-black on tiny sizes.
export const TYPE = {
  // Headers
  pageTitle: 'text-4xl md:text-6xl font-display text-white uppercase tracking-tight leading-[0.95]',
  sectionTitle: 'text-2xl md:text-3xl font-display text-white uppercase tracking-tight leading-none',
  cardTitle: 'text-lg md:text-xl font-display text-white uppercase tracking-tight',
  heading: 'text-base md:text-lg font-bold text-white uppercase tracking-wide',
  subheading: 'text-sm md:text-base font-bold text-white uppercase tracking-wide',

  // Labels
  label: 'text-[10px] md:text-xs font-medium text-stone-500 uppercase tracking-[0.2em]',
  microLabel: 'text-[9px] md:text-[10px] font-medium text-stone-600 uppercase tracking-[0.25em]',

  // Body
  body: 'text-sm md:text-base text-stone-300',
  bodySmall: 'text-xs md:text-sm text-stone-400',
  caption: 'text-[10px] md:text-xs text-stone-500'
};

// Button Patterns
export const BUTTON = {
  primary: `px-6 py-3 bg-accent text-[#1A0C05] font-bold uppercase tracking-wider text-sm ${RADIUS.sm} hover:bg-accent-400 transition-all duration-300 ease-snap ${SHADOW.glow} active:scale-[0.97]`,
  secondary: `px-6 py-3 bg-white/[0.06] text-white font-bold uppercase tracking-wider text-sm ${RADIUS.sm} border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300 ease-snap active:scale-[0.97]`,
  ghost: `px-4 py-2 text-stone-400 font-semibold text-sm hover:text-white hover:bg-white/[0.06] ${RADIUS.sm} transition-all duration-300 ease-snap`,
  icon: 'p-2 hover:bg-white/[0.06] rounded-lg text-stone-400 hover:text-accent transition-all duration-300 ease-snap'
};

// Animation Patterns — Physical personality.
// Springs for entries/state, snap for hover. Three curves, no more.
export const ANIMATION = {
  transition: 'transition-all duration-300 ease-out-expo',
  transitionFast: 'transition-all duration-150 ease-snap',
  springConfig: { type: 'spring', stiffness: 400, damping: 30, mass: 1 },
  springSmooth: { type: 'spring', stiffness: 200, damping: 24, mass: 1 },
  discordEasing: [0.22, 1, 0.36, 1]
};

// Helper function to combine classes
export const cx = (...classes) => classes.filter(Boolean).join(' ');
