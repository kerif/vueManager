<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('分货详细')"
    class="distribution-dialog"
    style="width: 100%"
    @close="clear"
  >
    <div class="distribution">
      <div class="distribution-left">
        <div>
          <div class="box-item">
            <div class="num">#1</div>
            <div>{{ $t('分货清单') }}</div>
          </div>
        </div>
      </div>
      <div class="distribution-right">
        <div class="info-item">
          <div class="font">{{ $t('转运单号') }}</div>
          <div style="font-weight: bold; font-size: 20px">{{ row.sn }}</div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('客户ID') }}</div>
          <div>{{ row.user ? row.user.id : '' }} --- {{ row.user ? row.user.name : '' }}</div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('转运状态') }}</div>
          <div v-if="row.status === 2">{{ $t('待打包') }}</div>
          <div v-if="row.status === 3">{{ $t('已完成') }}</div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('分货数量') }}</div>
          <div>{{ row.quantity }}</div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('拣货数量') }}</div>
          <div>{{ row.picking_quantity }}</div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('打包数量') }}</div>
          <div>{{ row.pack_quantity }}</div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('目的地') }}</div>
          <div>{{ row.country ? row.country.name : '' }}</div>
        </div>
        <div class="info-item">
          <div class="font">{{ $t('下单渠道') }}</div>
          <div>{{ row.express_line ? row.express_line.name : '' }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      row: {},
      servicesData: [],
      packageData: [],
      arrList: []
    }
  },
  methods: {
    init() {},
    clear() {}
  }
}
</script>

<style lang="scss">
.distribution-dialog {
  .font {
    font-weight: bold;
  }
  .border-item {
    width: 420px;
    border: 2px solid #eee;
    padding: 10px;
    margin: 10px 0 0 60px;
    border-radius: 6px;
  }
  .distribution {
    display: flex;
    .distribution-left {
      width: 260px;
      padding: 0 10px;
      .box-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        .num {
          font-weight: bold;
          font-size: 24px;
        }
      }
      .box-wrap {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 10px;
        border: 2px solid #eee;
        border-radius: 5px;
      }
    }
    .distribution-right {
      width: 500px;
      padding: 10px;
      border-left: 2px solid #eee;
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
