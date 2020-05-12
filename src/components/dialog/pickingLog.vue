<template>
  <el-dialog :visible.sync="show" :title="$t('拣货日志')" class="dialog-picking-list"
  @close="clear">
  <h4>包裹日志</h4>
    <el-table
      :data="pickingData"
      border
      style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('操作人')" prop="operator"></el-table-column>
      <!-- 操作时间 -->
      <el-table-column :label="$t('操作时间')" prop="created_at"></el-table-column>
      <!-- 订单号 -->
      <el-table-column :label="$t('快递单号')" prop="express_num"></el-table-column>
      <!-- 重量kg -->
      <el-table-column :label="$t('重量') + this.localization.weight_unit" prop="weight"></el-table-column>
      <!-- 长宽高cm -->
      <el-table-column :label="$t('长宽高') + this.localization.length_unit" prop="dimension"></el-table-column>
      <!-- 备注 -->
      <el-table-column :label="$t('备注')" prop="remark"></el-table-column>
      <!-- 打包图片 -->
      <el-table-column :label="$t('物品属性')" prop="props">
        <!-- <template slot-scope="scope">
          <span v-for="item in scope.row.pictures"
          :key="item.id" style="cursor:pointer;"
          @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
           <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" style="width: 40px; margin-right: 5px;">
          </span>
        </template> -->
      </el-table-column>
    </el-table>
  <h4>{{$t('订单日志')}}</h4>
  <el-table :data="orderData"
      border
      style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('操作人')" prop="operator"></el-table-column>
      <!-- 操作时间 -->
      <el-table-column :label="$t('操作时间')" prop="created_at"></el-table-column>
      <!-- 订单号 -->
      <el-table-column :label="$t('订单号')" prop="order_sn"></el-table-column>
      <!-- 重量kg -->
      <el-table-column :label="$t('重量') + this.localization.weight_unit" prop="weight"></el-table-column>
      <!-- 长宽高cm -->
      <el-table-column :label="$t('长宽高') + this.localization.length_unit" prop="dimension"></el-table-column>
      <!-- 备注 -->
      <el-table-column :label="$t('备注')" prop="remark"></el-table-column>
      <!-- 打包图片 -->
      <el-table-column :label="$t('打包图片')" prop="pictures">
        <template slot-scope="scope">
          <span v-for="item in scope.row.pictures"
          :key="item.id" style="cursor:pointer;"
          @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
           <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" style="width: 40px; margin-right: 5px;">
          </span>
        </template>
      </el-table-column>
  </el-table>
    <!-- <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div> -->
    <!-- <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div> -->
    <!-- <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog> -->
  </el-dialog>
</template>
<script>
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      pickingData: [],
      orderData: [],
      imgVisible: false,
      imgSrc: '',
      localization: {}
    }
  },
  // components: {
  //   NlePagination
  // },
  mixins: [pagination],
  methods: {
    getList () {
      this.$request.getOperate(this.id).then(res => {
        if (res.ret) {
          this.pickingData = res.data.packages
          this.orderData = res.data.orders
          this.localization = res.localization
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        }
      })
    },
    init () {
      this.getList()
    },
    clear () {
      this.page_params.page = 1
    }
  }
}
</script>
<style lang="scss">
.dialog-picking-list {
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }
  .el-dialog__close {
    color: #FFF;
  }
 .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
}
</style>
