<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('新增价格表') : $t('编辑价格表')"
    class="dialog-sales-add-edit"
    @close="clear"
    width="65%"
  >
    <el-form ref="form" label-position="top" :model="ruleForm" class="commission-top">
      <el-row>
        <el-col :span="10">
          <el-form-item :label="$t('价格表名称')">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-form-item :label="$t('排序')">
            <el-input v-model="ruleForm.index"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('适用对象')">
        <el-radio-group v-model="ruleForm.scope" @change="selectMode">
          <el-radio :label="0">{{ $t('所有用户') }}</el-radio>
          <el-radio :label="1">{{ $t('特定用户组') }}</el-radio>
          <el-radio :label="2">{{ $t('特定会员等级') }}</el-radio>
          <el-radio :label="3">{{ $t('特定用户') }}</el-radio>
        </el-radio-group>
        <el-checkbox-group
          v-model="ruleForm.ids"
          v-if="ruleForm.scope === 1 || ruleForm.scope === 2"
          class="checked-list"
        >
          <el-checkbox v-for="item in modeList" :key="item.id" :label="item.id"
            >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
        <div v-if="ruleForm.scope === 3">
          <div class="search">
            <el-autocomplete
              class="inline-input"
              v-model="selectUser"
              :fetch-suggestions="querySearchUser"
              value-key="name"
              clearable
              :placeholder="$t('请输入客户ID')"
              @select="handleSelect"
              style="width: 200px"
            >
              <template #default="{ item }">
                <div class="name">{{ item.id }}---{{ item.name }}</div>
              </template>
            </el-autocomplete>
          </div>
          <div class="customer checked-list">
            <div class="customer-item" v-for="item in customerList" :key="item.id">
              {{ item.id }}---{{ item.name }}
              <i
                class="el-icon-delete"
                style="color: red; cursor: pointer"
                @click="delCustomer(index, item.id)"
              ></i>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('适用渠道（可多选）')">
        <el-cascader
          v-model="ruleForm.express_line_ids"
          :options="options"
          :props="props"
          collapse-tags
          clearable
        ></el-cascader>
      </el-form-item>
      <div>{{ $t('设置价格') }}</div>
      <div class="value-sty">
        <el-form-item>
          {{ $t('折扣力度（例：打九折则输入0.9）') }}
          <el-input v-model="ruleForm.discount" style="width: 217px"></el-input>
        </el-form-item>
        <el-form-item>
          {{ $t('折扣计算方式') }}
          <el-select
            v-model="ruleForm.discount_type"
            :placeholder="$t('请选择')"
            style="margin-left: 10px"
          >
            <el-option
              v-for="item in discountData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item :label="$t('有效时间')">
        <el-date-picker
          v-model="time"
          value-format="yyyy-MM-dd HH:mm"
          format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      state: '',
      ruleForm: {
        name: '',
        index: '',
        scope: -1,
        ids: [],
        express_line_ids: [],
        discount: '',
        discount_type: ''
      },
      options: [],
      props: { multiple: true, checkStrictly: false },
      id: '',
      areaData: null,
      modeList: [],
      customerList: [],
      selectUser: '',
      time: [],
      discountData: [
        {
          id: 1,
          name: this.$t('折扣后单价')
        },
        {
          id: 2,
          name: this.$t('折扣后总价')
        }
      ],
      arr: []
    }
  },
  methods: {
    // 获取详情
    getList() {
      this.$request.getSalesDetails(this.id).then(res => {
        let arr = []
        if (res.ret) {
          this.ruleForm.name = res.data.name
          this.ruleForm.index = res.data.index
          this.ruleForm.scope = res.data.scope
          this.ruleForm.discount = res.data.discount
          this.ruleForm.discount_type = res.data.discount_type
          this.time = [res.data.effect_at, res.data.expire_at]
          res.data.express_line_ids.forEach(item => {
            this.arr.forEach(ele => {
              if (ele[1] === item) {
                arr.push(ele)
              }
            })
          })
          this.ruleForm.express_line_ids = arr
          this.selectMode(res.data.scope)
          if (res.data.scope === 1) {
            this.ruleForm.ids = res.data.user_groups.map(item => item.id)
          } else if (res.data.scope === 2) {
            this.ruleForm.ids = res.data.member_levels.map(item => item.id)
          } else if (res.data.scope === 3) {
            this.customerList = res.data.users
            this.ruleForm.ids = this.customerList.map(item => item.id)
          }
        }
      })
    },
    // 获取渠道
    getLine() {
      this.$request.groupWith().then(res => {
        if (res.ret) {
          let subArr = []
          res.data.forEach(item => {
            item.express_lines.forEach(ele => {
              subArr = [item.id, ele.id]
              this.arr.push(subArr)
            })
          })
          this.options = res.data.map(item => {
            return {
              value: item.id,
              label: item.name,
              children:
                item.express_lines < 1
                  ? undefined
                  : item.express_lines.map(item => {
                      return {
                        value: item.id,
                        label: item.name
                      }
                    })
            }
          })
        }
        if (this.id) {
          this.getList()
        }
      })
    },
    //获取会员组
    getGradeList() {
      this.$request.getGradeList({ size: 100 }).then(res => {
        if (res.ret) {
          this.modeList = res.data.map(item => {
            let name = item.name
            let id = item.id
            return {
              name,
              id
            }
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //获取客户组
    getUserGroup() {
      this.$request.getUserGroup({ size: 100 }).then(res => {
        if (res.ret) {
          this.modeList = res.data.map(item => {
            let name = item.name_cn
            let id = item.id
            return {
              name,
              id
            }
          })
        }
      })
    },
    // 选择适用方式
    selectMode(val) {
      this.ruleForm.ids = []
      if (val === 1) {
        this.getUserGroup()
      } else if (val === 2) {
        this.getGradeList()
      }
    },
    // 选择客户
    querySearchUser(keyword, cb) {
      this.$request
        .getUsers({ keyword })
        .then(res => {
          if (res.ret) {
            cb(res.data)
          } else {
            cb([])
          }
        })
        .catch(() => cb([]))
    },
    delCustomer(index, id) {
      console.log(index, id)
      this.customerList.splice(index, 1)
      // for (let i = 0; i < this.customerList.length; i++) {
      //   if (this.customerList[i].id === id) {
      //     this.customerList.splice(i, 1)
      //   }
      // }
    },
    handleSelect(item) {
      if (this.customerList.map(item => item.id).includes(item.id)) {
        return false
      }
      this.customerList.push(item)
      this.ruleForm.ids = this.customerList.map(item => item.id)
    },
    async confirm() {
      this.ruleForm.express_line_ids = this.ruleForm.express_line_ids.map(item => item[1])
      this.ruleForm.effect_at = this.time[0]
      this.ruleForm.expire_at = this.time[1]
      let res = {}
      if (this.id) {
        res = await this.$request.updateSales(this.id, { ...this.ruleForm })
      } else {
        res = await this.$request.addSales({ ...this.ruleForm })
      }
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
    },
    init() {
      this.getLine()
    },
    clear() {
      this.selectUser = ''
      this.customerList = []
      this.id = ''
      this.ruleForm.name = ''
      this.ruleForm.index = ''
      this.ruleForm.scope = -1
      this.ruleForm.ids = []
      this.ruleForm.express_line_ids = []
      this.ruleForm.discount = ''
      this.ruleForm.discount_type = ''
      this.time = []
      this.modeList = []
    }
  }
}
</script>
<style lang="scss">
.dialog-sales-add-edit {
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .value-sty {
    margin: 10px 0;
    padding: 30px;
    background-color: #f0f0f0;
  }
  .checked-list {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(4, 1fr);
    padding: 10px 20px;
    margin-top: 10px;
    border: 1px solid #ccc;
  }
}
</style>
