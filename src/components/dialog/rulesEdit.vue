<template>
  <el-dialog
    :visible.sync="show"
    :title="
      name === 1
        ? $t('编辑会员编号规则')
        : name === 2
        ? $t('编辑订单编号规则')
        : name === 3
        ? $t('编辑订单分箱号规则')
        : name === 4
        ? $t('编辑拼团订单编号规则')
        : $t('编辑发货单编号规则')
    "
    class="dialog-edit-rules"
    @close="clear"
    width="60%"
  >
    <el-form ref="form" :model="userRules" label-width="140px" v-if="this.name === 1">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('*前缀字符')">
            <el-input v-model="userRules.prefix" :placeholder="$t('最多输入5个字符')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('*单号长度')">
            <el-select v-model="userRules.length" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in lengthOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('*数字进制')">
            <el-select v-model="userRules.system" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in systemOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="userRules.for_new_user">{{ $t('只对新用户生效') }}</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-if="this.name === 2" ref="ref" :model="orderRules" label-width="140px">
      <el-form-item :label="$t('系统前缀')">
        <el-input v-model="orderRules.prefix" :placeholder="$t('最多输入5个字符')"></el-input>
      </el-form-item>
      <el-table :data="orderRules.tableData" border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <!-- 客户ID -->
        <el-table-column prop="name" :label="$t('仓库名称')"> </el-table-column>
        <!-- 客户昵称 -->
        <el-table-column :label="$t('代码')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.code"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-form ref="form" :model="boxRules" label-width="140px" v-if="this.name === 3">
      <!-- 连接符 -->
      <el-form-item :label="$t('连接符')">
        <el-select v-model="boxRules.connector" :placeholder="$t('请选择')">
          <el-option
            v-for="item in connectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 分箱号 -->
      <el-form-item :label="$t('分箱号')">
        <el-select v-model="boxRules.boxNum" :placeholder="$t('请选择')">
          <el-option
            v-for="item in boxNumOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :model="groupRules" label-width="140px" v-if="this.name === 4">
      <!-- 拼团订单后缀 -->
      <el-form-item :label="$t('拼团订单后缀')">
        <el-input
          v-model="groupRules.suffix"
          class="input-sty"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <!-- 连接符 -->
      <el-form-item :label="$t('连接符')">
        <el-select v-model="groupRules.connector" :placeholder="$t('请选择')">
          <el-option
            v-for="item in connectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 子订单号-->
      <el-form-item :label="$t('子订单号')">
        <el-select v-model="groupRules.subOrederNum" :placeholder="$t('请选择')">
          <el-option v-for="item in subOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 发货单前缀-->
    <el-form :model="invoiceRules" label-width="140px" v-if="this.name === 5">
      <el-form-item :label="$t('发货单前缀')">
        <el-input
          v-model="invoiceRules.prefix"
          class="input-sty"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      userRules: {
        prefix: '',
        length: '',
        system: '',
        for_new_user: ''
      },
      systemOptions: [
        {
          id: 10,
          name: this.$t('10进制')
        },
        {
          id: 16,
          name: this.$t('16进制')
        }
      ],
      lengthOptions: [
        {
          id: 4,
          name: 4
        },
        {
          id: 5,
          name: 5
        },
        {
          id: 6,
          name: 6
        },
        {
          id: 7,
          name: 7
        },
        {
          id: 8,
          name: 8
        },
        {
          id: 9,
          name: 9
        },
        {
          id: 10,
          name: 10
        }
      ],
      orderRules: {
        prefix: '',
        tableData: []
      },
      name: '',
      warehouseName: '',
      id: '',
      options: [],
      value: '',
      connectOptions: [
        {
          id: '1',
          name: '无'
        },
        {
          id: '2',
          name: '-'
        },
        {
          id: '3',
          name: '/'
        },
        {
          id: '4',
          name: '()'
        },
        {
          id: '5',
          name: '_'
        }
      ],
      boxNumOptions: [
        {
          id: 1,
          name: '数字(1,2,3,4,5......)'
        },
        {
          id: 2,
          name: '小写字母(a,b,c,d,e......)'
        },
        {
          id: 3,
          name: '大写字母(A,B,C,D,E......)'
        }
      ],
      subOptions: [
        {
          id: 1,
          name: '数字(1,2,3,4,5......)'
        },
        {
          id: 2,
          name: '小写字母(a,b,c,d,e......)'
        },
        {
          id: 3,
          name: '大写字母(A,B,C,D,E......)'
        },
        {
          id: 4,
          name: '客户ID'
        }
      ],
      boxRules: {
        boxNum: 1,
        connector: '2'
      },
      groupRules: {
        suffix: 'G',
        connector: '2',
        subOrederNum: 1
      },
      invoiceRules: {
        prefix: 'SH'
      }
    }
  },
  mixins: [pagination],
  methods: {
    // 获取列表数据
    getList() {
      this.$request.getRulesDetails(this.id).then(res => {
        if (res.ret) {
          if (this.name === 1) {
            this.userRules.prefix = res.data.prefix
            this.userRules.length = res.data.length
            this.userRules.system = res.data.system
            this.userRules.for_new_user = Boolean(res.data.for_new_user)
          } else if (this.name === 2) {
            this.orderRules.prefix = res.data.prefix
            this.orderRules.tableData = res.data.warehouse_prefix
          } else if (this.name === 3) {
            this.boxRules.connector = res.data.link
            this.boxRules.boxNum = res.data.sn
          } else if (this.name === 4) {
            this.groupRules.connector = res.data.link
            this.groupRules.subOrederNum = res.data.sn
            this.groupRules.suffix = res.data.suffix
          } else {
            this.invoiceRules.prefix = res.data.prefix
          }
        }
      })
    },
    confirm() {
      if (this.name === 1) {
        if (!this.userRules.prefix) {
          return this.$message.error(this.$t('请输入前缀字符'))
        } else if (!this.userRules.length) {
          return this.$message.error(this.$t('请选择单号长度'))
        } else if (!this.userRules.system) {
          return this.$message.error(this.$t('请选择数字进制'))
        }
        this.$request
          .updateRules(this.id, {
            ...this.userRules,
            for_new_user: Number(this.userRules.for_new_user)
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            this.show = false
          })
      } else if (this.name === 2) {
        console.log(this.orderRules, 'orderRules')
        this.$request
          .updateRules(this.id, {
            prefix: this.orderRules.prefix,
            warehouse_prefix: this.orderRules.tableData
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      } else if (this.name === 3) {
        this.$request
          .updateRules(this.id, {
            link: this.boxRules.connector,
            sn: this.boxRules.boxNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      } else if (this.name === 4) {
        this.$request
          .updateRules(this.id, {
            suffix: this.groupRules.suffix,
            link: this.groupRules.connector,
            sn: this.groupRules.subOrederNum,
            for_new_user: Number(this.userRules.for_new_user)
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      } else {
        this.$request
          .updateRules(this.id, {
            prefix: this.invoiceRules.prefix
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      }
    },
    init() {
      this.getList()
      console.log(this.id, 'id')
      console.log(this.name, 'name')
    },
    clear() {
      this.userRules.prefix = ''
      this.userRules.length = ''
      this.userRules.system = ''
      this.userRules.for_new_user = ''
      this.invoiceRules.prefix = ''
      this.groupRules.connector = ''
      this.boxRules.connector = ''
      this.boxRules.boxNum = ''
      this.groupRules.subOrederNum = ''
      this.groupRules.suffix = ''
    }
  }
}
</script>
<style lang="scss">
.dialog-edit-rules {
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
  .input-sty {
    width: 40% !important;
  }
  .tips {
    margin-bottom: 30px;
    background-color: #fff2f1;
    border: 1px solid #ffc2c0;
    line-height: 30px;
    padding-left: 20px;
  }
  .unit {
    // display: inline-block;
    margin-bottom: 20px;
    margin-left: 70px;
  }
  .right-unit {
    width: 25% !important;
  }
  .bottom-btn {
    margin-left: 70px;
    margin-bottom: 20px;
  }
  .input-sty {
    width: 40% !important;
  }
  .el-select {
    width: 40% !important;
  }
}
</style>
