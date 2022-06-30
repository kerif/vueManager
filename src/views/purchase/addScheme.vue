<template>
  <div class="add-scheme-container">
    <h4>{{ $t('基本信息') }}</h4>
    <el-form :model="form">
      <el-row>
        <el-col :span="10">
          <el-form-item :label="$t('分货方案名称')">
            <el-input v-model="form.name" style="width: 55%" :placeholder="$t('请输入')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('方案备注')">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              v-model="form.remark"
              style="width: 55%"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="record record-item space">
      <h4>{{ $t('上传记录') }}</h4>
      <el-button type="primary" size="small" @click="onImport(2)">{{
        $t('导入分货方案')
      }}</el-button>
    </div>
    <el-row
      :gutter="10"
      v-for="item in records"
      :key="item.id"
      style="margin-top: 15px; cursor: pointer"
    >
      <el-col :span="7"><i class="el-icon-document"></i>&nbsp;&nbsp;{{ item.name }}</el-col>
      <el-col :span="4" :offset="8">{{ $t('更新于') }}{{ item.updated_at }}</el-col>
      <el-col :span="1" :offset="2"><i class="el-icon-download" @click="downloadFile"></i></el-col>
      <el-col :span="1" :offset="1">
        <i
          class="el-icon-close"
          style="font-size: 16px; font-weight: bold"
          @click="onDelete(item.id)"
        ></i>
      </el-col>
    </el-row>
    <div>
      <h4 v-if="goodData.length">{{ $t('方案预览') }}</h4>
      <div v-for="(item, index) in goodData" :key="index">
        <el-row :gutter="10" class="review font-bold">
          <el-col :span="5"
            ><div>#{{ item.number }}</div></el-col
          >
          <el-col :span="5"
            ><div>{{ $t('客户') }}: {{ item.user_id }} --- {{ item.user_name }}</div></el-col
          >
          <el-col :span="5"
            ><div>{{ $t('收货点') }}: {{ item.station_code }}</div></el-col
          >
        </el-row>
        <el-table :data="item.goods" style="width: 80%" border class="space">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="number" :label="$t('商品编号')"> </el-table-column>
          <el-table-column prop="name" :label="$t('物品中文名称')"> </el-table-column>
          <el-table-column prop="quantity" :label="$t('分货数量')"> </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="margin-top: 20px" v-if="goodData.length">
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
      goodData: [],
      form: {
        remark: '',
        name: ''
      },
      records: []
    }
  },
  methods: {
    onImport(mode) {
      dialog(
        {
          type: 'distributeScheme',
          mode
        },
        goodsList => {
          let tableData = []
          let num2 = this.goodData.map(item => item.number)
          let station = this.goodData.map(item => item.station_code)
          let user = this.goodData.map(item => item.user_id)
          goodsList.forEach(item => {
            if (
              num2.includes(item.number) &&
              station.includes(item.station_code) &&
              user.includes(item.user_id)
            ) {
              this.goodData.forEach(ele => {
                if (
                  ele.number === item.number &&
                  ele.station_code === item.station_code &&
                  ele.user_id === item.user_id
                ) {
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
                    }
                  })
                  ele.goods = ele.goods.concat(list)
                  console.log(ele.goods)
                }
              })
            } else {
              console.log(item)
              tableData.push(item)
              console.log(tableData)
            }
          })
          console.log(tableData)
          this.goodData = this.goodData.concat(tableData)
          console.log(this.goodData)
        }
      )
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
            if (isFinish === 0) {
              this.$router.push({
                name: 'transshipmentBill',
                query: { activeName: '0' }
              })
            } else {
              this.$router.push({
                name: 'transshipmentBill',
                query: { activeName: '1' }
              })
            }
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
.add-scheme-container {
  background: #fff !important;
  min-height: calc(100vh - 150px);
}
.review {
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

.record-item {
  width: 80%;
}
.space {
  margin: 20px 0 20px 0;
}
.flex-1 {
  flex: 1;
}
</style>
