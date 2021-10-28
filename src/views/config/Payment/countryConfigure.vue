<template>
  <div class="country-configuare-container">
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="select-box">
          <el-button @click="regionalMana">{{ $t('地域通知管理') }}</el-button>
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
            <!-- <el-upload
              class="upload-demo"
              action=""
              :limit="1"
              :on-remove="onFileRemove"
              :file-list="fileList"
              :on-exceed="handleExceed"
              :before-upload="beforeUploadImg"
              :http-request="uploadBaleImg"
            >
              <el-button class="btn-light-red">{{ $t('批量导入') }}</el-button>
            </el-upload> -->
            <el-button class="btn-light-red" @click="batchDelete">{{ $t('批量删除') }}</el-button>
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
    <el-dialog :title="$t('地域通知管理')" :visible.sync="outerVisible">
      <div style="margin-bottom: 20px; overflow: hidden">
        <el-col :span="21">
          <div class="tips-main">
            <i class="el-icon-warning code-sty"></i>
            {{ $t('添加通知信息后，客户在下单选择该地区的地址时，会弹出对应提示') }}
          </div>
        </el-col>
        <el-col :span="3">
          <el-button class="btn-blue" @click="addRegional">{{ $t('添加') }}</el-button>
        </el-col>
      </div>
      <el-table :data="regionalData" stripe border class="data-list" v-loading="tableLoading">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column :label="$t('区域')" :show-overflow-tooltip="true" width="350">
          <template slot-scope="scope">
            <span v-for="item in scope.row.areas" :key="item.id">
              {{ item.country_name }}&nbsp;{{ item.parent_name }}&nbsp;{{ item.name }}&nbsp;
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button @click="editRegional(scope.row.id)" class="btn-dark-green">{{
              $t('编辑')
            }}</el-button>
            <el-button @click="deleteRegional(scope.row.id)" class="btn-light-red">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
      <el-dialog
        class="innnerClass"
        width="45%"
        :title="state === 'add' ? $t('新增') : $t('编辑')"
        :visible.sync="innerVisible"
        append-to-body
        @close="clearAres"
      >
        <el-form :model="form" ref="form" label-width="100px">
          <el-form-item :label="$t('选择区域')">
            <el-cascader
              @change="chooseAres"
              v-model="form.area_ids"
              :options="options"
              :props="props"
              collapse-tags
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('提示内容')">
            <el-input v-model="form.content" class="input-sty"></el-input>
          </el-form-item>
          <el-form-item v-for="item in stringData" :key="item.id" :label="item.name">
            <el-input
              v-model="item.value"
              type="textarea"
              class="input-sty"
              :rows="2"
              :placeholder="$t('请输入内容')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="cancelNew">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="newCountry">{{ $t('确定') }}</el-button>
        </div>
      </el-dialog>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="innerVisible = true">{{ $t('确定') }}</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
import Sortable from 'sortablejs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    AddBtn,
    NlePagination
  },
  mixins: [pagination],
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
      countryName: '',
      outerVisible: false,
      innerVisible: false,
      regionalData: [],
      props: { multiple: true, emitPath: false },
      options: [],
      stringData: [],
      areasDisabled: false,
      form: {
        area_ids: [],
        content: '',
        content_translations: {}
      },
      state: '',
      areasId: '',
      fileList: []
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
    changeCountry(event, enabled, id) {
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
    // 批量导入
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          console.log(res)
          res.data.forEach(item => {
            this.fileList.push({
              name: item.name,
              url: item.path
            })
          })
          console.log(res.data, 'res.data')
          this.urlName = res.data[0].name
          console.log(this.urlName, 'this.urlName')
          this.getList()
        }
      })
    },
    onUpload(file) {
      let params = new FormData()
      params.append(`file`, file)
      return this.$request.uploadFiles(params)
    },
    handleExceed() {
      return this.$message.warning(this.$t('当前限制上传1个文件'))
    },
    // 文件删除
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    // 批量删除
    batchDelete() {
      if (this.deleteNum.length === 0 && this.secondNum.length === 0) {
        return this.$message.error(this.$t('请选择'))
      }
      const idNum = this.secondNum.concat(this.deleteNum)
      this.$confirm(
        this.$t('您是否确认批量删除？如果是批量删除二级地址的话，该分级下所有的三级地址也会删除'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.deleteLOwLevel({ ids: idNum }).then(res => {
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
    },
    // 地域通知管理
    regionalMana() {
      this.outerVisible = true
      this.getList()
    },
    // 获取地域数据
    getList() {
      this.tableLoading = true
      this.$request
        .getRegional({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableLoading = false
            this.regionalData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    // 编辑地域
    editRegional(id) {
      this.areasId = id
      this.state = 'edit'
      this.innerVisible = true
      this.outerVisible = false
      this.getString()
      this.getAllCountries()
      // this.getDetails()
    },
    beforeUploadImg() {},
    // 获取详情
    getDetails() {
      this.$request.getNotifi(this.areasId).then(res => {
        if (res.ret) {
          this.form.area_ids = res.data.areas.map(item => item.id)
          console.log(this.form.area_ids, 'this.form.area_ids')
          this.form.content = res.data.content
          this.stringData = this.stringData.map(item => {
            const value = res.data.content_translations[item.language_code]
            return {
              ...item,
              value
            }
          })
        }
      })
    },
    // 删除地域
    deleteRegional(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteNotifi(id).then(res => {
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
    },
    // 获取全部支持语言
    getString() {
      this.$request.getString().then(res => {
        if (res.ret) {
          this.stringData = res.data.filter(item => item.language_code !== 'zh_CN')
          if (this.state === 'edit') {
            this.getDetails()
          }
        }
      })
    },
    // 添加区域
    addRegional() {
      this.state = 'add'
      this.innerVisible = true
      this.getString()
      this.getAllCountries()
    },
    // 获取多级区域数据
    getAllCountries() {
      this.$request.getCountry().then(res => {
        if (res.ret) {
          console.log(res.data, 'daa')
          this.options = res.data.map(item => {
            return {
              value: item.id,
              label: item.name,
              disabled: !item.areas.length ? true : false,
              children: item.areas.map(item => {
                return {
                  value: item.id,
                  label: item.name,
                  children:
                    item.areas < 1
                      ? undefined
                      : item.areas.map(item => {
                          return {
                            value: item.id,
                            label: item.name
                          }
                        })
                }
              })
            }
          })
        }
      })
    },
    chooseAres() {
      console.log(this.form.area_ids, 'form.area_ids')
    },
    clearAres() {
      this.state = ''
      this.areasId = ''
      this.form.area_ids = []
      this.form.content = ''
      this.stringData = []
      this.form.content_translations = {}
    },
    // 新增区域
    newCountry() {
      let translation = {}
      this.stringData.forEach(item => {
        translation[item.language_code] = item.value
      })
      if (this.state === 'add') {
        this.$request
          .newNotifi({
            area_ids: this.form.area_ids,
            content: this.form.content,
            content_translations: translation
          })
          .then(res => {
            if (res.ret) {
              this.innerVisible = false
              this.outerVisible = true
              this.getList()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else {
        this.$request
          .updateNotifi(this.areasId, {
            area_ids: this.form.area_ids,
            content: this.form.content,
            content_translations: translation
          })
          .then(res => {
            if (res.ret) {
              this.innerVisible = false
              this.outerVisible = true
              this.getList()
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
    // 取消新增
    cancelNew() {
      this.form.area_ids = []
      this.form.content = ''
      this.form.content_translations = {}
      this.innerVisible = false
      this.outerVisible = true
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
  .code-sty {
    padding-left: 5px;
    color: #35b85a;
    font-size: 18px;
  }
  .tips-main {
    display: inline-block;
    background-color: #f5f5f5;
    line-height: 30px;
    padding-right: 20px;
  }
  .upload-demo {
    display: inline-block;
    margin: 0 10px;
  }
}
.innnerClass {
  .input-sty {
    width: 60% !important;
  }
}
</style>
