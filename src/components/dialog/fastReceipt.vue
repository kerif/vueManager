<template>
  <el-dialog :visible.sync="show" :title="$t('快速收货')" class="dialog-fast-receipt"
  @close="clear" width="80%">
  <el-row>
    <el-col :span="10">
      <div>
        <span>{{$t('请选择收货方式：')}}</span><br/>
        <el-radio v-model="radio" class="radio-sty" :label="1">{{$t('单票收货（单个包裹一个扫码收货，无复核）')}}</el-radio>
        <el-radio v-model="radio" :label="2">{{$t('整发货单（先扫码发货单号，然后包裹一个扫码核对，需复核）')}}</el-radio>
      </div>
    </el-col>
    <el-col :span="11" :offset="1">
      <div v-if="radio === 1">
        <span>{{$t('发货单：')}}</span><br/>
        <el-input class="input-sty radio-sty" placeholder="请输入发货单号或相关订单号"></el-input>
        <el-button>{{$t('确定')}}</el-button>
        <el-input type="textarea" :rows="3" class="input-sty" placeholder="多个订单号，请用回车分割"></el-input>
        <el-button>{{$t('复核')}}</el-button>
      </div>
      <div v-if="radio === 2">
        <el-input type="textarea" :rows="4" class="input-sty" placeholder="多个订单号，请用回车分割"></el-input>
        <el-button>{{$t('确定')}}</el-button>
      </div>
    </el-col>
  </el-row>
    <el-table
      class="table-sty"
      :data="tableData"
      border
      @selection-change="selectionChange"
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 用户名 -->
      <el-table-column
        prop="username"
        :label="$t('客户ID')">
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column
        prop="name"
        :label="$t('转运单号')">
      </el-table-column>
      <!-- 邮箱 -->
        <el-table-column
        prop="email"
        :label="$t('收件人')">
      </el-table-column>
      <!-- 电话 -->
        <el-table-column
        prop="phone"
        :label="$t('联系电话')">
      </el-table-column>
      <!-- 最后登录时间 -->
        <el-table-column
        prop="last_login_at"
        :label="$t('发货时间')">
      </el-table-column>
        <el-table-column
        prop="last_login_at"
        :label="$t('箱数')">
      </el-table-column>
        <el-table-column
        prop="last_login_at"
        :label="$t('重量')">
      </el-table-column>
        <el-table-column
        prop="last_login_at"
        :label="$t('尺寸/体积')">
      </el-table-column>
        <el-table-column
        prop="last_login_at"
        :label="$t('所属发货单')">
      </el-table-column>
    </el-table>
    <p class="order-sty">{{$t('订单数')}}：</p>
    <span>{{$t('已复核')}}：</span>
    <div slot="footer">
      <el-button type="primary" @click="confirm">{{$t('确定收货')}}</el-button>
    </div>
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data () {
    return {
      tableData: [],
      deleteNum: [],
      radio: 1
    }
  },
  methods: {
    getList () {
      this.$request.getVipMember(this.id, {
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableData = res.data
        this.page_params.page = res.meta.current_page
        this.page_params.total = res.meta.total
      })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    confirm () {},
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
.dialog-fast-receipt {
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
  .input-sty {
    width: 65%;
    margin-right: 30px;
  }
  .radio-sty {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .table-sty {
    margin-top: 20px;
  }
  .order-sty {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>
