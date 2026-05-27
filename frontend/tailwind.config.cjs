/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f2ea',
        vellum: '#fffaf1',
        ink: '#2b2420',
        walnut: '#6b3f28',
        moss: '#435f46',
        oxblood: '#7a2e2e',
        brass: '#c98a2c',
        cloud: '#f3f7f1'
      },
      boxShadow: {
        soft: '0 18px 40px rgba(43, 36, 32, 0.10)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'ui-serif', 'serif']
      }
    }
  },
  plugins: []
};
