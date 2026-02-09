/**
 * MetalCore Design System Tokens
 * Centralized design constants for consistent styling
 */

// Border Radius Scale
export const RADIUS = {
  sm: 'rounded-xl',      // 12px - Small elements (buttons, tags)
  md: 'rounded-2xl',     // 16px - Medium cards, inputs
  lg: 'rounded-[1.5rem]', // 24px - Large cards
  xl: 'rounded-[2rem]',   // 32px - Modals, major containers
  xxl: 'rounded-[2.5rem]', // 40px - Hero cards, featured elements
  full: 'rounded-full'    // Circles (buttons, avatars)
};

// Shadow Patterns
export const SHADOW = {
  card: 'shadow-xl',                           // Default cards
  elevated: 'shadow-2xl',                      // Modals, overlays
  glow: 'shadow-lg shadow-accent/20',          // Interactive accent elements
  glowStrong: 'shadow-xl shadow-accent/30',    // Strong emphasis
  none: 'shadow-none'
};

// Glass Panel Variants
export const GLASS = {
  // Base glass panel (most common)
  base: 'glass-panel bg-black/40 border border-white/10 backdrop-blur-xl',

  // Glass with subtle gradient overlay (premium feel)
  gradient: 'glass-panel bg-gradient-to-br from-white/5 to-black/40 border border-white/10 backdrop-blur-xl',

  // Glass with accent gradient (featured cards)
  accentGradient: 'glass-panel bg-gradient-to-br from-accent/5 to-black/40 border border-white/10 backdrop-blur-xl',

  // Glass with indigo gradient (AI features)
  indigoGradient: 'glass-panel bg-gradient-to-br from-indigo-500/5 to-black/40 border border-white/10 backdrop-blur-xl',

  // Stronger glass (modals, overlays)
  strong: 'glass-panel bg-black/60 border border-white/10 backdrop-blur-3xl',

  // Subtle glass (nested elements)
  subtle: 'bg-white/5 border border-white/5 backdrop-blur-sm'
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

// Typography Patterns
export const TYPE = {
  // Headers
  pageTitle: 'text-4xl md:text-6xl font-display font-black text-white italic uppercase tracking-tighter leading-none',
  sectionTitle: 'text-2xl md:text-3xl font-display font-black text-white italic uppercase tracking-tighter',
  cardTitle: 'text-xl md:text-2xl font-black text-white italic uppercase tracking-tight',
  heading: 'text-lg md:text-xl font-black text-white uppercase tracking-widest',
  subheading: 'text-sm md:text-base font-black text-white uppercase tracking-widest',

  // Labels
  label: 'text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest',
  microLabel: 'text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]',

  // Body
  body: 'text-sm md:text-base text-slate-300',
  bodySmall: 'text-xs md:text-sm text-slate-400',
  caption: 'text-[10px] md:text-xs text-slate-500'
};

// Button Patterns
export const BUTTON = {
  primary: `px-6 py-3 bg-accent text-black font-black uppercase tracking-wider ${RADIUS.sm} hover:bg-accent/90 transition-all ${SHADOW.glow} active:scale-[0.98]`,
  secondary: `px-6 py-3 bg-white/5 text-white font-black uppercase tracking-wider ${RADIUS.sm} border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]`,
  ghost: `px-4 py-2 text-slate-400 font-bold hover:text-white hover:bg-white/5 ${RADIUS.sm} transition-all`,
  icon: 'p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-accent transition-all'
};

// Animation Patterns
export const ANIMATION = {
  transition: 'transition-all duration-300 ease-out',
  transitionFast: 'transition-all duration-150 ease-out',
  springConfig: { type: 'spring', damping: 30, stiffness: 300, mass: 0.5 },
  discordEasing: [0.22, 1, 0.36, 1]
};

// Helper function to combine classes
export const cx = (...classes) => classes.filter(Boolean).join(' ');
