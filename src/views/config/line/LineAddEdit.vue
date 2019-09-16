<template>
  <div class="line-add-container">
    <el-form label-position="top">
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>线路名称</div>
            <el-input placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>支持国家</div>
            <el-select
              v-model="value"
              multiple
              filterable
              allow-create
              default-first-option
              class="country-select"
              placeholder="请选择文章标签">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>参考失效</div>
            <el-input placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>首重kg</div>
            <el-input placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="10">
            <div>首费¥</div>
            <el-input placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>续重kg</div>
            <el-input placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="10">
            <div>续费¥</div>
            <el-input placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>最小重量kg</div>
            <el-input placeholder="请输入内容"></el-input>
          </el-col>
           <el-col :span="10">
             <div>最大重量kg</div>
            <el-input placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>线路类型</div>
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="(item, index) in typeList" :key="index" :label="item"></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>备注</div>
            <el-input placeholder="请输入内容"  :rows="2" type="textarea"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="sava-btn">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: [],
      options: [{
        value: 'HTML',
        label: 'HTML'
      }, {
        value: 'CSS',
        label: 'CSS'
      }, {
        value: 'JavaScript',
        label: 'JavaScript'
      }],
      typeList: ['普货', '带电', '带磁', '粉末', '液体'],
      checkList: []
    }
  }
}
</script>
<style lang="scss">
.line-add-container {
  .country-select {
    width: 100%;
  }
  .sava-btn {
    min-width: 100px;
  }
}
</style>
