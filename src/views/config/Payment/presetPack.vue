<template>
  <div class="preset-container content-top">
    <div class="add-preset">
      <el-button class="btn-main" @click="addPresetBox">{{ $t('添加') }}</el-button>
    </div>
    <el-table :data="tableData" border class="content-top">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="name" :label="$t('耗材名称')">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editStatus"
            v-model="scope.row.name"
            :placeholder="$t('请输入箱子名称')"
          ></el-input>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="length" :label="$t('长')">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editStatus"
            v-model="scope.row.length"
            :placeholder="$t('请输入长')"
          ></el-input>
          <span v-else>{{ scope.row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="width" :label="$t('宽')">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editStatus"
            v-model="scope.row.width"
            :placeholder="$t('请输入宽')"
          ></el-input>
          <span v-else>{{ scope.row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="height" :label="$t('高')">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editStatus"
            v-model="scope.row.height"
            :placeholder="$t('请输入高')"
          ></el-input>
          <span v-else>{{ scope.row.height }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="weight" :label="$t('重量')">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editStatus"
            v-model="scope.row.weight"
            :placeholder="$t('请输入重量')"
          ></el-input>
          <span v-else>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cost_amount" :label="$t('成本')">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.editStatus"
            v-model="scope.row.cost_amount"
            :placeholder="$t('请输入成本')"
          ></el-input>
          <span v-else>{{ scope.row.cost_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            class="btn-main"
            v-if="!scope.row.editStatus"
            @click="editPresetBox(scope.row)"
            >{{ $t('修改') }}</el-button
          >
          <el-button
            class="btn-light-red"
            v-if="scope.row.id && !scope.row.editStatus"
            @click="delPresetBox([scope.row.id])"
            >{{ $t('删除') }}</el-button
          >
          <el-button
            class="btn-main"
            v-if="scope.row.editStatus"
            @click="savePresetBox(scope.row)"
            >{{ $t('保存') }}</el-button
          >
          <el-button
            class="btn-main"
            v-if="scope.row.editStatus"
            @click="cancelPresetBox(scope.$index, tableData)"
            >{{ $t('取消') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 20px 0">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    getList() {
      this.$request
        .presetPackList({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data.map(item => {
              return {
                ...item,
                editStatus: false
              }
            })
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    addPresetBox() {
      this.tableData.push({
        name: '',
        length: '',
        width: '',
        height: '',
        cost_amount: '',
        editStatus: true
      })
    },
    editPresetBox(row) {
      row.editStatus = true
      this.$set(row, 'editStatus', true)
    },
    delPresetBox(id) {
      this.$request
        .delPresetPack({
          ids: id
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    cancelPresetBox(index, rows) {
      rows.splice(index, 1)
    },
    savePresetBox(row) {
      let params = {
        name: row.name,
        length: row.length,
        width: row.width,
        height: row.height,
        weight: row.weight,
        cost_amount: row.cost_amount
      }
      if (row.id) {
        row.editStatus = true
        this.$request.editPresetPack(row.id, params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        this.$request.addPresetPack(params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.preset-container {
  .content-top {
    margin-top: 20px;
  }
  .add-preset {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
