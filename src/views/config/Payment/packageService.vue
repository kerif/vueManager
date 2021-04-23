<template>
  <div>
    <div class="select-box">
      <add-btn @click.native="addParcel">{{ $t("添加包裹增值服务") }}</add-btn>
    </div>
    <el-table
      :data="parcelData"
      v-loading="tableLoading"
      class="data-list"
      border
      stripe
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="name"
        :label="$t('增值服务名称')"
      ></el-table-column>
      <el-table-column
        prop="price"
        :label="$t('价格') + this.localization.currency_unit"
      ></el-table-column>
      <el-table-column prop="remark" :label="$t('备注')"></el-table-column>
      <el-table-column :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeParcel($event, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
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
            @click="onPackage(scope.row, item)"
          ></span>
          <span
            v-else
            class="el-icon-plus icon-sty"
            @click="onPackage(scope.row, item)"
          ></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="140px">
        <template slot-scope="scope">
          <el-button class="btn-dark-green" @click="editParcel(scope.row.id)">{{
            $t("编辑")
          }}</el-button>
          <el-button
            class="btn-light-red"
            @click="deleteParcel(scope.row.id)"
            >{{ $t("删除") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      tableLoading: false,
      localization: {},
      languageData: [],
      page_params: {
        type: ''
      },
      parcelData: [
        {
          enabled: true
        }
      ]
    }
  },
  created () {
    this.getParcel()
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList () {
      this.getParcel()
    },
    // 包裹 增加增值服务
    addParcel () {
      dialog({ type: 'addService', state: 'add', name: 'addParcel' }, () => {
        this.getList()
      })
    },
    // 获取包裹增值服务
    getParcel () {
      this.tableLoading = true
      this.$request.getParcel({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.parcelData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.localization = res.localization
          console.log(this.parcelData, 'parcelData')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 包裹增值服务 开关启用状态
    changeParcel (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeParcel(id, Number(event)).then(res => {
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
    },
    // 包裹增值服务 修改语言
    onPackage (line, lang) {
      console.log(line, lang)
      this.packageCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'serviceLang', line: line, lang: lang, transCode: this.packageCode, state: 'package' }, () => {
        this.getValue()
      })
    },
    // 包裹 编辑增值服务
    editParcel (id) {
      dialog({ type: 'addService', state: 'edit', id: id, name: 'editParcel' }, () => {
        this.getList()
      })
    },
    // 包裹 删除增值服务
    deleteParcel (id) {
      this.$confirm(this.$t('您真的要删除增值服务吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteParcel(id).then(res => {
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
      })
    }
  }
}

</script>
<style scoped>
</style>
