<template>
  <div class="add-scheme-container">
    <h4>{{ $t('基本信息') }}</h4>
    <el-form :model="form">
      <el-row>
        <el-col :span="10">
          <el-form-item :label="$t('分货方案名称')">
            <el-input v-model="value" style="width: 55%" :placeholder="$t('请输入')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('方案备注')">
            <el-input type="textarea" v-model="value" style="width: 55%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="record">
      <h4>{{ $t('上传记录') }}</h4>
      <el-button type="primary" size="small">{{ $t('导入分货方案') }}</el-button>
    </div>
    <div class="record">
      <div>PO020220606120000-3.xls</div>
      <div class="record">
        <div>admin {{ $t('更新于') }} 2206-06-16 12:00:00</div>
        <div>{{ $t('下载') }}</div>
      </div>
    </div>
    <div>
      <h4>{{ $t('方案预览') }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      form: {}
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.add-scheme-container {
  background: #fff !important;
}
.record {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
