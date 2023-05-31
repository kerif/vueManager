<!--成员组基础信息-->
<template>
  <el-card shadow="never" :body-style="{ padding: '20px' }">
    <div slot="header" class="card-header">
      <span class="basic-info">基础信息</span>
      <span class="change-button-container">
        <button class="change-button" @click ="updateBaseInfo">修改</button>
      </span>
    </div>
    <!-- card body -->
    <div class="specific-info">
      <span class="info-des">
        名称
        <span class="info-content">{{name}}</span>
      </span>
      <span class="info-des">
        <span id = "phone_hide">客户手机号中位数隐藏</span>
        <span>
          <el-switch
            v-model="hide_phone"
            :active-value="1"
            :inactive-value="0"
            @change="switchChange"
          ></el-switch>
        </span>
      </span>
      <span class="info-des">
        描述
        <span class="info-content">{{description}}</span>
      </span>
    </div>
  </el-card>
</template>
<script>
export default {
  props: {
    name: '',
    hidePhone: '',
    description: '',
    id: '',
  },
  data() {
    return {
        hide_phone: this.hidePhone
    }
  },
  methods: {
    switchChange() {
      // 开关状态改变
      this.$emit('hidePhoneChange', this.id, this.hide_phone);
    },
    updateBaseInfo() {
        this.$emit('updateBaseInfo', this.id);
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  width: 100%;
  .card-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .basic-info {
      display: inline-block;
      height: 20px;
      font-size: 15px;
      font-weight: bold;
      line-height: 20px;
    }
    .change-button-container {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      .change-button {
        width: 80px;
        height: 25px;
        background-color: white;
        border: 1.6px solid #3641a3;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
}

.specific-info {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: repeat(2, 50%);
  grid-row-gap: 15px;
  padding-bottom: 30px;
  .info-des {
    font-size: 13px;
    color: rgb(50, 50, 50);
    #phone_hide {
        margin-right: 10px;
    }
    .info-content {
      color: rgb(100, 100, 100);
      margin-left: 30px;
    }
  }
}
</style>