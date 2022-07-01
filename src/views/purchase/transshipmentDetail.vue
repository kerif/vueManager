<template>
  <div class="transshipment-detail-container">
    <!-- <backTop></backTop> -->
    <div class="title">
      <h4>{{ $t('基本信息') }}</h4>
      <div style="margin-left: 30px">
        <span>{{ $t('状态') }}:</span>
        <span class="status-item">{{ statusName }}</span>
      </div>
    </div>
    <el-form :model="form" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item :label="$t('分货方案号')">
            <div>{{ sn }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('方案备注')">
            <el-input
              v-if="status === 0 || status === 1"
              type="textarea"
              v-model="form.remark"
              :autosize="{ minRows: 3, maxRows: 4 }"
              style="width: 55%"
            ></el-input>
            <div v-else>{{ remark }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item :label="$t('分货方案名称')">
            <el-input
              v-if="status === 0 || status === 1"
              v-model="form.name"
              style="width: 55%"
              :placeholder="$t('请输入')"
            ></el-input>
            <div v-else>{{ name }}</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="record record-item space">
      <h4>{{ $t('上传记录') }}</h4>
      <el-button
        type="primary"
        size="small"
        v-if="status === 0 || status === 1"
        @click="onImport(2)"
        >{{ $t('导入分货方案') }}</el-button
      >
    </div>
    <div v-for="item in records" :key="item.id" class="programme">
      <el-row :gutter="10">
        <el-col :span="7"><i class="el-icon-document"></i>&nbsp;&nbsp;{{ item.name }}</el-col>
        <el-col :span="4" :offset="8">{{ $t('更新于') }}&nbsp;&nbsp;{{ item.updated_at }}</el-col>
        <el-col :span="1" :offset="2"
          ><i
            class="el-icon-download"
            style="font-size: 16px; font-weight: bold"
            @click="onDownloadFile(item.path)"
          ></i
        ></el-col>
        <el-col :span="1" :offset="1">
          <i
            class="el-icon-close"
            style="font-size: 16px; font-weight: bold"
            @click="onDelete(item.id)"
          ></i>
        </el-col>
      </el-row>
    </div>
    <div v-if="status === 0 || status === 1 || status === 2">
      <div class="record record-item space">
        <h4>{{ $t('方案预览') }}</h4>
        <el-button type="primary" size="small" @click="onClear">{{ $t('一键清空') }}</el-button>
      </div>
      <div v-for="(item, index) in goodData" :key="index">
        <el-row :gutter="10" class="review font-bold">
          <el-col :span="5"
            ><div>#{{ item.number }}</div></el-col
          >
          <el-col :span="5" v-if="status === 2">{{ item.sn }}</el-col>
          <el-col :span="5"
            ><div>
              {{ $t('客户') }}: {{ item.user ? item.user.id : '' }} ---
              {{ item.user ? item.user.name : '' }}
            </div></el-col
          >
          <el-col :span="5"
            ><div>{{ $t('收货点') }}: {{ item.station_code }}</div></el-col
          >
        </el-row>
        <el-table :data="item.goods" style="width: 80%" border stripe class="space">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="purchase_order_sn" :label="$t('采购编号')"></el-table-column>
          <el-table-column prop="number" :label="$t('商品编号')"> </el-table-column>
          <el-table-column label="barcode" prop="barcode"></el-table-column>
          <el-table-column prop="cn_name" :label="$t('物品中文名称')"> </el-table-column>
          <el-table-column prop="quantity" :label="$t('分货数量')"> </el-table-column>
          <el-table-column prop="pack_quantity" :label="$t('打包数量')">
            <template slot-scope="scope">
              {{ scope.row.pack_quantity ? scope.row.pack_quantity : 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="picking_quantity" :label="$t('拣货数量')">
            <template slot-scope="scope">
              {{ scope.row.picking_quantity ? scope.row.picking_quantity : 0 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('拣货差异数量')">
            <template slot-scope="scope">
              {{
                Number(scope.row.picking_quantity) - Number(scope.row.quantity)
                  ? Number(scope.row.picking_quantity) - Number(scope.row.quantity)
                  : 0
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('打包差异数量')">
            <template slot-scope="scope">
              {{
                Number(scope.row.pack_quantity) - Number(scope.row.quantity)
                  ? Number(scope.row.pack_quantity) - Number(scope.row.quantity)
                  : 0
              }}
            </template>
          </el-table-column>
          <el-table-column v-if="status === 2" :label="$t('装箱')">
            <template>
              <span v-for="(ele, index) in item.boxes" :key="index">
                #{{ index + 1 }}({{ ele.quantity }})</span
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" width="160">
            <template slot-scope="scope">
              <el-button class="btn-light-red" @click="onDelRow(scope.$index, item.goods)">{{
                $t('删除')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else style="margin-top: 50px">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane name="0" :label="$t('分货方案')"></el-tab-pane>
        <el-tab-pane name="1" :label="$t('出库详情')"></el-tab-pane>
      </el-tabs>
      <div v-for="(item, index) in orders" :key="index">
        <el-row :gutter="10" class="review font-bold">
          <el-col :span="3"
            ><div>#{{ index + 1 }}</div></el-col
          >
          <el-col :span="3">{{ item.sn }}</el-col>
          <el-col :span="5"
            ><div>
              {{ $t('客户') }}: {{ item.user ? item.user.id : '' }} ---
              {{ item.user ? item.user.name : '' }}
            </div></el-col
          >
          <el-col :span="5"
            ><div>{{ $t('收货点') }}: {{ item.station ? item.station.code : '' }}</div></el-col
          >
          <el-col :span="3"
            ><el-button class="btn-main" v-if="activeName === '1'" @click="onDownload">{{
              $t('下载面单')
            }}</el-button></el-col
          >
        </el-row>
        <el-table
          v-if="activeName === '0'"
          :data="item.goods"
          style="width: 80%"
          border
          class="space"
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column :label="$t('采购编号')" prop="sn">
            <template slot-scope="scope">
              <span>{{ scope.row.p_order ? scope.row.p_order.sn : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="number" :label="$t('商品编号')">
            <template slot-scope="scope">
              {{ scope.row.p_goods ? scope.row.p_goods.number : '' }}
            </template>
          </el-table-column>
          <el-table-column label="barcode" prop="barcode">
            <template slot-scope="scope">
              <span>{{ scope.row.p_goods ? scope.row.p_goods.barcode : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cn_name" :label="$t('物品中文名称')">
            <template slot-scope="scope">
              {{ scope.row.p_goods ? scope.row.p_goods.cn_name : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('分货数量')"> </el-table-column>
          <el-table-column prop="picking_quantity" :label="$t('拣货数量')"></el-table-column>
          <el-table-column prop="pack_quantity" :label="$t('打包数量')">
            <template slot-scope="scope">
              <span>{{ Number(scope.row.pack_quantity) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="picking_quantity,quantity" :label="$t('拣货差异数量')">
            <template slot-scope="scope">
              <span>
                {{
                  Number(scope.row.picking_quantity) - Number(scope.row.quantity)
                    ? Number(scope.row.picking_quantity) - Number(scope.row.quantity)
                    : 0
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('打包差异数量')">
            <template slot-scope="scope">
              <span>{{
                Number(scope.row.pack_quantity) - Number(scope.row.quantity)
                  ? Number(scope.row.pack_quantity) - Number(scope.row.quantity)
                  : 0
              }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="item.boxes" border class="space" style="width: 80%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="sn" :label="$t('出库箱号')"></el-table-column>
          <el-table-column prop="quantity" :label="$t('商品数量')"></el-table-column>
          <el-table-column prop="" :label="$t('包含商品')"></el-table-column>
        </el-table>
      </div>
    </div>
    <div style="margin-top: 50px; text-align: left">
      <el-button @click="onSubmit(0)" v-if="status === 0 && goodData.length" type="primary">{{
        $t('保存')
      }}</el-button>
      <el-button
        class="save-btn"
        v-if="status === 0 && goodData.length"
        type="primary"
        @click="onSubmit(1)"
        >{{ $t('保存并提交') }}</el-button
      >
      <el-button v-if="status === 1" type="primary" @click="onPick">{{ $t('拣货') }}</el-button>
      <el-button v-if="status === 2" type="primary" @click="onPack">{{ $t('打包') }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
// import backTop from './components/scroll.vue'
export default {
  data() {
    return {
      tableData: [],
      form: {},
      goodData: [],
      status: '',
      statusName: '',
      sn: '',
      activeName: '0',
      name: '',
      remark: '',
      orders: [],
      records: [],
      edit: false
    }
  },
  created() {
    this.getList()
  },
  components: {
    // backTop
  },
  methods: {
    getList(isFlag = true) {
      this.$request.pickOrderDetail(this.$route.params.id).then(res => {
        this.status = res.data.status
        this.statusName = res.data.status_name
        this.sn = res.data.sn
        this.name = res.data.name
        this.orders = res.data.orders
        this.remark = res.data.remark
        this.records = res.data.records
        this.form.name = res.data.name
        this.form.remark = res.data.remark
        if (isFlag) {
          this.orders.forEach(item => {
            this.goodData.push({
              number: item.number,
              station_code: item.station.code,
              user: item.user,
              user_id: item.user_id,
              prop_ids: item.props.map(ele => ele.id),
              sn: item.sn,
              id: item.id,
              boxes: item.boxes,
              goods: item.goods.map(ele => {
                return {
                  ...ele.p_goods,
                  id: ele.id,
                  purchase_order_sn: ele.p_order ? ele.p_order.sn : '',
                  quantity: ele.quantity,
                  picking_quantity: ele.picking_quantity,
                  pack_quantity: ele.pack_quantity
                }
              })
            })
          })
        }
      })
    },
    onImport(mode) {
      dialog(
        {
          type: 'distributeScheme',
          mode,
          id: this.$route.params.id
        },
        goodsList => {
          this.getList(false)
          goodsList.forEach(item => {
            item.user = {}
            item.user.id = item.user_id
            item.user.name = item.user_name
            item.goods.forEach(ele => {
              ele.picking_quantity = ele.picking_quantity ? ele.picking_quantity : 0
              ele.pack_quantity = ele.pack_quantity ? ele.pack_quantity : 0
              ele.cn_name = ele.name
            })
          })
          let tableData = []
          let num2 = this.goodData.map(item => item.number)
          goodsList.forEach(item => {
            console.log(num2.includes(item.number))
            if (num2.includes(item.number)) {
              this.goodData.forEach(ele => {
                if (ele.number === item.number) {
                  ele.station_code = item.station_code
                  ele.user.id = item.user_id
                  ele.user.name = item.user_name
                  let list = []
                  item.goods.forEach(goods1 => {
                    let flag = false
                    ele.goods.forEach(goods2 => {
                      if (
                        goods1.purchase_order_sn === goods2.purchase_order_sn &&
                        goods1.number === goods2.number
                      ) {
                        goods2.quantity = goods1.quantity
                        flag = true
                      }
                    })
                    if (!flag) {
                      list.push(goods1)
                      console.log(list)
                    }
                  })
                  ele.goods = ele.goods.concat(list)
                  console.log(tableData)
                }
              })
            } else {
              tableData.push(item)
              console.log(tableData)
            }
          })
          console.log(tableData)
          this.goodData = this.goodData.concat(tableData)
        }
      )
    },
    onClear() {
      this.goodData = []
    },
    onEditRow() {
      this.edit = true
    },
    onDelRow(index, rows) {
      rows.splice(index, 1)
    },
    onDownload() {
      let params = {
        type: 2
      }
      params.ids = this.orders.map(item => item.id)
      this.$request.downloadNoodleSheet(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          window.open(res.data.url)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    handleClick() {
      this.getList()
    },
    onDownloadFile(path) {
      let url = `${this.$baseUrl.IMAGE_URL}${path}`
      window.open(url)
    },
    onPick() {
      this.$router.push({
        name: 'picking',
        query: { sn: this.sn }
      })
    },
    onPack() {
      this.$router.push({
        name: 'purchasePack',
        query: { sn: this.sn }
      })
    },
    onDelete(recordId) {
      this.$request.delUploadRecord(this.$route.params.id, recordId).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
          this.goodData = []
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onSubmit(isFinish) {
      let params = {}
      params.orders = this.goodData.map(item => {
        const id = item.id
        const prop_ids = item.prop_ids
        const number = item.number
        const station_code = item.station_code
        const user_id = item.user_id
        const goods = item.goods.map(ele => {
          return {
            id: ele.id,
            number: ele.number,
            purchase_order_sn: ele.purchase_order_sn,
            quantity: ele.quantity,
            image: ele.image
          }
        })
        return {
          id,
          prop_ids,
          number,
          station_code,
          user_id,
          goods
        }
      })
      this.$request
        .editPickOrder(this.$route.params.id, {
          ...this.form,
          is_finish: isFinish,
          orders: params.orders
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.push({
              name: 'transshipmentBill'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss">
.transshipment-detail-container {
  background: #fff !important;
  min-height: calc(100vh - 150px);
}
.review {
  margin-top: 20px;
  line-height: 20px;
}
.font-bold {
  font-weight: bold;
}
.record {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.programme {
  width: 80%;
  margin-top: 10px;
  cursor: pointer;
  background: #eff1f2;
  padding: 8px;
  border-radius: 5px;
  font-size: 14px;
}
.record-item {
  width: 80%;
}
.space {
  margin: 20px 0 20px 0;
}
.flex-1 {
  flex: 1;
}
.title {
  display: flex;
  align-items: center;
}
.el-form-item__label {
  font-size: 16px;
}
.el-form-item__content {
  font-size: 16px;
}
.status-item {
  font-size: 26px;
  color: red;
  font-weight: bold;
}
</style>
