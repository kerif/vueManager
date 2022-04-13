<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>基本信息</h4>
      </el-col>
      <el-col :span="12">
        <h4>发货信息</h4>
      </el-col>
    </el-row>
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('PO单号')">
            <el-input
              v-model="value"
              style="width: 50%"
              :placeholder="$t('单号仅限字母、数字、或下划线，长度限制15个字符')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('发货公司')">
            <el-select :placeholder="$t('请选择发货公司')" style="width: 50%">
              <el-option></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('PO单号名称')">
            <el-input
              v-model="value"
              style="width: 50%"
              :placeholder="$t('长度限制30个字符')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('物流单号')">
            <el-input
              v-model="value"
              style="width: 50%"
              :placeholder="$t('请输入物流单号')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('采购总金额')">
            <el-input v-model="value" style="width: 50%" :placeholder="$t('请输入')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('采购备注')">
            <el-input
              v-model="value"
              type="textarea"
              style="width: 50%"
              :placeholder="$t('请输入')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top: 20px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h4>采购清单</h4>
        <el-button size="small">添加</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="date" label="操作"> </el-table-column>
        <el-table-column prop="name" label="物品中文名称"> </el-table-column>
        <el-table-column prop="address" label="物品英文名称"> </el-table-column>
        <el-table-column label="品牌"></el-table-column>
        <el-table-column label="商品分类"></el-table-column>
        <el-table-column label="属性"></el-table-column>
        <el-table-column label="物品单价"></el-table-column>
        <el-table-column label="物品明细数量"></el-table-column>
        <el-table-column label="物品总箱数"></el-table-column>
        <el-table-column label="物品箱规"></el-table-column>
        <el-table-column label="条码"></el-table-column>
        <el-table-column label="物品照片"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style></style>
