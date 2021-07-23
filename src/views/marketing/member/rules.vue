<template>
  <div class="rules">
    <el-dialog :title="$t('消费转换成长值')" :visible.sync="dialogVisible" width="40%">
      <h5>{{ $t('转换规则') }}：</h5>
      <div class="content">
        <div>$ <el-input v-model="money" class="number"></el-input> = 1 {{ $t('成长值') }}</div>
        <el-checkbox v-model="checked">{{ $t('不足1成长值部分不累计') }}</el-checkbox>
      </div>
      <h5>{{ $t('计入成长值消费（以实际支付为准）') }}：</h5>
      <div class="content">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="运费"></el-checkbox>
          <el-checkbox label="关税费"></el-checkbox>
          <el-checkbox label="保险费"></el-checkbox>
        </el-checkbox-group>
      </div>
      <h5>{{ $t('触发时间') }}：</h5>
      <div class="content">
        {{ $t('订单为该状态时，成长值进入账户') }}
        <el-select :placeholder="$t('请选择')" v-model="time"></el-select>
      </div>
      <h5>{{ $t('成长值有效期') }}：</h5>
      <div class="content">
        {{ $t('成长值到账之日起计算，有效期为') }}
        <el-select :placeholder="$t('请选择')" v-model="date"></el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="name" :label="$t('分类')"> </el-table-column>
      <el-table-column prop="name" :label="$t('收支类型')"> </el-table-column>
      <el-table-column prop="name" :label="$t('规则名称')"> </el-table-column>
      <el-table-column prop="name" :label="$t('规则说明')"> </el-table-column>
      <el-table-column prop="name" :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.value" active-text="开" inactive-text="关"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('操作')">
        <template>
          <el-button size="mini" @click="dialogVisible = true">{{ $t('配置') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'rules',
  data() {
    return {
      dialogVisible: false,
      money: '',
      checked: false,
      checkList: [],
      time: '',
      date: '',
      tableData: [
        {
          name: '1',
          value: true
        }
      ]
    }
  }
}
</script>
<style scoped lang="scss">
.rules {
  .el-dialog__body {
    padding: 0 20px !important;
  }
  .content {
    padding: 0 20px;
    .number {
      width: 70px !important;
    }
    > div {
      margin-bottom: 20px;
    }
    .el-select {
      width: 100px;
    }
  }
}
</style>
