/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./templates/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4a5568', // Muted Grey
        'brand-secondary': '#e2e8f0', // Light Grey
        'brand-light': '#f7fafc', // Off-white
        'brand-dark': '#2d3748', // Near Black
        'brand-emphasis': '#c05621', // Rich Terracotta
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Charter', 'serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#333333',
            '--tw-prose-headings': '#212529',
            '--tw-prose-lead': '#5F6973',
            '--tw-prose-links': theme('colors.brand-emphasis'),
            '--tw-prose-bold': theme('colors.brand-dark'),
            '--tw-prose-counters': theme('colors.brand-primary'),
            '--tw-prose-bullets': theme('colors.brand-primary'),
            '--tw-prose-hr': theme('colors.brand-secondary'),
            '--tw-prose-quotes': theme('colors.brand-dark'),
            '--tw-prose-quote-borders': theme('colors.brand-emphasis'),
            '--tw-prose-captions': theme('colors.brand-primary'),
            '--tw-prose-code': theme('colors.brand-dark'),
            '--tw-prose-pre-code': theme('colors.brand-light'),
            '--tw-prose-pre-bg': theme('colors.brand-dark'),
            '--tw-prose-th-borders': theme('colors.brand-secondary'),
            '--tw-prose-td-borders': theme('colors.brand-secondary'),
            '--tw-prose-invert-body': theme('colors.brand-light'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.brand-light'),
            '--tw-prose-invert-links': theme('colors.white'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.brand-light'),
            '--tw-prose-invert-bullets': theme('colors.brand-light'),
            '--tw-prose-invert-hr': theme('colors.brand-secondary'),
            '--tw-prose-invert-quotes': theme('colors.brand-light'),
            '--tw-prose-invert-quote-borders': theme('colors.brand-emphasis'),
            '--tw-prose-invert-captions': theme('colors.brand-light'),
            '--tw-prose-invert-code': theme('colors.white'),
            '--tw-prose-invert-pre-code': theme('colors.brand-dark'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.brand-secondary'),
            '--tw-prose-invert-td-borders': theme('colors.brand-secondary'),
            maxWidth: '42rem',
            fontSize: '1.125rem',
            lineHeight: '1.7',
            color: '#374151',
            p: {
              fontSize: '1.125rem',
              lineHeight: '1.7',
              marginTop: '0',
              marginBottom: '1.5rem',
              fontWeight: '400',
              wordSpacing: '0.05em',
            },
            'p + p': {
              marginTop: '1.5rem',
            },
            h1: {
              fontSize: '2.5rem',
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              fontWeight: '800',
              color: '#1a1a1a',
            },
            h2: {
              fontSize: '2rem',
              lineHeight: '1.15',
              marginTop: '3rem',
              marginBottom: '1rem',
              fontWeight: '700',
              color: '#1a1a1a',
            },
            h3: {
              fontSize: '1.5rem',
              lineHeight: '1.3',
              marginTop: '2.5rem',
              marginBottom: '0.75rem',
              fontWeight: '600',
              color: '#1a1a1a',
            },
            h4: {
              fontSize: '1.25rem',
              lineHeight: '1.4',
              marginTop: '2rem',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1a1a1a',
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: '#C05621',
              paddingLeft: '1.5rem',
              margin: '2rem 0',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              color: '#4B5563',
            },
            'ul, ol': {
              paddingLeft: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            li: {
              lineHeight: '1.7',
              marginBottom: '0.5rem',
              color: '#374151',
            },
            'li + li': {
              marginTop: '0.5rem',
            },
            a: {
              color: '#C05621',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            'a:hover': {
              textDecoration: 'none',
            },
            strong: {
              fontWeight: '600',
              color: '#1a1a1a',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
