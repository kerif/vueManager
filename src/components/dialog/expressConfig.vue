<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('基础配置')"
    class="dialog-add-express"
    width="50%"
    @close="clear"
  >
    <div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item :label="$t('快递公司名称')" prop="name">
          <el-input v-model="ruleForm.name" :placeholder="$t('请输入快递公司名称')"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('快递公司代码')" prop="num">
          <el-input v-model="ruleForm.num" :placeholder="$t('请输入快递公司代码')"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('排序索引')" prop="index">
          <el-input v-model.number="ruleForm.index" :placeholder="$t('请输入排序索引')"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('启用状态')">
          <el-switch
            v-model="ruleForm.state"
            :active-value="1"
            :inactive-value="0"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
          >
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('到件先知')">
          <el-switch
            v-model="ruleForm.auto_status"
            :active-value="1"
            :inactive-value="0"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <!-- <div v-else>
        <el-form :model="form" ref="ruleForm" label-width="150px" class="demo-ruleForm" label-position="left">
          <el-form-item :label="$t('启用到件告知')">
            <el-switch v-model="form.state">
            </el-switch>
          </el-form-item>
          <div class="message">
            <h4 style="color: #D36361;">{{$t('到件先知即提前获取没有预报信息')}},{{$t('直接通过快递过来的包裹信息')}}</h4>
            <el-form-item :label="$t('快递公司登录账号')">
              <el-input v-model="form.user"> </el-input>
            </el-form-item>
            <el-form-item :label="$t('快递公司登录密码')">
              <el-input show-password v-model="form.password"> </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="configuration">
          <div>{{$t('获取用户配置编号规则')}}</div>
          <div>
            <el-button plain>{{ $t('测试') }}</el-button>
            <el-button type="primary" plain>{{ $t('添加') }}</el-button>
          </div>
        </div>
        <div>
          <el-table :data="tableData" style="width: 100%;margin-top: 20px;" border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="name" :label="$t('名称')" width="180">
            </el-table-column>
            <el-table-column prop="address" :label="$t('正则表达式')">
            </el-table-column>
            <el-table-column :label="$t('操作')" width="180">
              <template slot-scope="scope">
                <el-button class="btn-dark-green">{{ $t('修改') }}</el-button>
                <el-button class="btn-light-red delete-btn">{{ $t('删除') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div> -->
    </div>
    <div slot="footer">
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('保存') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        num: '',
        state: 1,
        auto_status: 1,
        index: null
      },
      rules: {
        name: [{ required: true, message: this.$t('请输入快递公司名称'), trigger: 'blur' }],
        num: [{ required: true, message: this.$t('请输入快递公司代码'), trigger: 'blur' }],
        index: [{ required: true, message: this.$t('请输入排序索引'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.code = ''
      this.ruleForm.state = 1
      this.ruleForm.auto_status = 1
      this.$refs.ruleForm.resetFields()
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.AddForecastCompanies({ ...this.ruleForm }).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.show = false
              this.success()
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
</script>
<style lang="scss" scoped>
.dialog-add-express {
  .demo-ruleForm {
    margin-top: 20px;
    .el-form-item__label {
      width: 60px !important;
    }
  }
  .message {
    width: 60%;
    margin: auto;
  }
  .configuration {
    display: flex;
    justify-content: space-between;
  }
}
</style>
