<template>
  <div>
    <!-- 编辑系统物流类型 -->
    <el-dialog
      :visible.sync="trackingDialog"
      width="30%"
      :title="$t('编辑')"
      @close="clearTracking"
    >
      <el-input v-model="context" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
      <div slot="footer">
        <el-button @click="trackingDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="saveTackingType">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 自定义物流类型 -->
    <el-dialog
      :visible.sync="expressDialog"
      width="30%"
      :title="this.typeId ? $t('编辑') : $t('新增')"
      @close="clearType"
    >
      <el-form :model="typeForm" ref="typeForm" class="demo-ruleForm">
        <el-form-item :label="$t('物流信息')">
          <el-input v-model="typeForm.context"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="expressDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitExpress">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <div class="select-box">
      <h4>{{ $t('系统物流类型') }}</h4>
      <!-- <add-btn @click.native="addTransfer">{{$t('添加支付类型')}}</add-btn> -->
    </div>
    <el-table :data="systemData" v-loading="tableLoading" class="data-list" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('类型')" prop="name"></el-table-column>
      <el-table-column :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changeSystem($event, scope.row.status, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('描述')"
        prop="context"
        :show-overflow-tooltip="true"
        width="120"
      ></el-table-column>
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
            @click="trackingLang(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="trackingLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-dark-green" @click="editTracking(scope.row.id)">{{
            $t('编辑')
          }}</el-button>
          <!-- <el-button class="btn-light-red" @click="deleteTransfer(scope.row.id)">{{$t('删除')}}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 自定义级别物流类型 -->
    <div class="select-box">
      <h4>{{ $t('自定义物流类型') }}</h4>
      <add-btn @click.native="addLogisticsType">{{ $t('添加') }}</add-btn>
    </div>
    <el-table
      :data="TypeData"
      v-loading="tableLoading"
      class="data-list logistics-type"
      border
      stripe
    >
      <el-table-column width="100px" align="center">
        <template>
          <i class="el-icon-sort icon-fonts"></i>
        </template>
      </el-table-column>
      <!-- 物流类型 -->
      <el-table-column prop="context" :label="$t('物流信息')"> </el-table-column>
      <!-- 是否启用 -->
      <el-table-column :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changeType($event, scope.row.status, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
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
            @click="TypeLang(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="TypeLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="160px">
        <template slot-scope="scope">
          <el-button class="btn-dark-green" @click="editLogisticsType(scope.row.id)">{{
            $t('编辑')
          }}</el-button>
          <el-button class="btn-light-red" @click="deleteLogisticsType(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
    <div class="sort-sty">
      *{{ $t('拖拽行可以进行排序') }}
      <el-button @click="typeRowUpdate" class="btn-deep-purple save-sort">{{
        $t('保存排序结果')
      }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
import Sortable from 'sortablejs'
export default {
  components: {
    AddBtn
  },
  data() {
    return {
      tableLoading: false,
      trackingDialog: false,
      expressDialog: false,
      typeForm: {
        context: ''
      },
      typeId: '',
      languageData: [],
      systemData: [],
      trackingId: '',
      context: '',
      TypeData: []
    }
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  created() {
    this.getSystem()
    this.getTypeData()
    this.getLanguageList()
  },
  methods: {
    // 系统物流类型数据
    getSystem() {
      this.$request.getSetSystem().then(res => {
        if (res.ret) {
          this.systemData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 系统物流类型 开启或关闭
    changeSystem(event, enabled, id) {
      this.$request.closeSystem(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getSystem()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 系统物流类型 修改语言
    trackingLang(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog(
        {
          type: 'trackingLang',
          line: line,
          lang: lang,
          transCode: this.transCode,
          state: 'tracking'
        },
        () => {
          this.getSystem()
        }
      )
    },
    // 自定义物流类型 修改语言
    TypeLang(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog(
        { type: 'trackingLang', line: line, lang: lang, transCode: this.transCode, state: 'type' },
        () => {
          this.getTypeData()
        }
      )
    },
    // 编辑系统物流系统
    editTracking(id) {
      this.trackingId = id
      this.trackingDialog = true
      this.getTackingType()
    },
    clearTracking() {
      this.trackingId = ''
      this.context = ''
    },
    // 更新 单条物流系统
    saveTackingType() {
      this.$request
        .updateAloneTracking(this.trackingId, {
          context: this.context
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.trackingDialog = false
            this.getSystem()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 自定义物流系统列表
    getTypeData() {
      this.$request.TypeData().then(res => {
        if (res.ret) {
          this.TypeData = res.data
          this.typeSendData = [...res.data]
          console.log('typeSendData')
          this.$nextTick(() => {
            this.typeRowDrop()
          })
        }
      })
    },
    // 获取单条物流类型
    getTackingType() {
      this.$request.getAloneTracking(this.trackingId).then(res => {
        if (res.ret) {
          this.context = res.data.context
        }
      })
    },
    // 新增 自定义物流类型
    addLogisticsType() {
      this.expressDialog = true
    },
    // 编辑 自定义物流类型
    editLogisticsType(id) {
      this.typeId = id
      this.expressDialog = true
      this.getTypeDialog()
    },
    // 删除 自定义物流
    deleteLogisticsType(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTypeData(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getTypeData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    clearType() {
      this.typeForm.context = ''
    },
    // 获取 单条自定义物流信息
    getTypeDialog() {
      this.$request.getAloneType(this.typeId).then(res => {
        if (res.ret) {
          this.typeForm.context = res.data.context
        }
      })
    },
    // 确定提交 自定义物流类型
    submitExpress() {
      if (this.typeId) {
        this.$request.updateTypeData(this.typeId, this.typeForm).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.expressDialog = false
            this.getTypeData()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      } else {
        this.$request.addTypeData(this.typeForm).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.expressDialog = false
            this.getTypeData()
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
    // 系统物流类型 开启或关闭
    changeType(event, enabled, id) {
      this.$request.closeType(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getTypeData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 确定拖拽 自定义物流
    typeRowUpdate() {
      const ids = this.typeSendData.map(({ id, context }, index) => ({ id, index, context }))
      console.log(ids)
      this.TypeData = []
      this.$request.typeLocationIndex(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getTypeData()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自定义物流 行拖拽
    typeRowDrop() {
      const tbody = document.querySelector('.logistics-type tbody')
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
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    }
  }
}
</script>
<style scoped></style>
