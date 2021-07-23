<template>
  <div class="record">
    <el-dialog
      :title="$t('添加')"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetForm('form')"
    >
      <div>
        <el-form ref="form" :model="form">
          <el-form-item :label="$t('选择客户')" prop="customer">
            <el-select v-model="form.customer"></el-select>
          </el-form-item>
          <el-form-item :label="$t('选择分类')" prop="radio1">
            <el-radio v-model="form.radio1" label="1">{{ $t('成长值') }}</el-radio>
            <el-radio v-model="form.radio1" label="2">{{ $t('积分') }}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('选择操作')" prop="radio2">
            <el-radio v-model="form.radio2" label="1">{{ $t('充值') }}</el-radio>
            <el-radio v-model="form.radio2" label="2">{{ $t('扣款') }}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('请输入值')" prop="value">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="search">
      <div class="searcg-l">
        <search-group> </search-group>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
          <el-button size="mini" primary @click="dialogVisible = true">{{ $t('添加') }}</el-button>
        </div>
      </div>
      <div class="screen" v-show="hasFilterCondition">
        <el-date-picker
          size="mini"
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
        <el-select
          size="mini"
          clearable
          :placeholder="$t('请选择分类')"
          v-model="classify"
        ></el-select>
        <el-select
          size="mini"
          clearable
          :placeholder="$t('请选择收支类型')"
          v-model="type"
        ></el-select>
        <el-select
          size="mini"
          clearable
          :placeholder="$t('请选择收支规则')"
          v-model="rule"
        ></el-select>
        <div class="submit">
          <el-button type="primary" plain size="small">{{ $t('搜索') }}</el-button>
          <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="name" :label="$t('客户ID')"> </el-table-column>
        <el-table-column prop="name" :label="$t('分类')"> </el-table-column>
        <el-table-column prop="name" :label="$t('收支类型')"> </el-table-column>
        <el-table-column prop="name" :label="$t('金额')"> </el-table-column>
        <el-table-column prop="name" :label="$t('收支规则')"> </el-table-column>
        <el-table-column prop="name" :label="$t('相关订单')"> </el-table-column>
        <el-table-column prop="name" :label="$t('流水号')"> </el-table-column>
        <el-table-column prop="name" :label="$t('时间')"> </el-table-column>
        <el-table-column prop="name" :label="$t('备注')"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
export default {
  components: {
    SearchGroup
  },
  data() {
    return {
      hasFilterCondition: false,
      dialogVisible: false,
      classify: '',
      type: '',
      rule: '',
      timeList: [],
      tableData: [
        {
          name: 'zz'
        }
      ],
      form: {
        customer: '',
        radio1: '1',
        radio2: '1',
        value: ''
      }
    }
  },
  methods: {
    // 重置表单
    resetForm(form) {
      this.timeList = []
      if (form) {
        this.$refs[form].resetFields()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.record {
  .search {
    padding-bottom: 20px;
  }
  .screen {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
  }
  .searcg-l {
    display: flex;
    gap: 20px;
  }
  .search-group {
    width: 22.5%;
  }
}
</style>
