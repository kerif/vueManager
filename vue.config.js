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
  }
}
