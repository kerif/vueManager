<template>
  <el-drawer
    title=""
    :visible.sync="showDetail"
    direction="rtl"
    :withHeader="false"
    :before-close="close"
    @opened="open"
    size="50%"
  >
    <div class="track-detail">
      <div>
        <div class="detail-title">{{ $t('订单轨迹详细') }}</div>
        <div class="order-info">
          <div class="first-line">
            <div class="info-box">
              <div class='tip'>{{ $t('订单号') }}</div>
              <div class="bold-font">JIYUN10086123</div>
            </div>
            <div class="info-box">
              <div class='tip'>{{ $t('订单状态') }}</div>
              <div class="blue-font">待发货</div>
            </div>
          </div>
          <div class="first-line">
            <div class="info-box">
              <div class='tip'>{{ $t('转运单号') }}</div>
              <div>未设置</div>
            </div>
            <div class="info-box">
              <div class='tip'>{{ $t('转运公司') }}</div>
              <div>未设置</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style="height: 300px;">
          <el-steps direction="vertical" :active="1">
            <el-step title="步骤 1" icon="el-icon-edit"></el-step>
            <el-step title="步骤 2" icon="el-icon-edit" description="这是一段很长很长很长的描述性文字"></el-step>
            <el-step title="步骤 2" icon="el-icon-edit" description="这是一段很长很长很长的描述性文字"></el-step>
            <el-step title="步骤 3" icon="el-icon-edit" description="这是一段很长很长很长的描述性文字"></el-step>
            <el-step title="步骤 3" icon="el-icon-edit" description="这是一段很长很长很长的描述性文字"></el-step>
          </el-steps>
        </div>
        <div style="height: 300px">
          <el-steps :active="1" direction="vertical">
            <el-step title="步骤 1">
              <template v-slot:icon>
                <div></div>
              </template>
            </el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
          </el-steps>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'trackDetail',
  props: ['showDetail', 'selectItem'],
  data() {
    return {
      show: true
    }
  },
  mounted() {},
  methods: {
    open() {
      console.log(this.selectItem)
    },
    close() {
      this.$emit('receive', false)
    }
  }
}
</script>

<style lang="scss" scoped>
div::-webkit-scrollbar {
  /*滚动条整体样式*/
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  width: 8px;
}

div::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: rgba(41, 109, 241, 0.1);
}

div::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: 0;
  border-radius: 0;
  background: #f0f2f5;
}
.track-detail {
  padding: 20px;
  .detail-title {
    font-size: 24px;
    font-weight: bold;
  }
  .order-info {
    margin-top: 36px;
    font-size: 16px;
    .first-line {
      display: flex;
      margin-bottom: 16px;
      justify-content: space-between;
      padding-right: 200px;
      .info-box {
        .tip {
          width: 80px;
        }
        display: flex;
        align-items: center;
        .bold-font {
          font-weight: bold;
        }
        .blue-font {
          color: #848ac5;
        }
      }
    }
  }
}
</style>
