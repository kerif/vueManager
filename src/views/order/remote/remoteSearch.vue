<template>
  <div class="remote-search">
    <div class="search-box">
      <el-form :inline="true" :model="form" :rules="rules" ref="form">
        <el-form-item :label="$t('目的地')" prop="country_code">
          <el-input
            v-model="form.country_code"
            :placeholder="$t('请输入国家地区2字码')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('城市')">
          <el-input v-model="form.city" clearable :placeholder="$t('请输入城市')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('邮编')" prop="postcode">
          <el-input v-model="form.postcode" clearable :placeholder="$t('请输入邮编')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">{{ $t('查询') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-list">
      <div class="search-text">
        {{
          $t(
            '注意! 由于FEDEX， DHL，UPS，TNT偏远地区更新频繁，系统内置的偏远数据仅作参考查询， 最终以FEDEX， DHL， UPS， TNT官方为准。如有疑问建议直接致电对应的官方客服电话查询核实，请知悉'
          )
        }}
      </div>
      <el-table :data="tableData" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="name" :label="$t('偏远类型')">
          <template slot-scope="scope">
            <span>{{ scope.row.remote_type && scope.row.remote_type.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" :label="$t('国家地区编码')">
          <template slot-scope="scope">
            <span>{{ scope.row.country && scope.row.country.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('国家地区名称')">
          <template slot-scope="scope">
            <span>{{ scope.row.country && scope.row.country.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="city" :label="$t('城市')"></el-table-column>
        <el-table-column prop="start_postcode" :label="$t('起始邮编')"></el-table-column>
        <el-table-column prop="end_postcode" :label="$t('截止邮编')"></el-table-column>
        <el-table-column prop="grade" :label="$t('偏远等级')"></el-table-column>
        <el-table-column prop="source" :label="$t('来源')"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        country_code: '',
        city: '',
        postcode: ''
      },
      tableData: [],
      rules: {
        country_code: [{ required: true, message: this.$t('请输入目的地'), trigger: 'blur' }],
        postcode: [{ required: true, message: this.$t('请输入邮编'), trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.remoteSearch(this.form).then(res => {
            if (res.ret) {
              this.tableData = res.data.data
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.remote-search {
  .search-box {
    padding: 20px;
    background: #fff !important;
  }
  .search-list {
    margin-top: 20px;
    padding: 20px 10px;
    background: #fff !important;
    .search-text {
      font-size: 14px;
      margin-bottom: 20px;
    }
  }
}
</style>
