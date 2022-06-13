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
    <div class="record record-item space">
      <h4>{{ $t('上传记录') }}</h4>
      <el-button type="primary" size="small">{{ $t('导入分货方案') }}</el-button>
    </div>
    <div class="record record-item">
      <div>PO020220606120000-3.xls</div>
      <div style="display: flex; align-items: center">
        <div>admin {{ $t('更新于') }} 2206-06-16 12:00:00</div>
        <div>{{ $t('下载') }}</div>
      </div>
    </div>
    <div>
      <h4>{{ $t('方案预览') }}</h4>
      <el-row :gutter="10" class="review font-bold">
        <el-col :span="5"><div>#1</div></el-col>
        <el-col :span="5"
          ><div>{{ $t('客户') }}: 10010</div></el-col
        >
        <el-col :span="5"
          ><div>{{ $t('收货点') }}: NM</div></el-col
        >
      </el-row>
      <el-table :data="tableData" style="width: 80%" border class="space">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="date" :label="$t('商品ID')"> </el-table-column>
        <el-table-column prop="name" :label="$t('物品中文名称')"> </el-table-column>
        <el-table-column prop="address" :label="$t('分货数量')"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      form: {},
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.add-scheme-container {
  background: #fff !important;
}
.review {
  line-height: 20px;
}
.font-bold {
  font-weight: bold;
}
.record {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-item {
  width: 80%;
}
.space {
  margin-top: 20px;
}
.flex-1 {
  flex: 1;
}
</style>
