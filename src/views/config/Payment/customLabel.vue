<template>
  <div class="label-container">
    <el-form>
      <el-form-item>
        <div style="text-align: right">
          <el-button class="btn-light-red" @click="addLabel">{{ $t('添加标签') }}</el-button>
        </div>
        <el-table
          :data="lineTable"
          v-loading="tableLoading"
          class="data-list positions-type"
          border
          stripe
        >
          <el-table-column width="100px" align="center">
            <template>
              <i class="el-icon-sort icon-fonts"></i>
            </template>
          </el-table-column>
          <el-table-column :label="$t('标签名称')" prop="name"></el-table-column>
          <el-table-column
            align="center"
            :label="item.name"
            v-for="item in formatLangData"
            :key="item.id"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row['trans_' + item.language_code]"
                class="el-icon-check icon-sty"
                @click="onLabel(scope.row, item)"
              ></span>
              <span v-else class="el-icon-plus icon-sty" @click="onLabel(scope.row, item)"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" width="200">
            <template slot-scope="scope">
              <el-button class="btn-dark-green" @click="editLabel(scope.row.id, scope.row.name)">{{
                $t('编辑')
              }}</el-button>
              <el-button class="btn-light-red" @click="handleClose(scope.row.id)">{{
                $t('删除')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="sort-sty">
          *{{ $t('拖拽行可以进行排序') }}
          <el-button class="btn-deep-purple save-sort" @click="typeRowUpdate">{{
            $t('保存排序结果')
          }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      tableLoading: false,
      lineTable: [],
      languageData: [],
      typeSendData: []
    }
  },
  created() {
    this.getLineLabel()
    this.getLanguageList()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    // 获取支持语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 基础配置 修改语言
    // onProps(line, lang) {
    //   this.transCode = line['trans_' + lang.language_code]
    //   dialog({ type: 'labelLang', line: line, lang: lang, transCode: this.transCode }, () => {
    //     this.getLineLabel()
    //   })
    // },
    onLabel(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'customLabelLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getLineLabel()
      })
    },

    // 翻译
    // 添加属性
    addLabel() {
      dialog({ type: 'addCustomLabel', state: 'add' }, () => {
        this.getLineLabel()
      })
    },
    // 编辑属性
    editLabel(id, name) {
      dialog({ type: 'addCustomLabel', id: id, name: name, state: 'edit' }, () => {
        this.getLineLabel()
      })
    },
    //行拖拽
    typeRowDrop() {
      const tbody = document.querySelector('.positions-type tbody')
      console.log(tbody, 'tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.typeSendData.splice(oldIndex, 1)[0]
          this.typeSendData.splice(newIndex, 0, oldItem)
        }
      })
    },
    typeRowUpdate() {
      const ids = this.typeSendData.map(({ id, context }, index) => ({ id, index, context }))
      console.log(ids)
      this.lineTable = []
      this.$request.sortLabel(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getLineLabel()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    handleClose(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deleteLabel({
            DELETE: [id]
          })
          .then(res => {
            console.log(res)
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getLineLabel()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    getLineLabel() {
      this.$request.lineLabel().then(res => {
        console.log(res)
        if (res.ret) {
          this.lineTable = res.data
          this.typeSendData = [...res.data]
          this.$nextTick(() => {
            this.typeRowDrop()
          })
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

<style lang="scss"></style>
