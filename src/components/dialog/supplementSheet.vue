<template>
  <el-dialog :title="$t('创建补款单')" :visible.sync="show" @close="clear">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item :label="$t('关联订单号')" prop="value">
        <el-input v-model="form.value" :placeholder="$t('请输入')"></el-input>
        <!-- <span>111222222222222</span> -->
      </el-form-item>
      <el-form-item :label="$t('补款类型')" prop="type">
        <el-select v-model="form.type" :placeholder="$t('请选择')">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('订单保价价值')" prop="value" v-if="form.type === 1">
        <el-input v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item :label="$t('保险金额')" prop="value" v-if="form.type === 1">
        <el-input v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item :label="$t('补款金额')" prop="value">
        <el-input v-model="form.value"></el-input>
      </el-form-item>
      <el-form-item :label="$t('备注')" prop="value">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
          v-model="form.textarea"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        value: '',
        type: '',
        textarea: ''
      },
      options: [
        {
          id: 1,
          name: '保险费用'
        },
        {
          id: 2,
          name: '运费补差'
        },
        {
          id: 3,
          name: '其他费用'
        }
      ]
    }
  },
  methods: {
    submit() {},
    clear() {}
  }
}
</script>

<style lang="scss">
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
</style>
