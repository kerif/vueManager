<template>
  <div class="channel-addEdit-container">
    <el-form
      label-position="top"
      class="warehouse-form"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
    >
      <!-- 渠道名称 -->
      <el-form-item :label="$t('渠道名称')" prop="channel_name">
        <el-row>
          <el-col :span="10">
            <el-input :placeholder="$t('请输入内容')" v-model="ruleForm.channel_name"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 渠道单价 -->
      <el-form-item :label="$t('渠道单价') + localization.currency_unit" prop="channel_price">
        <el-row>
          <el-col :span="10">
            <el-input :placeholder="$t('请输入内容')" v-model="ruleForm.channel_price"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 结算方式 -->
      <el-form-item prop="settlement_method" :label="$t('结算方式')">
        <el-col :span="10">
          <el-select
            clearable
            v-model="ruleForm.settlement_method"
            class="country-select"
            :placeholder="$t('请选择结算方式')"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('渠道分类')">
        <el-row :gutter="20">
          <el-col :span="3">
            <el-select v-model="ruleForm.category_id">
              <el-option
                v-for="item in tableData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" size="small" @click="onManage">{{
              $t('分类管理')
            }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')" prop="remark">
        <el-row>
          <el-col :span="10">
            <el-input
              :placeholder="$t('请输入内容')"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
              v-model="ruleForm.remark"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="submit('ruleForm')"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="showCategory" :title="$t('分类管理')" width="80%" @close="clear">
      <div style="display: flex; justify-content: flex-end">
        <el-button @click="addCategory" style="margin-bottom: 5px" type="primary">{{
          $t('新增')
        }}</el-button>
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" :label="$t('分类')">
          <template slot-scope="scope">
            <el-input v-if="scope.row.editState" v-model="scope.row.name"></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-main" v-if="!scope.row.editState" @click="onEdit(scope.row)">{{
              $t('编辑')
            }}</el-button>
            <el-button class="btn-main" v-if="scope.row.editState" @click="onAddEdit(scope.row)">{{
              $t('保存')
            }}</el-button>
            <el-button class="btn-light-red" @click="onDelete(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding: 10px 0">
        <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        remark: '',
        settlement_method: '',
        channel_price: '',
        channel_name: '',
        category_id: ''
      },
      options: [],
      localization: {},
      showCategory: false,
      tableData: [],
      rules: {
        channel_name: [{ required: true, message: this.$t('请输入渠道名称'), trigger: 'blur' }],
        channel_price: [{ required: true, message: this.$t('请输入渠道单价'), trigger: 'blur' }],
        settlement_method: [
          { required: true, message: this.$t('请选择结算方式'), trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getCountry()
    this.getCategory()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getAloneChannel(this.$route.params.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        }
      })
    },
    // 获取支持国家数据
    getCountry() {
      this.$request.getSettlement().then(res => {
        this.options = res.data
        this.localization = res.localization
      })
    },
    onManage() {
      this.showCategory = true
      this.getCategory()
    },
    getCategory() {
      this.$request.categorySearch().then(res => {
        this.tableData = res.data.map(item => {
          return {
            ...item,
            editState: false
          }
        })
      })
    },
    addCategory() {
      this.tableData.push({
        name: '',
        editState: true
      })
    },
    onEdit(row) {
      row.editState = true
    },
    onAddEdit(row) {
      if (row.id) {
        row.editState = true
        this.$request.editChannelCategory(row.id, { name: row.name }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCategory()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        this.$request.addChannelCategory({ name: row.name }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCategory()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    onDelete(id) {
      this.$request.delChannelCategory(id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getCategory()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    clear() {},
    submit(formName) {
      // 编辑状态
      if (this.$route.params.id) {
        this.$request.updateChannel(this.$route.params.id, this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        // 新建
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$request.addChannel(this.ruleForm).then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.$router.go(-1)
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.channel-addEdit-container {
  background-color: #fff !important;
  .tips-box {
    padding: 20px;
    line-height: 30px;
    background-color: #f0f0f0;
    margin: 20px 20px 50px 0;
    display: inline-block;
    border-radius: 5px;
  }
  .tips-title {
    font-weight: bold;
  }
  .tips-content {
    font-size: 14px;
  }
  .warehouse-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .country-select {
    width: 100%;
  }
  .el-tag.el-tag--info {
    border-color: #3540a5;
    color: #3540a5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540a5;
    background-color: #fff;
  }
  .country-btn {
    margin-left: 15px;
    .el-button--primary {
      background-color: #eaecf5;
      border-color: #eaecf5;
      color: #3540a5;
    }
  }
  .icon-info {
    color: #74b34f;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .address-sty {
    color: #606266;
  }
}
</style>
