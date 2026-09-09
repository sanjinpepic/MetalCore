/** @type {import('tailwindcss').Config} */

// Molten Forge — warm-neutral ember scale.
// Heat is the only accent language in the app.
const ember = {
    DEFAULT: '#FF5A1F',
    50: '#FFF3EB',
  100: '#FFE3CF',
  200: '#FFC39E',
  300: '#FF9D62',
  400: '#FF7C39',
  500: '#FF5A1F',
  600: '#EE4A10',
  700: '#C53A0C',
  800: '#9C3212',
  900: '#7E2D13',
};

module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
                mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
                display: ['var(--font-display)', 'Archivo Black', 'sans-serif'],
            },
            colors: {
                obsidian: '#0B0A08',
                forge: {
                    950: '#0B0A08',
                    900: '#12100D',
                    850: '#171411',
                    800: '#1D1915',
                    700: '#2A251F',
                },
                bone: {
                    DEFAULT: '#EDE9E2',
                    dim: '#A39E93',
                    faint: '#6E685D',
                },
                accent: ember,
                glass: 'rgba(237, 233, 226, 0.04)',
                'glass-hover': 'rgba(237, 233, 226, 0.08)',
                // Forge voice: cold slate grays are wrong for hot metal.
                // Remap every slate-* utility to the warm stone ramp, app-wide.
                slate: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    950: '#0c0a09',
                },
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'snap': 'cubic-bezier(0.22, 1, 0.36, 1)',
                'inout-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
                'dramatic': 'cubic-bezier(0.77, 0, 0.175, 1)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'ember-pulse': 'ember-pulse 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'ember-pulse': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.45' },
                },
            },
            boxShadow: {
                'plate': '0 1px 0 0 rgba(237, 233, 226, 0.06) inset, 0 24px 48px -24px rgba(0, 0, 0, 0.7)',
                'plate-lg': '0 1px 0 0 rgba(237, 233, 226, 0.07) inset, 0 32px 64px -28px rgba(0, 0, 0, 0.8)',
                'ember': '0 8px 32px -8px rgba(255, 90, 31, 0.35)',
                'ember-sm': '0 4px 16px -6px rgba(255, 90, 31, 0.4)',
            },
        },
    },
    plugins: [],
}
