<template>
  <el-dialog
    :title="$t('评论奖励积分')"
    :visible.sync="show"
    width="50%"
    class="evaluation dialog-container"
  >
    <div class="item-label" style="margin-top: 0">
      <p>{{ $t('订单签收之日起计算，评价奖励有效期（天）') + ':' }}</p>
      <el-input v-model="tableData.valid_days" style="width: 100px"></el-input>
      <p class="tips">{{ '*' + $t('为空则表示不限制奖励有效期') }}</p>
    </div>
    <div class="item-label">
      <p>{{ $t('积分到账之日起计算，有效期为') + ':' }}</p>
      <el-select v-model="tableData.valid_time">
        <el-option
          v-for="item in timeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="item-label">
        <span style="margin-right: 10px">{{ $t('符合多项时获取方式') + ':' }}</span>
        <el-radio-group v-model="tableData.type">
          <el-radio :label="1">{{ $t('按最高获取') }}</el-radio>
          <el-radio :label="2">{{ $t('叠加获取') }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="item-label">
      <div style="margin-bottom: 10px">
        <el-button size="small" @click="explain">{{ $t('说明') }}</el-button>
        <el-button size="small" type="primary" @click="addData">{{ $t('新增') }}</el-button>
        <span class="tips" style="margin-left: 20px">{{ '*' + $t('最多添加10条') }}</span>
      </div>
      <el-table :data="pointTableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="60"> </el-table-column>
        <el-table-column prop="word_count" :label="$t('字数') + '>='"> </el-table-column>
        <el-table-column prop="pic_count" :label="$t('图片') + '>='"> </el-table-column>
        <el-table-column prop="point" :label="$t('积分')"> </el-table-column>
        <el-table-column :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button size="mini" class="btn-green" @click="editData(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <el-button size="mini" class="btn-light-red" @click="deleteTable(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      editDialog: false,
      tableData: {
        valid_days: '',
        valid_time: '',
        type: 1,
        illustrate: []
      },
      timeList: [],
      pointTableData: [],
      form: {
        word_count: '',
        pic_count: '',
        point: ''
      }
    }
  },
  methods: {
    // 获取有效期列表
    getPointCommentConfig() {
      this.$request.getPointCommentConfig().then(res => {
        if (res.ret) {
          this.timeList = res.data.valid_time_list
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取详情
    getPointCommentDetails() {
      this.$request.getPointCommentDetails().then(res => {
        if (res.ret) {
          this.tableData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取表格数据
    getPointCommentTable() {
      this.$request.getPointCommentTable().then(res => {
        if (res.ret) {
          this.pointTableData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改表格数据
    editData(id) {
      dialog({ type: 'evaluationTable', id }, () => {
        this.getPointCommentTable()
      })
    },
    // 添加表格数据
    addData() {
      dialog({ type: 'addevaluationTable' }, () => {
        this.getPointCommentTable()
      })
    },
    // 删除表格数据
    deleteTable(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTable(id).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getPointCommentTable()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    //说明
    explain() {
      dialog({ type: 'explain', illustrateData: this.tableData.illustrate }, data => {
        this.tableData.illustrate = data
        console.log(this.tableData, 'this.tableData')
      })
    },
    submit() {
      this.$request.updatePointComment({ ...this.tableData }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    init() {
      this.getPointCommentConfig()
      this.getPointCommentDetails()
      this.getPointCommentTable()
    }
  }
}
</script>
<style scoped lang="scss">
.evaluation {
  .item-label {
    margin: 40px 0;
    .tips {
      color: #ccc;
    }
  }
}
</style>
