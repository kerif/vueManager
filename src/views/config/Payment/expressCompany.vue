<template>
  <div>
    <div class="select-box">
      <add-btn @click.native="addExpress">{{ $t('添加') }}</add-btn>
    </div>
    <el-table
      :data="expressData"
      v-loading="tableLoading"
      class="data-list"
      border
      stripe
      height="calc(100vh - 360px)"
    >
      <el-table-column type="index"></el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.status === false">{{ $t('禁用') }}</span>
          <span v-if="scope.row.status === true">{{ $t('启用') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="LOGO">
        <template slot-scope="scope">
          <span
            style="cursor: pointer"
            v-if="scope.row.logo"
            @click.stop=";(imgSrc = scope.row.logo), (imgVisible = true)"
          >
            <img :src="scope.row.logo" style="width: 70px; height: 80px" />
          </span>
          <!-- <span v-else style="cursor:pointer;" @click.stop="imgSrc=scope.row.logo, imgVisible=true">
                  <img :src="$baseUrl.IMAGE_URL + scope.row.logo" style="width:70px; height: 80px;">
                </span> -->
        </template>
      </el-table-column>
      <!-- 快递公司名称 -->
      <el-table-column prop="name" :label="$t('快递公司名称')"></el-table-column>
      <!-- 快递公司代码 -->
      <el-table-column prop="code" :label="$t('快递公司代码')"></el-table-column>
      <!-- 联系电话 -->
      <el-table-column prop="contact_phone" :label="$t('联系电话')"></el-table-column>
      <!-- 官网 -->
      <el-table-column prop="website" :label="$t('官网')"></el-table-column>
      <el-table-column :label="$t('是否启用')" width="120px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changeExpress($event, scope.row.id)"
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
            @click="onExpress(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="onExpress(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="140">
        <template slot-scope="scope">
          <el-button
            class="btn-dark-green"
            @click="editExpress(scope.row.id)"
            v-if="scope.row.is_default === 0"
            >{{ $t('编辑') }}</el-button
          >
          <el-button
            class="btn-light-red delete-btn"
            @click="deleteExpress(scope.row.id)"
            v-if="scope.row.is_default === 0"
            >{{ $t('删除') }}</el-button
          >
          <el-button
            class="btn-light-red"
            style="margin: 10px 0 0 0"
            @click="
              replaceTrack(
                scope.row.id,
                scope.row.name,
                scope.row.logo,
                scope.row.contact_phone,
                scope.row.website
              )
            "
            >{{ $t('轨迹替换') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
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
  data() {
    return {
      page_params: {
        type: ''
      },
      tableLoading: false,
      languageData: [],
      expressData: [
        {
          status: true
        }
      ],
      imgSrc: '',
      imgVisible: false
    }
  },
  created() {
    this.getExpress()
    this.getLanguageList()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    getList() {
      this.getExpress()
    },
    // 获取发货快递公司
    getExpress() {
      this.tableLoading = true
      this.$request
        .getExpressValue({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.expressData = res.data.map(item => ({ ...item, status: Boolean(item.status) }))
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.localization = res.localization
            console.log(this.valueData, 'valueData')
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 添加发货快递公司
    addExpress() {
      dialog({ type: 'expressEditAdd', state: 'add' }, () => {
        this.getExpress()
      })
    },
    // 发货快递公司 开关启用状态
    changeExpress(event, id) {
      this.$request.closeExpress(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getExpress()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 发货快递公司 修改语言
    onExpress(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'expressLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getExpress()
      })
    },
    editExpress(id) {
      dialog({ type: 'expressEditAdd', state: 'edit', id: id }, () => {
        this.getExpress()
      })
    },
    // 订单 删除 快递公司
    deleteExpress(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteExpress(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getExpress()
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
    replaceTrack(id, name, logo, contactPhone, website) {
      this.$router.push({
        name: 'deliveryCompany',
        query: { id },
        params: {
          name,
          logo,
          contactPhone,
          website
        }
      })
    }
  }
}
</script>
<style scoped></style>
