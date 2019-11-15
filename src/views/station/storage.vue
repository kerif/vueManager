<template>
    <div class="storage-container">
      <el-row>
      <el-form ref="user" :model="user" label-width="140px" label-position="left">
         <el-col :lg="12">
           <!-- 客户id -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="客户ID">
                <el-input v-model="user.user_id" placeholder="请输入客户ID" :disabled="!!this.$route.params.id"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 快递单号 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*快递单号">
                <el-input v-model="user.express_num" placeholder="请输入快递单号" :disabled="!!this.$route.params.id"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 重量 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*重量">
                <el-input v-model="user.package_weight" placeholder="请输入重量">
                <template slot="append">{{this.localization.weight_unit}}</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 尺寸 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*尺寸">
                <el-input v-model="user.length"  class="sizeLength" :placeholder="'长' + this.localization.length_unit"></el-input>
                <el-input v-model="user.width" class="sizeLength" :placeholder="'宽' + this.localization.length_unit"></el-input>
                <el-input v-model="user.height"  class="sizeLength" :placeholder="'高' + this.localization.length_unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      <el-col :lg="12">
          <!-- 货位 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="货位">
                <el-input v-model="user.location" placeholder="请输入货位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 备注 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="备注">
                <el-input v-model="user.remark" placeholder="请输入备注"
                type="textarea"  :autosize="{ minRows: 1, maxRows: 2}"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 更新 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item class="updateChe">
                <el-checkbox-group v-model="user.props">
                  <el-checkbox v-for="item in updateProp" :key="item.id" :label="item.id">{{item.cn_name}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 联系电话 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item class="saveBtn updateChe">
                <!-- 保存 -->
                <el-button @click="submitStorage" :loading="$store.state.btnLoading">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
    </el-form>
      </el-row>
      <el-table
        :data="tableData"
        border
        v-loading="tableLoading"
        class="data-list"
        style="width: 100%">
        <!-- 时间 -->
        <el-table-column
        prop="created_at"
        label="时间">
        </el-table-column>
        <!-- 快递单号 -->
        <el-table-column
        prop="express_num"
        label="快递单号">
        </el-table-column>
        <!-- 重量 -->
        <el-table-column
        prop="package_weight"
        :label="'重量' + this.localization.weight_unit">
        </el-table-column>
        <!-- 长 -->
        <el-table-column
        :label="'长' + this.localization.length_unit"
        prop="length">
        </el-table-column>
        <!-- 宽 -->
        <el-table-column
        prop="width"
        :label="'宽' + this.localization.length_unit">
        </el-table-column>
        <!-- 高 -->
        <el-table-column
        prop="height"
        :label="'高' + this.localization.length_unit">
        </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  mixins: [pagination],
  components: {
    NlePagination
  },
  data () {
    return {
      user: {
        express_num: '',
        user_id: '',
        package_weight: '',
        props: [],
        length: '',
        width: '',
        height: '',
        remark: '',
        location: ''
      },
      updateProp: [], // checkbox数据
      tableData: [], // 表格数据
      tableLoading: false,
      localization: {}
    }
  },
  created () {
    this.getProp() // 获取多选框数据
    if (this.$route.params.id) {
      console.log(this.$route.params.props, 'this.$route.params.props')
      this.getWarehouseInfo() // 从订单跳转过来时加载的表格数据
      this.user.express_num = this.$route.params.express_num
      this.user.user_id = this.$route.params.user_id
      this.user.props = this.$route.params.props.map(item => item.id)
      console.log(this.user.props)
    } else {
      this.getList() // 直接添加时加载的表格数据
    }
  },
  methods: {
    // 获取多选框
    getProp () {
      this.$request.getProps().then(res => {
        this.updateProp = res.data
        this.localization = res.localization
      })
    },
    // 从订单跳转到入库时加载的表格数据
    getWarehouseInfo () {
      this.tableLoading = true
      this.$request.getWarehouseList({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.tableData = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 直接添加时加载的表格数据
    getList () {
      this.tableLoading = true
      if (this.$route.params.id) {
        this.getWarehouseInfo()
      } else {
        this.$request.getStorageList({
          page: this.page_params.page,
          size: this.page_params.size
        }).then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    // 保存
    submitStorage () {
      if (this.user.express_num === '') {
        this.$message.error('请输入快递单号')
      } else if (this.user.package_weight === '') {
        this.$message.error('请输入重量')
      } else if (this.user.length === '') {
        this.$message.error('请输入长度')
      } else if (this.user.width === '') {
        this.$message.error('请输入长度')
      } else if (this.user.height === '') {
        this.$message.error('请输入高度')
      } else if (!this.user.props.length) {
        this.$message.error('请选择属性')
      } else {
        if (this.$route.params.id) { // 如果是从订单跳转过来
          this.tableLoading = true
          this.$request.submitPackage(this.$route.params.id, this.user).then(res => {
            this.tableLoading = false
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: res.msg
              })
              this.getWarehouseInfo()
              this.user.length = this.user.width = this.user.height = this.user.package_weight = ''
              this.user.user_id = ''
              this.user.express_num = this.user.remark = ''
              this.user.props = []
              this.user.location = ''
            } else {
              this.$message({
                title: '操作失败',
                message: res.msg,
                type: 'warning'
              })
            }
          })
        } else { // 如果是添加
          this.tableLoading = true
          this.$request.getExpress(this.user).then(res => {
            this.tableLoading = false
            if (res.ret === 1) {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: res.msg
              })
              this.getList()
              this.user.length = this.user.width = this.user.height = this.user.package_weight = ''
              this.user.user_id = ''
              this.user.express_num = this.user.remark = ''
              this.user.props = []
              this.user.location = ''
            } else if (res.ret === 2) {
              this.$confirm('快递单号不存在或客户未预报，请确认是否入库', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$request.addShipment(this.user).then(res => {
                  if (res.ret) {
                    this.$notify({
                      title: '操作成功',
                      message: res.msg,
                      type: 'success'
                    })
                    this.getList()
                    this.user.length = this.user.width = this.user.height = this.user.package_weight = ''
                    this.user.user_id = ''
                    this.user.express_num = this.user.remark = ''
                    this.user.props = []
                    this.user.location = ''
                  } else {
                    this.$notify({
                      title: '操作失败',
                      message: res.msg,
                      type: 'warning'
                    })
                  }
                })
              })
            } else {
              this.$notify({
                title: '操作失败',
                message: res.msg,
                type: 'warning'
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.storage-container {
  .sizeLength {
    width: 33% !important;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .saveBtn {
    .el-button {
      background-color: #3540A5;
      color: #fff;
      padding: 15px 35px;
    }
  }
}
</style>
