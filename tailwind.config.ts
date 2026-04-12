// tailwind.config.ts
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        cipher: {
          bg:        '#0a0a0f',
          surface:   '#111118',
          border:    '#1e1e2e',
          muted:     '#2a2a3e',
          text:      '#e2e2f0',
          dim:       '#6b6b8a',
          green:     '#00d4aa',
          amber:     '#f59e0b',
          red:       '#ef4444',
          blue:      '#3b82f6',
          purple:    '#8b5cf6',
        }
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'scan-line': 'scan 2s linear infinite',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
      }
    }
  },
  plugins: []
}
