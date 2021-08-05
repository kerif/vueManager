<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    width="50%"
    @close="clearn"
    class="dialog-container"
  >
    <el-form :model="discountForm" label-width="100px" label-position="top">
      <el-form-item :label="$t('选择产品')">
        <el-select v-model="product" value-key="id">
          <el-option
            v-for="item in proList"
            :key="item.id"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('优惠价格') + `(${$t('原价')}: ${product.price ? product.price : ''})`"
      >
        <el-input v-model="discountForm.price" style="width: 207px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('有效时间')">
        <el-date-picker
          v-model="time"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('适用方式')">
        <el-radio-group v-model="discountForm.applicable_mode" @change="selectMode">
          <el-radio v-for="item in applicableModeList" :key="item.id" :label="item.id">{{
            item.name
          }}</el-radio>
        </el-radio-group>
        <el-checkbox-group
          v-model="discountForm.applicable_mode_ids"
          v-if="discountForm.applicable_mode === 1 || discountForm.applicable_mode === 2"
          class="checked-list"
        >
          <el-checkbox v-for="item in modeList" :key="item.id" :label="item.id">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
        <div v-if="discountForm.applicable_mode === 3">
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
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      type: '',
      priceId: '',
      discountForm: {
        base_price_id: '',
        price: '',
        base_price: '',
        start_time: '',
        end_time: '',
        applicable_mode: 0,
        applicable_mode_ids: []
      },
      time: [],
      proList: [],
      product: '',
      applicableModeList: [],
      modeList: [],
      customerId: '',
      customerList: [],
      selectUser: '',
      title: ''
    }
  },
  methods: {
    // 获取初始化信息
    getDiscount() {
      this.$request.getDiscount().then(res => {
        if (res.ret) {
          this.applicableModeList = res.data.applicable_mode_list
          if (this.type === 'editDiscountTable') {
            this.getDiscountDetails(this.priceId)
          }
        }
      })
    },
    // 获取基础价格表(会员组)
    getBaseTable() {
      this.$request.getBaseTable({ size: 100 }).then(res => {
        if (res.ret) {
          this.proList = res.data.map(item => {
            let name = item.name
            let id = item.id
            let price = item.price
            return {
              name,
              price,
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
    // 获取详情
    getDiscountDetails(id) {
      this.$request.getDiscountDetails(id).then(res => {
        if (res.ret) {
          this.product = this.proList.filter(item => item.id === +res.data.base_price_id)[0]
          this.discountForm.price = res.data.price
          this.discountForm.applicable_mode = res.data.applicable_mode
          this.time = [res.data.start_time, res.data.end_time]
          this.selectMode(this.discountForm.applicable_mode)
          this.discountForm.applicable_mode_ids = res.data.applicable_mode_list.map(item => item.id)
          if (this.discountForm.applicable_mode === 3) {
            this.customerList = res.data.applicable_mode_list
          }
        }
      })
    },
    // 选择适用方式
    selectMode(val) {
      this.discountForm.applicable_mode_ids = []
      if (val === 1) {
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
      } else if (val === 2) {
        this.getGradeList()
      }
    },
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
    },
    async submit() {
      let res = {}
      let params = { ...this.discountForm }
      params.start_time = this.time[0]
      params.end_time = this.time[1]
      params.base_price_id = this.product.id
      params.base_price = this.product.price
      if (this.discountForm.applicable_mode === 3) {
        params.applicable_mode_ids = this.customerList.map(item => item.id)
      }
      if (this.discountForm.applicable_mode === 0) {
        params.applicable_mode_ids = ['']
        console.log(params, 'params')
      }
      if (this.type === 'addDiscountTable') {
        res = await this.$request.addDiscountTable({ ...params })
      } else if (this.type === 'editDiscountTable') {
        res = await this.$request.editDiscountTable(this.priceId, { ...params })
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
    clearn() {
      this.product = ''
      this.discountForm.price = ''
      this.discountForm.base_price = ''
      this.discountForm.start_time = ''
      this.discountForm.end_time = ''
      this.discountForm.applicable_mode = 0
      this.discountForm.applicable_mode_ids = []
      this.time = []
    },
    init() {
      if (this.type === 'editDiscountTable') {
        this.title = this.$t('编辑优惠价格')
      } else {
        this.title = this.$t('新增优惠价格')
      }
      this.getDiscount()
      this.getBaseTable()
    }
  }
}
</script>
<style scoped lang="scss">
.customer {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.search {
  padding-top: 10px;
}
.checked-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px 20px;
  margin-top: 10px;
  border: 1px solid #ccc;
}
</style>
