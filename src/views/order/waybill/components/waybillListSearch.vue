<template>
  <div class="waybill-list-search">
    <el-form size="mini">
      <div>
        <div>
          <el-form-item label="时间">
            <el-select
              v-model="agent_name"
              @change="onAgentChange"
              clearable
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in agentData"
                :key="item.id"
                :value="item.user_id"
                :label="item.agent_name"
              >
              </el-option>
            </el-select>
            <el-date-picker
              v-model="timeList"
              type="daterange"
              @change="onTime"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :range-separator="$t('至')"
              :start-placeholder="$t('提交开始日期')"
              :end-placeholder="$t('提交结束日期')"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'waybillListSearch',
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.waybill-list-search {
}
</style>
