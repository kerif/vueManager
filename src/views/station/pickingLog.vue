<template>
  <div class="picking-log">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="pad">
          <el-form
            :model="searchForm"
            status-icon
            :rules="rules"
            ref="searchForm"
            class="demo-searchForm"
          >
            <el-form-item>
              <el-select style="width: 100%" v-model="value" clearable placeholder="请选择">
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input type="textarea" rows="10" v-model="searchForm.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="20">
        <h4>关联快递单号</h4>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="date" label="快递单号" width="180"> </el-table-column>
          <el-table-column prop="name" label="包裹编码"> </el-table-column>
          <el-table-column prop="address" label="订单号"> </el-table-column>
          <el-table-column prop="address" label="仓库"> </el-table-column>
          <el-table-column prop="address" label="会员ID"> </el-table-column>
          <el-table-column prop="address" label="会员名称"> </el-table-column>
          <el-table-column prop="address" label="品名"> </el-table-column>
          <el-table-column prop="address" label="入库时间"> </el-table-column>
          <el-table-column prop="address" label="重量"> </el-table-column>
          <el-table-column prop="address" label="尺寸"> </el-table-column>
          <el-table-column prop="address" label="上架时间"> </el-table-column>
          <el-table-column prop="address" label="上架人"> </el-table-column>
          <el-table-column prop="address" label="库存"> </el-table-column>
          <el-table-column prop="address" label="下架时间"> </el-table-column>
          <el-table-column prop="address" label="下架人"> </el-table-column>
        </el-table>
        <h4>关联订单号</h4>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="date" label="订单号" width="180"> </el-table-column>
          <el-table-column prop="name" label="转运单号"> </el-table-column>
          <el-table-column prop="address" label="发货单号"> </el-table-column>
          <el-table-column prop="address" label="仓库"> </el-table-column>
          <el-table-column prop="address" label="会员ID"> </el-table-column>
          <el-table-column prop="address" label="下单时间"> </el-table-column>
          <el-table-column prop="address" label="订单状态"> </el-table-column>
          <el-table-column prop="address" label="目的地"> </el-table-column>
          <el-table-column prop="address" label="打包方式"> </el-table-column>
          <el-table-column prop="address" label="打包箱数"> </el-table-column>
          <el-table-column prop="address" label="内含件数"> </el-table-column>
          <el-table-column prop="address" label="打包计费重量"> </el-table-column>
          <el-table-column prop="address" label="创建时间"> </el-table-column>
          <el-table-column prop="address" label="支付时间"> </el-table-column>
          <el-table-column prop="address" label="打包时间"> </el-table-column>
          <el-table-column prop="address" label="打包人"> </el-table-column>
          <el-table-column prop="address" label="发货时间"> </el-table-column>
          <el-table-column prop="address" label="签收时间"> </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchForm: {
        email: '',
        phone: '',
        name: '',
        password: ''
      },
      searchOptions: [
        {
          value: '选项1',
          label: '包裹单号'
        },
        {
          value: '选项2',
          label: '订单号'
        }
      ]
    }
  },
  methods: {
    init() {
      this.show = true
    }
  }
}
</script>
<style lang="scss">
.picking-log {
  background-color: white;
  .pad {
    padding: 20px;
  }
}
</style>
