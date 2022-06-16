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
              :autosize="{ minRows: 2, maxRows: 4 }"
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
    <div class="record record-item">
      <div>PO020220606120000-3.xls</div>
      <div style="display: flex; align-items: center">
        <div>admin {{ $t('更新于') }} 2206-06-16 12:00:00</div>
        <div>{{ $t('下载') }}</div>
      </div>
    </div>
    <div>
      <h4 v-if="goodData.length">{{ $t('方案预览') }}</h4>
      <div v-for="(item, index) in goodData" :key="index">
        <el-row :gutter="10" class="review font-bold">
          <el-col :span="5"
            ><div>#{{ item.number }}</div></el-col
          >
          <el-col :span="5"
            ><div>{{ $t('客户') }}: {{ item.user_id }}</div></el-col
          >
          <el-col :span="5"
            ><div>{{ $t('收货点') }}: {{ item.station_code }}</div></el-col
          >
        </el-row>
        <el-table :data="item.goods" style="width: 80%" border class="space">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="number" :label="$t('商品ID')"> </el-table-column>
          <el-table-column prop="name" :label="$t('物品中文名称')"> </el-table-column>
          <el-table-column prop="quantity" :label="$t('分货数量')"> </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="margin-top: 20px">
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
      value: '',
      goodData: [],
      form: {
        remark: '',
        name: ''
      }
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
          console.log(goodsList)
          this.goodData = goodsList
        }
      )
    },
    onSubmit() {
      // isFinish
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
      // this.$request
      //   .addPickOrder({ ...this.form, is_finish: isFinish, orders: params.orders })
      //   .then(res => {
      //     if (res.ret) {
      //       this.$notify({
      //         type: 'success',
      //         title: this.$t('操作成功'),
      //         message: res.msg
      //       })
      //       this.$router.push({
      //         name: 'transshipmentBill'
      //       })
      //     } else {
      //       this.$message({
      //         message: res.msg,
      //         type: 'error'
      //       })
      //     }
      //   })
    }
  }
}
</script>

<style lang="scss">
.add-scheme-container {
  background: #fff !important;
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
  margin-top: 20px;
}
.flex-1 {
  flex: 1;
}
</style>
