<template>
  <el-dialog :visible.sync="showGoods" :title="$t('添加商品')" :before-close="close" @close="clear">
    <h5>{{ $t('基础信息') }}</h5>
    <el-form>
      <el-form-item :label="$t('中文名称')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('英文名称')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('品牌')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('商品分类')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('商品属性')">
        <el-radio-group v-model="radio">
          <el-radio :label="0">备选项</el-radio>
          <el-radio :label="1">备选项</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('采购单价')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('物品总数量')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('总箱数')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('箱规')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('条码')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('物品照片')"></el-form-item>
      <el-form-item :label="$t('供应商')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('HS CODE')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('SKU')">
        <el-input style="width: 35%" v-model="value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary">{{ $t('提交') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      radio: 1,
      value: ''
    }
  },
  props: {
    showGoods: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {},
    clear() {}
  }
}
</script>

<style></style>
