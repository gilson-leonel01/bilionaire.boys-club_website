/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        body: ['DM Sans', 'sans-serif'], 
        bootstrapIcons: ['bootstrap-icons', 'sans-serif']
      },
      colors: {
        primary: '#81B29A',
        secondary: '#3D405B',
        sectionBg: '#F4F1DE',
        customBtnBg: '#F2CC8F',
        customBtnBgHover: '#E07A5F'
      },
      fontSize: {
        h1: '42px',
        h2: '36px',
        h3: '28px',
        h4: '24px',
        h5: '22px',
        h6: '20px',
        p: '18px',
        menu: '16px',
        btn: '14px',
      },
      borderRadius: {
        large: '100px',
        medium: '20px',
        small: '10px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '700',
      },
    },
  },
  plugins: [],
};
