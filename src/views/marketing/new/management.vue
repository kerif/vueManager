<template>
  <div class="management-new-container">
    <!-- <search-group :placeholder="$t('请输入关键字')" v-model="page_params.keyword" @search="goSearch"></search-group> -->
    <div class="add-sty">
      <div class="coupons">
        <h3>
          {{
            $route.params.type === 1
              ? $t('新用户送券')
              : $route.params.type === 2
              ? $t('邀请新人送券')
              : $route.params.type === 3
              ? $t('被邀请人送券')
              : $route.params.type === 4
              ? $t('下单返券')
              : $route.params.type === 5
              ? $t('关注公众号领券')
              : $t('生日营销')
          }}
        </h3>
        <div style="width: 1100px">
          <el-row :gutter="20">
            <el-col :span="4"
              ><span>{{ $t('券总量') }}</span
              ><span class="count">{{ total_count }}</span></el-col
            >
            <el-col :span="4"
              ><span>{{ $t('投放数量') }}</span
              ><span class="count">{{ throw_count }}</span></el-col
            >
            <el-col :span="4"
              ><span>{{ $t('已使用数量') }}</span>
              <span class="count">{{ used_count }}</span></el-col
            >
            <el-col :span="4"
              ><span>{{ $t('过期数量') }}</span
              ><span class="count">{{ expired_count }}</span></el-col
            >
            <el-col :span="4"
              ><span>{{ $t('未使用数量') }}</span
              ><span class="count">{{ unused_count }}</span></el-col
            >
          </el-row>
        </div>
        <div class="remark">
          {{ $t('该数据统计不包含已删除活动数据已发放券正常使用可前往抵用券管理查看') }}
        </div>
      </div>
      <add-btn @click.native="goAdd" class="btn-add">{{ $t('添加') }}</add-btn>
    </div>
    <el-table
      class="data-list"
      border
      stripe
      v-loading="tableLoading"
      @selection-change="selectionChange"
      :data="voucherData"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 优惠券名称 -->
      <el-table-column :label="$t('优惠券名称')" prop="name"></el-table-column>
      <el-table-column :label="$t('类型')" prop="coupon_type">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon_type === 1 ? $t('抵现券') : $t('抵重券') }}</span>
        </template>
      </el-table-column>
      <!-- 金额 -->
      <el-table-column :label="$t('金额') + this.localization.currency_unit" prop="amount">
      </el-table-column>
      <el-table-column :label="$t('重量')" prop="weight"></el-table-column>
      <!-- 使用范围 -->
      <!-- <el-table-column :label="$t('使用范围')" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-for="item in scope.row.usable_lines" :key="item.id">
            {{item.name}}&nbsp;
          </span>
        </template>
      </el-table-column> -->
      <!-- 最低消费金额 -->
      <el-table-column :label="$t('最低消费金额')" prop="threshold"></el-table-column>
      <el-table-column :label="$t('最低重量')" prop="min_weight"> </el-table-column>
      <!-- 失效时间 -->
      <el-table-column :label="$t('有效时长')" prop="days"></el-table-column>
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
            @click="onLang(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button
            class="btn-purple"
            v-if="$route.params.type === 4"
            @click="goDetails(scope.row.id)"
            >{{ $t('详情') }}</el-button
          >
          <el-button class="btn-purple" v-else @click="goOtherDetails(scope.row.id)">{{
            $t('详情')
          }}</el-button>
          <!-- 记录 -->
          <el-button
            size="small"
            class="btn-dark-green detailsBtn"
            @click="recoding(scope.row.id)"
            >{{ $t('记录') }}</el-button
          >
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">{{
            $t('删除')
          }}</el-button>
        </div>
      </template>
    </el-table>
    <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
  </div>
</template>

<script>
import AddBtn from '@/components/addBtn'
// import { SearchGroup } from '@/components/searchs'
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    // SearchGroup,
    // NlePagination,
    AddBtn
  },
  mixins: [pagination],
  name: 'voucherList',
  data() {
    return {
      activeName: '1',
      voucherData: [],
      status: '',
      type: '1',
      voucherChange: [
        {
          id: '2',
          name: this.$t('新用户福利券')
        },
        {
          id: '1',
          name: this.$t('抵用券')
        },
        {
          id: '',
          name: this.$t('全部')
        }
      ],
      show: false,
      selectIDs: [],
      localization: {},
      tableLoading: false,
      languageData: [],
      transCode: '',
      ruleForm: {
        status: []
      },
      deleteNum: [],
      expired_count: '',
      throw_count: '',
      total_count: '',
      unused_count: '',
      used_count: ''
    }
  },
  created() {
    // if (this.$route.query.activeName) {
    //   this.activeName = this.$route.query.activeName
    //   this.status = Number(this.activeName) === 0 ? '' : Number(this.activeName) - 1
    // }
    // if (this.$route.query.type) {
    //   this.type = this.$route.query.type
    // }
    if (this.$route.params.type) {
      this.$route.params.type = Number(this.$route.params.type)
    }

    this.getTypeStatistics()
  },
  activated() {
    // this.getList()
    // this.getLanguageList()
  },
  mounted() {
    this.getList()
    this.getLanguageList()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.voucherData = []
      this.$request
        .newManaList(this.$route.params.type, {
          // keyword: this.page_params.keyword,
          // page: this.page_params.page,
          // size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.voucherData = res.data
            this.localization = res.localization
            // this.page_params.page = res.meta.current_page
            // this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 记录
    recoding(id) {
      this.$router.push({ name: 'userWelfare', query: { type: '2', id: id } })
    },
    // 删除
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .newDelete({
            ids: this.deleteNum
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
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 新增
    goAdd() {
      if (this.$route.params.type === 4) {
        this.$router.push({ name: 'rebate', params: { type: this.$route.params.type } })
      } else {
        this.$router.push({ name: 'ordinary', params: { type: this.$route.params.type } })
      }
      // else {
      //   this.$router.push({ name: 'addNew', params: { type: this.$route.params.type } })
      // }
    },
    // 编辑
    goDetails(id) {
      this.$router.push({
        name: 'rebate',
        params: { type: this.$route.params.type },
        query: { id: id }
      })
    },
    goOtherDetails(id) {
      this.$router.push({
        name: 'ordinaryDetail',
        params: { type: this.$route.params.type },
        query: { id: id }
      })
    },
    //统计
    getTypeStatistics() {
      this.$request.typeStatistics(this.$route.params.type).then(res => {
        console.log(res.data)
        this.expired_count = res.data.expired_count
        this.throw_count = res.data.throw_count
        this.total_count = res.data.total_count
        this.unused_count = res.data.unused_count
        this.used_count = res.data.used_count
      })
    },
    onSelectChange(selection) {
      this.selectIDs = selection.map(item => item.id)
    },
    // 添加转运快递单号
    edit(row) {
      row.disabled = !row.disabled
    },
    // 取消
    cancel(row) {
      row.logistics_sn = row.copySN
      row.disabled = true
    },
    // 保存添加转运快递单号
    saveLogistics(row) {
      if (!row.logistics_sn) {
        return this.$message.info(this.$t('请输入转运快递单号'))
      }
      this.$request
        .updateLogistics([
          {
            id: row.id,
            sn: row.logistics_sn
          }
        ])
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('保存成功'),
              message: res.msg,
              type: 'success'
            })
            row.disabled = true
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // tab change
    onTabChange(tab) {
      switch (tab.name) {
        case '1': // 全部
          this.status = ''
          break
        case '2': // 未开始
          this.status = 1
          break
        case '3': // 进行中
          this.status = 2
          break
        case '4': // 已失效
          this.status = 3
          break
      }
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.getList()
    },
    // 选择不同类型优惠券
    onVocherTypeChange() {
      this.page_params.handleQueryChange('type', this.type)
      this.getList()
    },
    // 转账 修改语言
    onLang(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'newLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
      })
    }
  },
  watch: {
    '$route.path': () => {
      this.getList()
      this.getLanguageList()
    }
  }
}
</script>

<style lang="scss">
.management-new-container {
  .tabLength {
    width: 350px !important;
  }
  .detailsBtn {
    margin: 3px 2px !important;
  }
  .changeVou {
    float: right;
    margin-right: 10px;
    .el-input {
      width: 98%;
    }
  }
  .add-sty {
    width: 100%;
    height: 140px;
    background: white;
    margin-bottom: 20px;
    overflow: hidden;
    .coupons {
      float: left;
      margin: 0 0 0 20px;
    }
    .count {
      display: inline-block;
      margin-left: 20px;
      font-weight: bold;
    }
  }
  .btn-add {
    margin: 20px 20px 0 0;
  }
  .remark {
    color: red;
    margin-top: 10px;
  }
}
</style>
