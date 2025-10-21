/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#4f46e5',
          secondary: '#64748b',
          accent: '#10b981',
          neutral: '#1f2937',
          'base-100': '#f9fafb',
          'base-200': '#f3f4f6',
          'base-300': '#e5e7eb',
          'base-content': '#0f172a',
          info: '#3b82f6',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          'rounded-box': '0.75rem',
          'rounded-btn': '0.5rem',
          'rounded-badge': '0.5rem',
          'btn-text-case': 'none',
          'animation-btn': '0',
          'animation-input': '0',
        },
      },
      {
        dark: {
          primary: '#8b5cf6',
          secondary: '#94a3b8',
          accent: '#22c55e',
          neutral: '#0f172a',
          'base-100': '#0f172a',
          'base-200': '#111827',
          'base-300': '#1f2937',
          'base-content': '#e5e7eb',
          info: '#60a5fa',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          'rounded-box': '0.75rem',
          'rounded-btn': '0.5rem',
          'rounded-badge': '0.5rem',
          'btn-text-case': 'none',
          'animation-btn': '0',
          'animation-input': '0',
        },
      },
    ],
  },
};