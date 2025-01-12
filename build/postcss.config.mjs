export default {
  map: {
    inline: false,
    annotation: true,
    sourcesContent: true
  },
  plugins: {
    autoprefixer: {
      cascade: true,
      add: true,
      remove: true,
      supports: true,
      flexbox: true,
      grid: true
    },
    ...(process.env.NODE_ENV === 'RTL' ? { rtlcss: {} } : {})
  }
}
