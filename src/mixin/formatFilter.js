export default {
  filters: {
    // 格式化价格显示（原始价格以分为单位）
    formatPrice (value) {
      if (!value && value !== 0) return value
      return Number(value / 100).toFixed(2)
    },
    // 格式化重量显示（将以克为单位的重量转换成为千克为单位）
    formatWeight (value) {
      if (!value) return value
      let len = value < 10 ? 3 : 2
      return Number(value / 1000).toFixed(len)
    },
    // 格式化长、宽、高、显示转成 CM
    formatCM (value) {
      if (!value) return value
      return value / 100
    },
    // 获取日期 传递过来的形如 2019-11-05 00：00：00 形如，返回 2019-11-05
    getDateFromDateTime (dateTime) {
      if (!dateTime) return ''
      return dateTime.split(' ')[0]
    },
    // 获取时间 传递过来的形如 2019-11-05 14:21:30 返回 14：21：30
    getTimeFromDateTime (dateTime) {
      if (!dateTime) return ''
      return dateTime.split(' ')[1]
    }
  }
}
