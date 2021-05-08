<template>
  <div class="country-configuare-container">
    <el-row :gutter="20">
      <el-col :span="7">
        <div class="select-box">
          <add-btn @click.native="addCountry">{{ $t("添加国家") }}</add-btn>
        </div>
        <el-table
          :data="countryData"
          v-loading="tableLoading"
          class="data-list country"
          border
          stripe
          height="550"
        >
          <el-table-column width="40px" align="center">
            <template>
              <i class="el-icon-sort icon-fonts"></i>
            </template>
          </el-table-column>
          <!-- 前缀字符 -->
          <el-table-column prop="name" :label="$t('国家/地区')"> </el-table-column>
          <!-- 状态 -->
          <!-- <el-table-column :label="$t('状态')">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                @change="changeCountry($event, scope.row.enabled, scope.row.id)"
                :active-text="$t('开')"
                :inactive-text="$t('关')"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="gray"
              >
              </el-switch>
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('操作')">
            <template slot-scope="scope">
              <!-- 删除 -->
              <el-button
                class="btn-light-red"
                @click="deleteCountry(scope.row.id)"
                >{{ $t("删除") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
        <div class="sort-sty">
          *{{ $t("拖拽行可以进行排序") }}
          <el-button @click="rowUpdate" class="btn-deep-purple save-sort">{{
            $t("保存排序结果")
          }}</el-button>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="tips-sty">{{$t('提示：系统仅支持三级区域，对上一级地址操作启用/关闭，或删除时，对下级所有区域生效')}}</div>
        <el-table
          @selection-change="selectionChange"
          :data="currentCountryList"
          stripe
          border
          class="data-list"
          @expand-change="onExpand"
          v-loading="tableLoading"
          height="550"
        >
          <!-- 二级分类列表 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.orders" @selection-change="secondChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 二级分类名称 -->
                <el-table-column
                  :label="$t('三级区域')"
                  prop="name"
                ></el-table-column>
                <!-- 是否显示 -->
                <el-table-column :label="$t('是否启用')">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.enabled"
                      @change="changeShow($event, scope.row.id)"
                      :active-text="$t('开')"
                      :inactive-text="$t('关')"
                      active-color="#13ce66"
                      inactive-color="gray"
                    >
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('操作')" width="300">
                  <template slot-scope="scope">
                    <!-- 编辑 -->
                    <el-button
                      class="btn-dark-green btn-margin"
                      @click="editClassify(scope.row.id)"
                      >{{ $t("编辑") }}</el-button
                    >
                    <!-- 删除 -->
                    <el-button
                      @click="deleteCategories(scope.row.id)"
                      class="btn-light-red"
                      >{{ $t("删除") }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <!-- 一级分类列表 -->
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <!-- 一级分类名称 -->
          <el-table-column
            :label="$t('二级区域')"
            prop="name"
          ></el-table-column>
          <!-- 是否显示 -->
          <el-table-column :label="$t('是否启用')">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                @change="changeShow($event, scope.row.id)"
                :active-text="$t('开')"
                :inactive-text="$t('关')"
                active-color="#13ce66"
                inactive-color="gray"
              >
              </el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column :label="$t('操作')" width="300">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button
                class="btn-dark-green btn-margin"
                @click="editClassify(scope.row.id)"
                >{{ $t("编辑") }}</el-button
              >
              <!-- 删除 -->
              <el-button
                class="btn-light-red btn-margin"
                @click="deleteCategories(scope.row.id)"
                >{{ $t("删除") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
import Sortable from 'sortablejs'
export default {
  components: {
    AddBtn
  },
  data () {
    return {
      countryData: [],
      countrySendData: [],
      tableLoading: false,
      currentCountryList: [],
      deleteNum: [],
      secondNum: []
    }
  },
  created () {
    this.getCountryList()
    this.getCategories()
  },
  methods: {
    // 获取国家/地区数据
    getCountryList () {
      this.tableLoading = true
      this.$request.countryLocation().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.countryData = res.data
          this.countrySendData = [...res.data]
          console.log('countryData')
          this.$nextTick(() => {
            this.rowDrop()
          })
        }
      })
    },
    // 添加国家/地区
    addCountry () {
      dialog({ type: 'setCountry' }, () => {
        this.getCountryList()
      })
    },
    // 删除国家地区
    deleteCountry (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCountryLocation(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCountryList()
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
    // 国家地区 开启或关闭
    changeCountry (event, enabled, id) {
      console.log(event, 'event')
      if (event === 0) {
        this.$confirm(this.$t('停止支持该国家后，再次开启时需重新添加支持仓库与路线'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$request.closeCountryLocation(id, event).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getCountryList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        })
      } else {
        this.$request.closeCountryLocation(id, event).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getCountryList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 确定拖拽 国家地区
    rowUpdate () {
      // eslint-disable-next-line camelcase
      const ids = this.countrySendData.map(({ id, name }, index) => ({ id, index, name }))
      console.log(ids)
      this.countryData = []
      this.$request.countryLocationIndex(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getCountryList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 国家地区 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.country tbody')
      console.log(tbody, 'tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.countrySendData.splice(oldIndex, 1)[0]
          this.countrySendData.splice(newIndex, 0, oldItem)
        }
      })
    },
    // 一级选择框
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 二级选择框
    secondChange (selection) {
      console.log(selection, 'selection')
      this.secondNum = selection.map(item => (item.id))
      console.log(this.secondNum, 'this.secondNum')
    },
    // 点开当前行，获取二级菜单数据
    onExpand (row) {
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (row.orders.length) return
      let id = row.id
      this.$request.getSecondCategories(id).then(res => {
        if (res.ret) {
          row.orders = res.data.map(item => {
            return {
              ...item,
              enabled: Boolean(item.enabled),
              risk_warning_enabled: Boolean(item.risk_warning_enabled)
            }
          })
        }
      })
    },
    // 获取商品分类管理列表
    getCategories () {
      this.tableLoading = true
      this.$request.getCategories({
        // page: this.page_params.page,
        // size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.currentCountryList = res.data.map(item => {
            return {
              ...item,
              enabled: Boolean(item.enabled),
              risk_warning_enabled: Boolean(item.risk_warning_enabled),
              orders: []
            }
          })
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
    // 商品分类管理 开启或关闭 是否显示
    changeShow (event, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.closeCategories(id, Number(event)).then(res => {
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
    // 删除单条商品分类
    deleteCategories (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCategories(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作成功'),
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
<style lang="scss">
.country-configuare-container {
  .tips-sty {
    font-size: 14px;
    background-color: #d1d0d0;
    line-height: 40px;
    padding-left: 20px;
  }
}
</style>
