<template>
  <div class="settings-container">
    <el-form>
      <!-- 物品属性 -->
      <el-form-item>
        <div style="text-align: right">
          <el-button class="btn-light-red" @click="addProps">{{ $t('添加属性') }}</el-button>
        </div>
        <el-table
          :data="dynamicTags"
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
          <el-table-column :label="$t('属性名称')" prop="name"></el-table-column>
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
                @click="onProps(scope.row, item)"
              ></span>
              <span v-else class="el-icon-plus icon-sty" @click="onProps(scope.row, item)"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" width="200">
            <template slot-scope="scope">
              <el-button class="btn-dark-green" @click="editProps(scope.row.id, scope.row.name)">{{
                $t('编辑')
              }}</el-button>
              <el-button class="btn-light-red" @click="handleClose(scope.row.id)">{{
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
        <!-- <el-button
          class="btn-deep-purple others-btn"
          v-for="item in formatLangData"
          :key="item.id"
          @click="onProps(item)"
          >{{ item.name }}111</el-button
        > -->
      </el-form-item>
      <el-form-item :label="$t('物品属性选择方式')">
        <el-radio-group v-model="basic.prop_type" class="radio-sty" @change="changeBasic">
          <el-radio :label="1">{{ $t('单选') }}</el-radio>
          <el-radio :label="0">{{ $t('多选') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 未入库丢包预警 -->
      <el-form-item>
        <span class="no-warehouse">{{ $t('未入库丢包预警') }}</span>
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            $t('开启后，若预报包裹超过设定时间未入库，将会在包裹列表进行提示，表示包裹有丢失风险')
          "
          placement="top"
        >
          <span class="el-icon-question icon-question"></span>
        </el-tooltip>
        <el-radio-group v-model="basic.package_warning" @change="changeBasic" class="radio-sty">
          <el-radio :label="5">{{ $t('5天') }}</el-radio>
          <el-radio :label="7">{{ $t('7天') }}</el-radio>
          <el-radio :label="10">{{ $t('10天') }}</el-radio>
          <el-radio :label="0">{{ $t('不开启') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 入库是否必填尺寸 -->
      <el-form-item :label="$t('入库是否必填尺寸')">
        <el-switch
          v-model="basic.size"
          @change="changeBasic($event)"
          :active-text="$t('开')"
          :inactive-text="$t('关')"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
      <!-- 入库是否必填货位 -->
      <el-form-item :label="$t('入库是否必填货位')">
        <el-switch
          v-model="basic.location"
          @change="changeBasic($event)"
          :active-text="$t('开')"
          :inactive-text="$t('关')"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
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
      languageData: [],
      dynamicTags: [],
      tableLoading: false,
      propsData: [],
      typeSendData: [],
      basic: {
        size: '',
        location: '',
        package_warning: 0,
        prop_type: 0
      }
    }
  },
  created() {
    this.getProps()
    this.getBasic()
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
    onProps(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'propsLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getProps()
      })
    },
    // 添加属性
    addProps() {
      dialog({ type: 'addPackage', state: 'add' }, () => {
        this.getProps()
      })
    },
    // 编辑属性
    editProps(id, name) {
      dialog({ type: 'addPackage', id: id, name: name, state: 'edit' }, () => {
        this.getProps()
      })
    },
    // 自定义物流 行拖拽
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
    // 确定拖拽
    typeRowUpdate() {
      const ids = this.typeSendData.map(({ id, context }, index) => ({ id, index, context }))
      console.log(ids)
      this.dynamicTags = []
      this.$request.sortProps(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getProps()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    changeBasic() {
      this.$request
        .updateBasic({
          size: this.basic.size,
          location: this.basic.location,
          package_warning: this.basic.package_warning,
          prop_type: this.basic.prop_type
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getBasic()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 获取入库是否必填
    getBasic() {
      this.$request.getBasic().then(res => {
        if (res.ret) {
          this.basic.size = res.data.size
          this.basic.location = res.data.location
          this.basic.package_warning = res.data.package_warning
        }
      })
    },
    handleClose(id) {
      this.$confirm(
        this.$t('您真的要删除物品属性吗？会影响到系统内的包裹，请谨慎操作。'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        // console.log(id, 'id')
        // this.dynamicTags.splice(this.dynamicTags.indexOf(id), 1)
        this.$request
          .deleteProps({
            DELETE: [id]
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getProps()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    // 获取物品属性
    getProps() {
      this.$request.getPackage().then(res => {
        if (res.ret) {
          this.dynamicTags = res.data
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
<style scoped></style>
