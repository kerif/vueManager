<template>
  <div class="picking-list-container">
    <search-group placeholder="请输入关键字"></search-group>
      <el-tabs v-model="activeName" class="tabLength" @tab-click="handleClick">
        <!-- 入库日志 -->
        <el-tab-pane label="入库日志" name="1"></el-tab-pane>
        <!-- 拣货日志 -->
        <el-tab-pane label="拣货日志" name="2"></el-tab-pane>
    </el-tabs>
   <el-table class="data-list" border stripe
      :data="oderData">
      <!-- 操作人 -->
      <el-table-column label="操作人" prop="operator"></el-table-column>
      <!-- 操作时间 -->
      <el-table-column label="操作时间" prop="created_at"></el-table-column>
      <!-- 快递单号 -->
      <el-table-column label="快递单号" prop="express_num" v-if="activeName === '1'"></el-table-column>
      <!-- 转运单号 -->
      <el-table-column label="转运单号" v-if="activeName === '2'" prop="order_sn"></el-table-column>
      <!-- 重量kg -->
      <el-table-column label="重量kg" prop="weight"></el-table-column>
      <!-- 长宽高cm -->
      <el-table-column label="长宽高cm" prop="dimension"></el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" prop="remark"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性" v-if="activeName === '1'" prop="props"></el-table-column>
      <!-- 打包图片 -->
      <el-table-column label="打包图片" v-if="activeName === '2'" prop="pictures">
        <template slot-scope="scope">
          <span v-for="item in scope.row.pictures"
          :key="item.id" style="cursor:pointer;"
          @click.stop="imgSrc=item.url, imgVisible=true">
           <img :src="item.url" style="width: 40px; margin-right: 5px;">
          </span>
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small">删除</el-button>
        </div>
      </template> -->
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      activeName: '',
      oderData: [],
      imgVisible: false,
      imgSrc: ''
    }
  },
  methods: {
    handleClick () {
      if (this.activeName === '1') {
        this.getList()
      } else if (this.activeName === '2') {
        this.getPick()
      }
    },
    // 入库日志
    getList () {
      this.$request.getStorage().then(res => {
        this.oderData = res.data
        console.log(this.orderData)
      })
    },
    // 拣货日志
    getPick () {
      this.$request.getPick().then(res => {
        this.oderData = res.data
      })
    }
  },
  created () {
    this.activeName = '1'
    this.getList()
  }
}
</script>

<style lang="scss">
.picking-list-container {
  .tabLength {
    width: 200px !important;
  }
}
</style>
