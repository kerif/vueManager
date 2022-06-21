<template>
  <div class="transshipment-detail-container">
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
        <el-col :span="4" :offset="9">{{ $t('更新于') }}&nbsp;&nbsp;{{ item.updated_at }}</el-col>
        <el-col :span="1" :offset="3"
          ><i class="el-icon-download" @click="downloadFile"></i
        ></el-col>
      </el-row>
    </div>
    <div v-if="status === 0 || status === 1 || status === 2">
      <h4>{{ $t('方案预览') }}</h4>
      <div v-for="(item, index) in goodData" :key="index">
        <el-row :gutter="10" class="review font-bold">
          <el-col :span="5"
            ><div>#{{ item.number }}</div></el-col
          >
          <el-col :span="5" v-if="status === 2">{{ item.sn }}</el-col>
          <el-col :span="5"
            ><div>{{ $t('客户') }}: {{ item.user_id }}</div></el-col
          >
          <el-col :span="5"
            ><div>{{ $t('收货点') }}: {{ item.station_code }}</div></el-col
          >
        </el-row>
        <el-table :data="item.goods" style="width: 80%" border stripe class="space">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="number" :label="$t('商品ID')"> </el-table-column>
          <el-table-column prop="name" :label="$t('物品中文名称')"> </el-table-column>
          <el-table-column prop="quantity" :label="$t('分货数量')"> </el-table-column>
          <el-table-column v-if="status === 2" :label="$t('实际分货数量')"></el-table-column>
          <el-table-column v-if="status === 2" :label="$t('装箱')"></el-table-column>
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
            ><div>{{ $t('客户') }}: {{ item.user_id }}</div></el-col
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
          <el-table-column prop="number" :label="$t('商品ID')">
            <template slot-scope="scope">
              {{ scope.row.p_goods ? scope.row.p_goods.number : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="cn_name" :label="$t('物品中文名称')">
            <template slot-scope="scope">
              {{ scope.row.p_goods ? scope.row.p_goods.cn_name : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('分货数量')"> </el-table-column>
          <el-table-column prop="picking_quantity" :label="$t('实际分货数量')"></el-table-column>
        </el-table>
        <el-table v-else :data="item.boxes" border class="space" style="width: 80%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="sn" :label="$t('出库箱号')"></el-table-column>
          <el-table-column prop="quantity" :label="$t('商品数量')"></el-table-column>
          <el-table-column prop="" :label="$t('包含商品')"></el-table-column>
        </el-table>
      </div>
    </div>
    <div style="margin-top: 50px; text-align: left" v-if="status === 0 || status === 1">
      <el-button @click="onSubmit(0)" type="primary">{{ $t('保存') }}</el-button>
      <el-button class="save-btn" type="primary" @click="onSubmit(1)">{{
        $t('保存并提交')
      }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
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
      records: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.pickOrderDetail(this.$route.params.id).then(res => {
        console.log(res)
        this.status = res.data.status
        this.statusName = res.data.status_name
        this.sn = res.data.sn
        this.name = res.data.name
        this.orders = res.data.orders
        this.remark = res.data.remark
        this.records = res.data.records
        this.form.name = res.data.name
        this.form.remark = res.data.remark
        this.orders.forEach(item => {
          this.goodData.push({
            number: item.number,
            station_code: item.station.code,
            user: item.user,
            user_id: item.user_id,
            sn: item.sn,
            boxs: item.boxes,
            goods: item.goods.map(ele => {
              return { ...ele.p_goods, quantity: ele.quantity }
            })
          })
        })
        this.goodData.forEach(item => {
          if (item.goods) {
            item.goods.forEach(ele => {
              ele.name = ele.cn_name
            })
          }
        })
        console.log(this.goodData)
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
          console.log(goodsList, 333)
          this.goodData = []
          this.getList()
          this.goodData.push(JSON.parse(JSON.stringify(...goodsList)))
          console.log(this.goodData)
        }
      )
    },
    downloadFile() {},
    onDownload() {
      let params = {
        type: 2
      }
      params.ids = this.orders.map(item => item.id)
      this.$request.downloadNoodleSheet(params).then(res => {
        console.log(res)
      })
    },
    handleClick() {
      this.getList()
    },
    onSubmit(isFinish) {
      let params = {}
      params.orders = this.goodData.map(item => {
        const prop_ids = [item.prop.id]
        const goods = item.goods
        const number = item.number
        const station_code = item.station_code
        const user_id = item.user_id
        return {
          prop_ids,
          goods,
          number,
          station_code,
          user_id
        }
      })
      this.$request
        .addPickOrder({ ...this.form, is_finish: isFinish, orders: params.orders })
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
  background: #eee;
  padding: 8px;
  border-radius: 5px;
  font-size: 14px;
}
.record-item {
  width: 80%;
}
.space {
  margin-top: 20px;
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
