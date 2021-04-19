<template>
  <el-col :lg="6" :md="12">
      <el-date-picker
      type="daterange"
      v-model="date_value"
      @change="dateChange"
      :range-separator="$t('至')"
      :start-placeholder="$t('开始日期')"
      :end-placeholder="$t('结束日期')">
    </el-date-picker>
  </el-col>
</template>
<script>
import $t from '../../utils/language'
export default {
  props: {
    placeholder: {
      type: String
    }
  },
  created () {
    if (this.$store.state.search_flag) {
      this.date_value = []
    }
  },
  data () {
    return {
      date_arr: [],
      $t
    }
  },
  computed: {
    pickerOptions: function () {
      return {
        shortcuts: [{
          text: this.$t('latestWeek'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('latestMonth'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('latestThreeMonth'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    },
    date_value: {
      get: function () {
        return this.date_arr
      },
      set: function (newValue) {
        if (newValue[0] && newValue[1]) {
          let dateBegin = this.getNowFormatDate(newValue[0])
          let dateEnd = this.getNowFormatDate(newValue[1])
          this.date_arr = newValue
          this.$emit('update:begin', dateBegin)
          this.$emit('update:end', dateEnd)
        } else {
          this.date_arr = newValue
          this.$emit('update:begin', '')
          this.$emit('update:end', '')
        }
      }
    }
  },
  methods: {
    dateChange (date) {
      this.$parent.$parent.$emit('search')
    },
    getNowFormatDate (date) {
      let day = new Date(date)
      let Year = 0
      let Month = 0
      let Day = 0
      let CurrentDate = ''
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = day.getDate()
      CurrentDate += Year + '-'
      if (Month >= 10) {
        CurrentDate += Month + '-'
      } else {
        CurrentDate += '0' + Month + '-'
      }
      if (Day >= 10) {
        CurrentDate += Day
      } else {
        CurrentDate += '0' + Day
      }
      return CurrentDate
    }
  }
}
</script>
