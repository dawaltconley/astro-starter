const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

const dynamicViewports = {
  'screen-d': ['100vh', '100dvh'],
  'screen-s': ['100vh', '100svh'],
  'screen-l': ['100vh', '100lvh'],
}

/** @type import('tailwindcss').Config */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
    },
    extend: {
      colors: {
        primary: colors.blue['700'], // or alias to a whole range
      },
      fontFamily: {
        sans: ['InterVariable', 'Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Georgia', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        smaller: 'smaller',
        larger: 'larger',
      },
      inset: {
        'almost-full': 'calc(100% - 1px)',
      },
      height: dynamicViewports,
      minHeight: dynamicViewports,
      maxHeight: dynamicViewports,
      aspectRatio: {
        og: '1200 / 630',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    plugin(({ addVariant, matchUtilities, matchComponents, theme }) => {
      // custom variants
      addVariant('stuck', ['[data-sticky="stuck"]&', '[data-sticky="stuck"] &'])

      // custom utilities
      matchUtilities(
        {
          'min-aspect': (value) => ({
            '&::before': {
              content: "''",
              paddingTop: value,
              float: 'left',
            },
            '&::after': {
              content: "''",
              display: 'table',
              clear: 'both',
            },
          }),
        },
        {
          values: Object.entries(theme('aspectRatio')).reduce(
            (values, [k, aspect]) => {
              let n = Number(aspect)
              if (Number.isNaN(n)) {
                const [x, y] = aspect.split('/').map(Number)
                n = y / x
              }
              if (Number.isNaN(n)) return values
              return {
                ...values,
                [k]: (100 * n).toFixed(2) + '%',
              }
            },
            {},
          ),
        },
      )

      matchUtilities(
        {
          'pseudo-padding': (value) => ({
            content: "''",
            position: 'absolute',
            inset: `-${value}`,
          }),
        },
        {
          values: theme('spacing'),
        },
      )

      // custom components
      matchComponents(
        {
          'h-line': (value) => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            '&::before, &::after': {
              content: "''",
              flex: '1 1 auto',
              borderTopWidth: value,
              borderTopColor: 'inherit',
              borderTopStyle: 'inherit',
            },
            '&::before': {
              marginRight: '0.5em',
            },
            '&::after': {
              marginLeft: '0.5em',
            },
          }),
        },
        {
          values: theme('borderWidth'),
        },
      )
    }),
  ],
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(.light *) }',
      '&:is(.dark *)',
    ],
  ],
}
