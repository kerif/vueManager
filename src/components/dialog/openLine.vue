<template>
  <el-dialog :visible.sync="show" :title="state === 'insurance' ? $t('分路线部分开启保险') : $t('分路线部分开启关税')" class="dialog-line-open"
  @close="clear" width="55%">
    <div class="top-sty">{{$t('勾选需开启该功能的路线')}}
      <div v-for="item in lineData" :key="item.id" class="service">
        <div class="serviceLeft">
          <el-checkbox v-model="item.enabled">{{item.name}}</el-checkbox>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
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
      prop_ids: [],
      state: '',
      lineData: []
    }
  },
  methods: {
    getList () {
      if (this.state === 'insurance') {
        this.getInsurance()
      } else {
        this.getTariff()
      }
    },
    // 获取保险服务路线
    getInsurance () {
      this.$request.getInsuranceLine({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          let ids = this.lineData.map(item => item.id)
          res.data.forEach(items => {
            let enabled = !!items.enabled
            if (ids.includes(items.id)) {
              let ele = this.lineData.filter(item => item.id === items.id)[0]
              if (ele) {
                enabled = ele.enabled
              }
            }
            items.enabled = enabled
          })
          this.lineData = res.data
        }
      })
    },
    // 获取关税服务路线
    getTariff () {
      this.$request.getTariffLine({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          let ids = this.lineData.map(item => item.id)
          res.data.forEach(items => {
            let enabled = !!items.enabled
            if (ids.includes(items.id)) {
              let ele = this.lineData.filter(item => item.id === items.id)[0]
              if (ele) {
                enabled = ele.enabled
              }
            }
            items.enabled = enabled
          })
          this.lineData = res.data
        }
      })
    },
    confirm () {
      const ids = this.lineData.filter(item => item.enabled).map(item => item.id)
      console.log(ids, 'params')
      if (this.state === 'insurance') {
        this.$request.updateInsuranceLine({
          ids: ids
        }).then(res => {
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
          this.show = false
        })
      } else {
        this.$request.updateTariffLine({
          ids: ids
        }).then(res => {
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
          this.show = false
        })
      }
    },
    init () {
      this.getList()
    },
    clear () {
      this.lineData = []
      this.page_params.page = 1
    }
  }
}
</script>
<style lang="scss">
.dialog-line-open {
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
  .input-select {
    width: 30%;
    margin-right: 10px;
  }
  .el-dialog__close {
    color: #FFF;
  }
  .commission-top {
    margin-left: 20px;
  }
  .top-sty {
    padding-left: 40px;
  }
  .service {
    // width: 560px;
    overflow: hidden;
    padding-left: 40px;
    .serviceLeft {
      display: inline-block;
      line-height: 40px;
      // float: left;
      width: 120px;
    }
  }
}
</style>
