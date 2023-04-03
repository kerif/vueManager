<template>
  <div class="FaceSingleList">
    <div class="top">
      <div>
        <el-button type="primary" @click="createTemplate ">{{ $t('创建模板')}}</el-button>
      </div>
      <div>
        <span>{{$t('类型')}}：</span>
        <el-select v-model="value" :placeholder="$t('请选择')">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input class="input" v-model="input" :placeholder="$t('请输入')"></el-input>
        <el-button type="primary">{{$t('搜索')}}</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" height="calc(100vh - 270px)" border>
      <el-table-column prop="name" :label="$t('模板名称')">
      </el-table-column>
      <el-table-column prop="size" :label="$t('模板尺寸')" >
      </el-table-column>
      <el-table-column prop="type" :label="$t('类型')" >
      </el-table-column>
      <el-table-column prop="default" :label="$t('是否默认')" >
      </el-table-column>
      <el-table-column prop="custom" :label="$t('是否自定义模板')">
      </el-table-column>
      <el-table-column :label="$t('操作')" width="300">
        <!-- slot-scope="scope" -->
        <template>
            <el-button type="text">{{$t('删除')}}</el-button>
            <el-button type="text">{{$t('编辑')}}</el-button>
            <el-button type="text">{{$t('设为默认')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }],
      value: '',
      input: '',
      tableData: [{
        size: '297mm*420mm',
        name: '自定义模板1',
        type:'发货单',
        default:'是',
        custom: '是'
      }]
    }
  },
  methods:{
    createTemplate(){
        // window.location.href = 'https://www.google.com';
        window.open('https://order.sslguoji.com/tracking')
    }
  }
}
</script>
<style scoped lang="scss">
.FaceSingleList {
  background-color: #fff;
  padding: 16px 40px;
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .input {
      width: 200px;
      margin-left: 20px;
    }
  }
}
</style>