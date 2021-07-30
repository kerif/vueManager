<template>
  <div class="grade">
    <h3>{{ $t('会员等级') }}</h3>
    <!-- 添加弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="gradeDialog"
      width="30%"
      class="dialog-container"
      @close="resetForm('gradeForm')"
    >
      <div class="lang-sty" v-if="lang.id">
        <p>
          <span class="el-icon-warning icon-info"></span>
          {{ $t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息') }}
        </p>
      </div>
      <el-form ref="gradeForm" :model="gradeForm">
        <el-form-item :label="$t('等级名称')" prop="name">
          <el-input v-model="gradeForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('等级成长值') + '(>=)'" prop="growth_value" v-if="!lang.id">
          <el-input v-model="gradeForm.growth_value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gradeDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
    <div class="function-btn">
      <el-button size="small" @click="addGrade" type="primary">{{ $t('添加') }}</el-button>
      <el-button size="small" @click="explain">{{ $t('等级说明') }}</el-button>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="name" :label="$t('等级名称')"> </el-table-column>
        <el-table-column prop="growth_value" :label="$t('成长值') + '(>=)'"> </el-table-column>
        <el-table-column
          :label="item.name"
          v-for="item in formatLangData"
          :key="item.id"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row['trans_' + item.language_code]"
              class="el-icon-check icon-sty"
              @click="onLang(scope.row, item, 'edit')"
            ></span>
            <span
              v-else
              class="el-icon-plus icon-sty"
              @click="onLang(scope.row, item, 'add')"
            ></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button size="mini" class="btn-green" @click="editGrade(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <el-button size="mini" class="btn-light-red" @click="deleteGrade(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination
        style="margin-top: 5px"
        :pageParams="page_params"
        :notNeedInitQuery="false"
      ></nle-pagination>
    </div>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      gradeDialog: false,
      gradeForm: {
        name: '',
        growth: ''
      },
      tipsDialog: false,
      tipsForm: {
        zh_CN: '',
        zh_TW: '',
        en_US: ''
      },
      tableData: [],
      title: '',
      gradeId: '',
      languageData: [],
      lang: {},
      langId: '',
      langObj: {}
    }
  },
  created() {
    this.getList()
    this.getGradeTips()
  },
  methods: {
    //获取列表
    getList() {
      this.$request
        .getGradeList({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    //获取详情
    editGrade(id) {
      this.$request.getGradeDetails(id).then(res => {
        if (res.ret) {
          this.gradeDialog = true
          this.gradeId = id
          this.gradeForm = res.data
          this.title = this.$t('编辑会员等级')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 添加
    addGrade() {
      this.gradeDialog = true
      this.title = this.$t('添加会员等级')
    },
    //删除
    deleteGrade(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteGrade(id).then(res => {
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
      })
    },
    // 修改语言
    onLang(line, lang, type) {
      this.title = this.$t('编辑会员等级')
      this.gradeDialog = true
      this.lang = lang
      this.langId = line.id
      if (type === 'edit') {
        this.$request.getGradeDetails(line.id, { lang: lang.language_code }).then(res => {
          if (res.ret) {
            this.gradeForm.name = res.data.name
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    //获取等级说明
    getGradeTips() {
      this.$request.getGradeTips().then(res => {
        if (res.ret) {
          this.langObj = res.data.illustrate
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    explain() {
      dialog({ type: 'getGradeTips', langObj: this.langObj })
    },
    //确定
    async confirm() {
      let res = {}
      if (this.gradeId) {
        res = await this.$request.editGrade(this.gradeId, this.gradeForm)
      } else if (this.lang.id) {
        this.gradeForm.language = this.lang.language_code
        res = await this.$request.translateGrade(this.langId, this.gradeForm)
      } else {
        res = await this.$request.addGrade(this.gradeForm)
      }
      if (res.ret) {
        this.$notify({
          type: 'success',
          title: this.$t('操作成功'),
          message: res.msg
        })
        this.gradeDialog = false
        this.getList()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    resetForm(form) {
      this.gradeId = ''
      this.langId = ''
      this.lang = {}
      this.$refs[form].resetFields()
    }
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  }
}
</script>
<style scoped lang="scss">
.grade {
  .function-btn {
    margin-bottom: 20px;
  }
  .lang-sty {
    line-height: 40px;
    color: #e6a344;
    p {
      background-color: #fdf6ed;
    }
  }
}
</style>
