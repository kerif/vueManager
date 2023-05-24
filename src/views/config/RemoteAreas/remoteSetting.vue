<template>
  <div class="remote-areas">
    <div class="flex-box">
      <div class="blue-text">
        {{
          $t(
            '注意! 由于 FEDEX, DHL, UPS, TNT偏远地区更新频繁, 系统内置偏远数据仅作参考查询,最终以FEDEX, DHL, UPS, TNT官方为准。如有疑问建议直接致电对应的官方客服电话查询核实,请知悉'
          )
        }}
      </div>
      <el-button @click="onAdd" type="primary">{{ $t('新增') }}</el-button>
    </div>
    <div style="margin: 20px 0">
      <el-table :data="tableData" border stripe @selection-change="onSelectChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" :label="$t('偏远类型')"></el-table-column>
        <el-table-column prop="remark" :label="$t('备注')"></el-table-column>
        <el-table-column prop="source_name" :label="$t('来源')"></el-table-column>
        <el-table-column prop="operator_name" :label="$t('操作人')"></el-table-column>
        <el-table-column prop="updated_at" :label="$t('最后更新时间')"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button @click="onEdit(scope.row.id)" class="btn-main">{{ $t('修改') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button @click="onBatch">{{ $t('批量删除') }}</el-button>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      tableData: [],
      selectIDs: []
    }
  },
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    onAdd() {
      dialog(
        {
          type: 'remoteInfo'
        },
        () => {
          this.getList()
        }
      )
    },
    onEdit(id) {
      dialog(
        {
          type: 'remoteInfo',
          id
        },
        () => {
          this.getList()
        }
      )
    },
    getList() {
      this.$request.remoteAreaList().then(res => {
        if (res.ret) {
          this.tableData = res.data
        }
      })
    },
    onSelectChange(selection) {
      this.selectIDs = selection.map(item => item.id)
    },
    onBatch() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request.batchDelRemote({ ids: this.selectIDs }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.remote-areas {
  height: 90%;
  background-color: #fff !important;
  padding: 15px 20px;
  .blue-text {
    font-size: 14px;
    color: #3540a5;
  }
  .flex-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
