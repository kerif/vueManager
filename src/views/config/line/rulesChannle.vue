<template>
  <div class="channel-rules-container">
    <el-form ref="form" :model="form" class="form-sty">
      <el-form-item :label="$t('以下规则收费方式')">
        <el-radio :label="0">{{ $t('同时收取') }}</el-radio>
        <el-radio :label="1">{{ $t('每个分区仅按最高项规则收取') }}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('所有规则最高收费')">
        <el-input class="input-sty" :placeholder="$t('请输入值（空值为不限制）')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">{{ $t('保存') }}</el-button>
      </el-form-item>
    </el-form>
    <div class="rules-main">
      <div class="rules-top">
        <div class="rules-left">
          <h3>{{ $t('规则一') }}</h3>
        </div>
        <div class="rules-right">
          <el-button>{{ $t('修改') }}</el-button>
          <el-button>{{ $t('删除') }}</el-button>
        </div>
      </div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss">
.channel-rules-container {
  .input-sty {
    width: 30%;
  }
  .form-sty {
    background-color: #fff;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  .rules-main {
    padding: 10px;
    background-color: #fff;
    .rules-top {
      .rules-left,
      .rules-right {
        display: inline-block;
      }
      .rules-right {
        float: right;
      }
    }
  }
}
</style>
