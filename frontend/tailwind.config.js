/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'clickup-purple': {
          DEFAULT: '#7B68EE',
          light: '#9F90F3',
          dark: '#5F4FD1'
        },
        'clickup-blue': {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB'
        },
        'clickup-green': {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669'
        },
        'clickup-yellow': {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706'
        },
        'clickup-red': {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626'
        },
        'clickup-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        },
        secondary: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#111827',
          light: '#6B7280',
        },
        border: '#E5E7EB',
      },
      boxShadow: {
        'clickup': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'clickup-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'clickup-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'clickup': '0.5rem',
      }
    },
  },
  plugins: [],
} 