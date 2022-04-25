<template>
  <div class="rules">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="resource_type_name" :label="$t('分类')"> </el-table-column>
      <el-table-column prop="type_name" :label="$t('收支类型')"> </el-table-column>
      <el-table-column prop="name" :label="$t('规则名称')"> </el-table-column>
      <el-table-column prop="remark" :label="$t('规则说明')"> </el-table-column>
      <el-table-column prop="enabled" :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-value="1"
            inactive-value="0"
            active-text="开"
            inactive-text="关"
            @change="changeRuleEnabled(scope.row.id, scope.row.enabled)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button size="mini" @click="config(scope.row.code)" class="btn-deep-purple">{{
            $t('配置')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  name: 'rules',
  data() {
    return {
      dialogVisible: false,
      money: '',
      checked: false,
      checkList: [],
      time: '',
      date: '',
      tableData: []
    }
  },
  created() {
    this.getInOutRule()
  },
  methods: {
    getInOutRule() {
      this.$request.getInOutRule().then(res => {
        if (res.ret) {
          this.tableData = res.data.map(item => {
            let enabled = item.enabled.toString()
            return {
              ...item,
              enabled
            }
          })
        }
      })
    },
    // 启用禁用
    changeRuleEnabled(id, enabled) {
      this.$request.changeRuleEnabled(id, { enabled }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getInOutRule()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 配置
    config(code) {
      if (code === 'GROWTH_INCREASE') {
        //消费积累成长值
        dialog({ type: 'consumeGrowthValue' }, () => {
          this.getInOutRule()
        })
      } else if (code === 'GROWTH_BUY') {
        //成长值购买
        dialog({ type: 'growthValueBuy' }, () => {
          this.getInOutRule()
        })
      } else if (code === 'POINT_INCREASE') {
        //消费积累积分
        dialog({ type: 'buyGrowthValue' }, () => {
          this.getInOutRule()
        })
      } else if (code === 'COMMENT_POINT_INCREASE') {
        //评价积累积分
        dialog({ type: 'evaluationRewardPoints' }, () => {
          this.getInOutRule()
        })
      } else if (code === 'POINT_DECREASE') {
        //积分抵扣消费
        dialog({ type: 'creditConsumption' }, () => {
          this.getInOutRule()
        })
      } else if (code === 'QA_POINT_INCREASE') {
        // 问答积累积分
        dialog(
          {
            type: 'qaCumulative'
          },
          () => {
            this.getInOutRule()
          }
        )
      }
    }
  }
}
</script>
<style scoped lang="scss"></style>
