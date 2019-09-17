<template>
  <div class="line-list-container">
    <div class="add-btn-box"><add-btn router="lineadd">添加路线</add-btn></div>
    <el-table stripe border class="data-list" :data="lineList">
      <el-table-column type="expand">
        <div>备注：计费方式以实重、体积重量取大者，不足1公斤按1公斤计费；体积重量：长*宽*高/6000</div>
      </el-table-column>
      <el-table-column label="线路名称" prop="name"></el-table-column>
      <el-table-column label="支持国家" prop="country"></el-table-column>
      <el-table-column label="参考时效" prop="expire"></el-table-column>
      <el-table-column label="首重" prop="first_weight"></el-table-column>
      <el-table-column label="首费" prop="first_price"></el-table-column>
      <el-table-column label="续重" prop="next_weight"></el-table-column>
      <el-table-column label="续费" prop="next_price"></el-table-column>
      <el-table-column label="最大重量" prop="max_weight"></el-table-column>
      <el-table-column label="最小重量" prop="min_weight"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button class="btn-green">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import AddBtn from '@/components/addBtn'
import { configApi } from '@/lib/request'
export default {
  data () {
    return {
      lineList: [
        {
          id: '',
          name: '荷兰普货专线',
          country: '荷兰',
          expire: '8-10天',
          first_weight: 8,
          first_price: 10,
          next_weight: 12,
          next_price: 12,
          max_weight: 30,
          min_weight: 1
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      configApi.getLines().then(res => {
        if (res.ret) {
          this.lineList = res.data
        }
      })
    }
  },
  components: {
    AddBtn
  }
}
</script>
<style lang="scss">
.line-list-container {
  .add-btn-box {
    overflow: hidden;
  }
}
</style>
