/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#146C94',
          hover: '#0f5271',
          light: '#e8f3f8',
          50: '#f0f8fa',
          100: '#d9edf3',
          200: '#b4dce8',
          300: '#83c3d7',
          400: '#4da3c1',
          500: '#146C94',
          600: '#105676',
          700: '#0e4661',
          800: '#103b4f',
          900: '#123242',
        },
        secondary: {
          DEFAULT: '#19A7A1',
          hover: '#148681',
          light: '#e8f7f6',
          50: '#f0fbfb',
          100: '#dcf4f3',
          200: '#bee9e7',
          300: '#90d7d4',
          400: '#5abebd',
          500: '#19A7A1',
          600: '#148681',
          700: '#146c69',
          800: '#155655',
          900: '#164847',
        },
        accent: {
          DEFAULT: '#72D6CB',
          hover: '#54c7ba',
          light: '#effbf9',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F6FAFC',
          subtle: '#EEF4F8',
          border: '#E2E8F0',
        },
        text: {
          main: '#172B3A',
          secondary: '#718096',
          muted: '#94A3B8',
          light: '#CBD5E1',
        },
        status: {
          success: '#22A06B',
          warning: '#F4B740',
          error: '#E05252',
          info: '#146C94'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 108, 148, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 12px 32px -4px rgba(20, 108, 148, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 20px 25px -5px rgba(20, 108, 148, 0.05), 0 10px 10px -5px rgba(20, 108, 148, 0.02)',
        'glow': '0 0 25px rgba(25, 167, 161, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
