<template>
  <el-dialog :title="$t('问答累计积分')" :visible.sync="show" @close="clear">
    <el-form label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('积分到账之日起计算,有效期为:')">
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
        </el-col>
        <el-col :span="12">
          <el-button @click="addRules">{{ $t('设置规则说明') }}</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <h3>{{ $t('【提问】获取积分规则:') }}</h3>
      <el-form-item :label="$t('获取积分限制')">
        <el-input v-model="value" style="width: 30%" :placeholder="$t('请填写次数')"></el-input> /
        <el-select v-model="value" :placeholder="$t('请选择频率')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('符合多项时获取方式')">
        <el-radio-group v-model="radio">
          <el-radio :label="0">{{ $t('按最高获取') }}</el-radio>
          <el-radio :label="1">{{ $t('叠加选取') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div>
        <el-button type="primary" size="small">{{ $t('新增') }}</el-button>
        <span style="display: inline-block; margin-left: 10px">{{ $t('*最多添加10条') }}</span>
      </div>
      <div style="margin-top: 20px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="date" :label="$t('字数>=')"> </el-table-column>
          <el-table-column prop="name" :label="$t('图片>=')"> </el-table-column>
          <el-table-column prop="address" :label="$t('积分')"> </el-table-column>
          <el-table-column :label="$t('操作')">
            <template>
              <el-button class="btn-light-blue">{{ $t('编辑') }}</el-button>
              <el-button class="btn-light-red">{{ $t('删除') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>
      <h3>{{ $t('【回答】获取积分规则:') }}</h3>
      <el-form-item :label="$t('获取积分限制')">
        <el-input v-model="value" style="width: 30%" :placeholder="$t('请填写次数')"></el-input> /
        <el-select v-model="value" :placeholder="$t('请选择频率')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('符合多项时获取方式')">
        <el-radio-group v-model="radio">
          <el-radio :label="0">{{ $t('按最高获取') }}</el-radio>
          <el-radio :label="1">{{ $t('叠加选取') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div>
        <el-button type="primary" size="small" @click="addIntegral">{{ $t('新增') }}</el-button>
        <span style="display: inline-block; margin-left: 10px">{{ $t('*最多添加10条') }}</span>
      </div>
      <div style="margin-top: 20px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="date" :label="$t('字数>=')"> </el-table-column>
          <el-table-column prop="name" :label="$t('图片>=')"> </el-table-column>
          <el-table-column prop="address" :label="$t('积分')"> </el-table-column>
          <el-table-column :label="$t('操作')">
            <template>
              <el-button class="btn-light-blue">{{ $t('编辑') }}</el-button>
              <el-button class="btn-light-red">{{ $t('删除') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
    <el-dialog :title="$t('问答规则说明')" :visible.sync="showRule" append-to-body>
      <div>{{ $t('该说明将显示在客户端(小程序/网站), 方便客户理解规则') }}</div>
      <div slot="footer">
        <el-button @click="cancelDialog">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('问答累计积分')" :visible.sync="showIntegral" append-to-body>
      <el-form :model="form" label-position="top">
        <el-form-item :label="$t('字数(>=)')" prop="value">
          <el-input v-model="form.value" :placeholder="$t('请输入')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('图片数(>=)')" prop="value">
          <el-input v-model="form.value" :placeholder="$t('请输入')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('获得积分')" prop="value">
          <el-input v-model="form.value" :placeholder="$t('请输入')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelDialog('ruleForm')">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      showRule: false,
      showIntegral: false,
      form: {
        value: ''
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        }
      ],
      value: '',
      radio: 0,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ]
    }
  },
  methods: {
    addRules() {
      this.showRule = true
    },
    addIntegral() {
      this.showIntegral = true
    },
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
