module.exports = {
  assetsDir: 'static',
  runtimeCompiler: true,
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  devServer: {
    overlay: {
      warnings: true,
      error: true
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  }
}
