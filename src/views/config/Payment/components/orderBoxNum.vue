<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('编辑会员编号规则')"
    class="dialog-orderBoxNum"
    @close="clear"
    width="60%"
  >
    <el-form ref="form" :model="userRules" label-width="140px">
      <!-- 连接符 -->
      <el-form-item :label="$t('连接符')">
        <el-select v-model="value" :placeholder="$t('请选择')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 分箱号 -->
      <el-form-item :label="$t('分箱号')">
        <el-select v-model="value" :placeholder="$t('请选择')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 拼团订单后缀 -->
      <el-form-item :label="$t('拼团订单后缀')">
        <el-select v-model="value" :placeholder="$t('请选择')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 连接符 -->
      <el-form-item :label="$t('连接符')">
        <el-select v-model="value" :placeholder="$t('请选择')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 子订单号-->
      <el-form-item :label="$t('子订单号')">
        <el-select v-model="value" :placeholder="$t('请选择')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 发货单前缀-->
      <el-form-item :label="$t('发货单前缀')">
        <el-input v-model="userRules.prefix" :placeholder="$t('最多输入5个字符')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      show: false,
      value: '',
      userRules: {
        prefix: ''
      }
    }
  },
  created() {},
  methods: {
    confirm() {}
  }
}
</script>

<style lang="scss">
.dialog-orderBoxNum {
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
}
</style>
