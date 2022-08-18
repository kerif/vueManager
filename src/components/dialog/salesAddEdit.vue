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
          <el-form-item :label="$t('优先级')">
            <el-input v-model="ruleForm.index"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('适用对象')">
        <el-radio-group v-model="ruleForm.scope">
          <el-radio :label="0">{{ $t('所有用户') }}</el-radio>
          <el-radio :label="1">{{ $t('部分用户') }}</el-radio>
        </el-radio-group>
        <div class="box" v-if="ruleForm.scope === 1">
          <div class="box-one">
            <div class="box-one-top">
              <div>{{ $t('用户组') }}</div>
              <div>{{ ruleForm.group_ids.length }}</div>
            </div>
            <div class="box-one-bottom">
              <el-checkbox-group v-model="ruleForm.group_ids">
                <el-checkbox v-for="item in modeList" :key="item.id" :label="item.id">{{
                  item.name
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-two">
            <div class="box-two-left">
              <div>{{ $t('特定等级组') }}</div>
              <div>{{ ruleForm.level_ids.length }}</div>
            </div>
            <div class="box-two-bottom">
              <el-checkbox-group v-model="ruleForm.level_ids">
                <el-checkbox v-for="item in vipList" :key="item.id" :label="item.id">{{
                  item.name
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-two">
            <div class="box-two-left">
              <div>{{ $t('客户标签组') }}</div>
              <div>{{ ruleForm.tag_ids.length }}</div>
            </div>
            <div class="box-two-bottom">
              <el-checkbox-group v-model="ruleForm.tag_ids">
                <el-checkbox v-for="item in labelList" :key="item.id" :label="item.id">{{
                  item.name
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-three">
            <div class="box-three-top">
              <div>{{ $t('特定客户') }}</div>
              <div>{{ customerList.length }}</div>
            </div>
            <div style="padding: 10px">
              <el-autocomplete
                v-model="selectUserId"
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
            <div style="padding: 10px; height: 300px; overflow: auto">
              <div
                class="customer-item"
                style="margin: 10px"
                v-for="(item, index) in customerList"
                :key="index"
              >
                {{ item.id }}---{{ item.name }}
                <i
                  class="el-icon-delete"
                  style="color: red; cursor: pointer"
                  @click="delCustomer(index)"
                ></i>
              </div>
            </div>
          </div>
        </div>
        <!-- <el-radio-group v-model="ruleForm.scope" @change="selectMode">
          <el-radio :label="0">{{ $t('所有用户') }}</el-radio>
          <el-radio :label="1">{{ $t('特定用户组') }}</el-radio>
          <el-radio :label="2">{{ $t('特定会员等级') }}</el-radio>
          <el-radio :label="3">{{ $t('特定用户') }}</el-radio>
        </el-radio-group> -->
        <!-- <el-checkbox-group
          v-model="ruleForm.ids"
          v-if="ruleForm.scope === 1 || ruleForm.scope === 2"
          class="checked-list"
        >
          <el-checkbox v-for="item in modeList" :key="item.id" :label="item.id"
            >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group> -->
        <!-- <div v-if="ruleForm.scope === 3">
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
            <div class="customer-item" v-for="(item, index) in customerList" :key="index">
              {{ item.id }}---{{ item.name }}
              <i
                class="el-icon-delete"
                style="color: red; cursor: pointer"
                @click="delCustomer(index)"
              ></i>
            </div>
          </div>
        </div> -->
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
        scope: 0,
        express_line_ids: [],
        discount: '',
        discount_type: '',
        group_ids: [],
        level_ids: [],
        tag_ids: []
      },
      options: [],
      props: { multiple: true, checkStrictly: false },
      id: '',
      areaData: null,
      modeList: [],
      customerList: [],
      selectUser: '',
      selectUserId: '',
      labelList: [],
      vipList: [],
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
  computed: {
    sum() {
      let sum1 = 0,
        sum2 = 0,
        sum3 = 0,
        sum4 = 0
      this.modeList.forEach(item => {
        this.ruleForm.group_ids.forEach(ele => {
          if (item.id === ele) {
            sum1 += Number(item.users_count)
          }
        })
      })
      this.vipList.forEach(item => {
        this.ruleForm.level_ids.forEach(ele => {
          if (item.id === ele) {
            sum2 += Number(item.users_count)
          }
        })
      })
      this.labelList.forEach(item => {
        this.ruleForm.tag_ids.forEach(ele => {
          if (item.id === ele) {
            sum3 += Number(item.users_count)
          }
        })
      })
      sum4 = this.customerList.length
      return sum1 + sum2 + sum3 + sum4
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
          // this.selectMode(res.data.scope)
          // if (res.data.scope === 1) {
          //   this.ruleForm.ids = res.data.user_groups.map(item => item.id)
          // } else if (res.data.scope === 2) {
          //   this.ruleForm.ids = res.data.member_levels.map(item => item.id)
          // } else if (res.data.scope === 3) {
          //   this.customerList = res.data.users
          //   this.ruleForm.ids = this.customerList.map(item => item.id)
          // }
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
          console.log(this.options)
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
      // this.ruleForm.ids = []
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
    handleSelect(item) {
      if (this.customerList.map(item => item.id).includes(item.id)) {
        return false
      }
      this.customerList.push(item)
      // this.ruleForm.ids = this.customerList.map(item => item.id)
    },
    delCustomer(index) {
      this.customerList.splice(index, 1)
      // this.ruleForm.ids = this.customerList.map(item => item.id)
    },
    confirm() {
      this.ruleForm.effect_at = this.time[0]
      this.ruleForm.expire_at = this.time[1]
      this.ruleForm.express_line_ids = this.ruleForm.express_line_ids.map(item => item[1])
      let user_ids = this.customerList.map(item => item.id)
      if (this.id) {
        this.$confirm(this.$t(`您当前已选${this.sum}位客户，是否确认全部投放`), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$request.updateSales(this.id, { ...this.ruleForm, user_ids }).then(res => {
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
        })
      } else {
        this.$confirm(this.$t(`您当前已选${this.sum}位客户，是否确认全部投放`), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$request.addSales({ ...this.ruleForm, user_ids }).then(res => {
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
        })
      }
    },
    init() {
      this.getLine()
      this.getGroupList()
    },
    getGroupList() {
      this.$request.userRelation().then(res => {
        if (res.ret) {
          this.modeList = res.data.groups
          this.vipList = res.data.levels
          this.labelList = res.data.tags
        }
      })
    },
    clear() {
      this.selectUser = ''
      this.customerList = []
      this.id = ''
      this.ruleForm.name = ''
      this.ruleForm.index = ''
      this.ruleForm.scope = 0
      // this.ruleForm.ids = []
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
  .box {
    display: flex;
    margin: 20px 0;
    text-align: left;
    .box-one {
      width: 200px;
      border: 1px solid #eee;
      border-radius: 6px;
      .box-one-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: #eee;
        border-bottom: 1px solid #eee;
      }
      .box-one-bottom {
        padding: 10px;
        height: 300px;
        overflow: auto;
        .el-checkbox {
          margin: 10px 0;
          display: block;
        }
      }
    }
    .box-two {
      width: 200px;
      border: 1px solid #eee;
      border-radius: 6px;
      margin-left: 20px;
      .box-two-left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: #eee;
        border-bottom: 1px solid #eee;
      }
      .box-two-bottom {
        padding: 10px;
        height: 300px;
        overflow: auto;
        .el-checkbox {
          margin: 10px 0;
          display: block;
        }
      }
    }
    .box-three {
      width: 240px;
      border: 1px solid #eee;
      border-radius: 6px;
      margin-left: 20px;
      .box-three-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: #eee;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>
