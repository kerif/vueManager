<template>
  <div class="country-configuare-container">
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="select-box">
          <add-btn @click.native="addCountry">{{ $t('添加国家') }}</add-btn>
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
          <el-table-column :label="$t('状态')">
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
          </el-table-column>
          <el-table-column :label="$t('操作')">
            <template slot-scope="scope">
              <!-- 删除 -->
              <el-button class="btn-light-red btn-margin" @click="deleteCountry(scope.row.id)">{{
                $t('删除')
              }}</el-button>
              <!-- 详情 -->
              <el-button class="btn-purple" @click="goDeatils(scope.row.name, scope.row.id)">{{
                $t('详情')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
        <div class="sort-sty">
          *{{ $t('拖拽行可以进行排序') }}
          <el-button @click="rowUpdate" class="btn-deep-purple save-sort">{{
            $t('保存排序结果')
          }}</el-button>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="tips-sty">
          {{
            $t('提示：系统仅支持三级区域，对上一级地址操作启用/关闭，或删除时，对下级所有区域生效')
          }}
        </div>
        <div style="margin-top: 15px; overflow: hidden">
          <!-- <el-switch
            class="swtich-sty"
            v-model="enabled"
            :active-text="$t('开')"
            :active-value="1"
            :inactive-value="0"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray">
          </el-switch> -->
          {{ $t('当前') }}：{{ countryName }}
          <div class="top-right">
            <el-button class="btn-light-red" @click="batchDelete">{{ $t('批量删除') }}</el-button>
            <!-- <el-button class="btn-dark-green">{{$t('批量导入')}}</el-button> -->
            <el-button class="btn-blue" @click="addLowLevelCountry">{{ $t('添加') }}</el-button>
          </div>
          <!-- @expand-change="onExpand" -->
          <div style="height: calc(100vh - 480px)">
            <el-table
              @selection-change="selectionChange"
              :data="currentCountryList"
              stripe
              border
              class="data-list"
              v-loading="tableLoading"
              height="calc(100vh - 480px)"
            >
              <!-- 二级分类列表 -->
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-table :data="props.row.areas" @selection-change="secondChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <!-- 二级分类名称 -->
                    <el-table-column :label="$t('三级区域')" prop="name"></el-table-column>
                    <!-- 是否显示 -->
                    <el-table-column :label="$t('是否启用')">
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.enabled"
                          @change="changeShow($event, scope.row.id)"
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
                    <el-table-column :label="$t('操作')">
                      <template slot-scope="scope">
                        <!-- 编辑 -->
                        <el-button
                          class="btn-dark-green btn-margin"
                          @click="editLowLevelCountry(scope.row.id)"
                          >{{ $t('编辑') }}</el-button
                        >
                        <!-- 删除 -->
                        <el-button @click="deleteLOwLevel([scope.row.id])" class="btn-light-red">{{
                          $t('删除')
                        }}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <!-- 一级分类列表 -->
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <!-- 一级分类名称 -->
              <el-table-column :label="$t('二级区域')" prop="name"></el-table-column>
              <!-- 是否显示 -->
              <el-table-column :label="$t('是否启用')">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.enabled"
                    @change="changeShow($event, scope.row.id)"
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
              <!-- 操作 -->
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <!-- 编辑 -->
                  <el-button
                    class="btn-dark-green btn-margin"
                    @click="editLowLevelCountry(scope.row.id)"
                    >{{ $t('编辑') }}</el-button
                  >
                  <!-- 删除 -->
                  <el-button
                    class="btn-light-red btn-margin"
                    @click="deleteLOwLevel([scope.row.id])"
                    >{{ $t('删除') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
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
  data() {
    return {
      countryData: [],
      countrySendData: [],
      tableLoading: false,
      currentCountryList: [],
      deleteNum: [],
      secondNum: [],
      enabled: 0,
      countryId: '',
      countryName: ''
    }
  },
  created() {
    this.getCountryList()
  },
  methods: {
    // 获取国家/地区数据
    getCountryList() {
      this.tableLoading = true
      this.$request.countryLocation().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.countryData = res.data
          this.countryId = res.data[0].id
          if (this.countryId) {
            this.goDeatils(res.data[0].name, this.countryId)
          }
          this.countrySendData = [...res.data]
          console.log('countryData')
          this.$nextTick(() => {
            this.rowDrop()
          })
        }
      })
    },
    // 添加国家/地区
    addCountry() {
      dialog(
        {
          type: 'setCountry'
        },
        () => {
          this.getCountryList()
        }
      )
    },
    // 删除国家地区
    deleteCountry(ids) {
      if (!ids.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCountryLocation(ids).then(res => {
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
    changeCountry(event, id) {
      console.log(event, 'event')
      if (event === 0) {
        this.$confirm(
          this.$t('停止支持该国家后，再次开启时需重新添加支持仓库与路线'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }
        )
          .then(() => {
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
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
            this.getCountryList()
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
    rowUpdate() {
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
    rowDrop() {
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
    // 详情
    goDeatils(name, id) {
      this.countryId = id
      console.log(this.countryId, 'this.countryId111')
      this.countryName = name
      this.$request.superiorArea(this.countryId).then(res => {
        if (res.ret) {
          this.currentCountryList = res.data
        }
      })
    },
    // 一级选择框
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 二级选择框
    secondChange(selection) {
      console.log(selection, 'selection')
      const data = new Set([...this.secondNum, ...selection.map(item => item.id)])
      this.secondNum = Array.from(data)
      console.log(this.secondNum, 'this.secondNum')
    },
    // 点开当前行，获取二级菜单数据
    // onExpand (row) {
    //   // 如果当前货单已经获取了二级菜单数据，就不在获取
    //   if (row.orders.length) return
    //   let id = row.id
    //   this.$request.getSecondCategories(id).then(res => {
    //     if (res.ret) {
    //       row.orders = res.data.map(item => {
    //         return {
    //           ...item,
    //           enabled: Boolean(item.enabled),
    //           risk_warning_enabled: Boolean(item.risk_warning_enabled)
    //         }
    //       })
    //     }
    //   })
    // },
    // 获取商品分类管理列表
    // getCategories () {
    //   this.tableLoading = true
    //   this.$request.getCategories({
    //     // page: this.page_params.page,
    //     // size: this.page_params.size
    //   }).then(res => {
    //     this.tableLoading = false
    //     if (res.ret) {
    //       this.currentCountryList = res.data.map(item => {
    //         return {
    //           ...item,
    //           enabled: Boolean(item.enabled),
    //           risk_warning_enabled: Boolean(item.risk_warning_enabled),
    //           orders: []
    //         }
    //       })
    //       this.localization = res.localization
    //       this.page_params.page = res.meta.current_page
    //       this.page_params.total = res.meta.total
    //     } else {
    //       this.$notify({
    //         title: this.$t('操作失败'),
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
    // },
    // 二三级国家 开启或关闭 是否显示
    // ersa
    changeShow(event, id) {
      // 国家二三级菜单开启或关闭
      this.$request.changeLowLeverCountry(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.goDeatils(this.countryName, this.countryId)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 删除二三级国家菜单
    deleteLOwLevel(id) {
      console.log(id, 'id')
      this.$confirm(
        this.$t('您是否确认批量删除？如果是批量删除二级地址的话，该分级下所有的三级地址也会删除'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request
          .deleteLOwLevel({
            ids: id
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.goDeatils(this.countryName, this.countryId)
            } else {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      })
    },
    // 批量删除
    batchDelete() {
      if (this.deleteNum.length === 0 && this.secondNum.length === 0) {
        return this.$message.error(this.$t('请选择'))
      }
      const ids = this.secondNum.concat(this.deleteNum)
      console.log(ids, 'ids')
      this.$confirm(
        this.$t('您是否确认批量删除？如果是批量删除二级地址的话，该分级下所有的三级地址也会删除'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.deleteLOwLevel(ids).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.goDeatils(this.countryName, this.countryId)
          } else {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 新增二三级国家
    addLowLevelCountry() {
      dialog({ type: 'superiorAddEdit', state: 'add', countryId: this.countryId }, () => {
        this.goDeatils(this.countryName, this.countryId)
      })
    },
    // 编辑二三级国家
    editLowLevelCountry(id) {
      dialog({ type: 'superiorAddEdit', id: id, state: 'edit' }, () => {
        this.goDeatils(this.countryName, this.countryId)
      })
    }
  }
}
</script>
<style lang="scss">
.country-configuare-container {
  .tips-sty {
    font-size: 13px;
    background-color: #d1d0d0;
    line-height: 40px;
    padding-left: 10px;
  }
  .swtich-sty {
    margin-left: 10px;
    margin-right: 20px;
  }
  .btn-margin {
    margin-bottom: 5px;
  }
  .batch-sty {
    margin-left: 60px;
  }
  .top-right {
    display: inline-block;
    float: right;
  }
}
</style>
