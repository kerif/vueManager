<template>
  <el-dialog
    :visible.sync="show"
    :title="id ? $t('修改偏远信息') : $t('添加偏远信息')"
    @close="clear"
  >
    <el-form :inline="true" :model="form" :rules="rules">
      <el-form-item :label="$t('偏远类型')" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('偏远备注')">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave">{{ $t('保存') }}</el-button>
      </el-form-item>
      <el-tag type="danger" v-if="showTag === true">{{ $t('请先编辑保存偏远类型信息') }}</el-tag>
    </el-form>
    <div>
      {{
        $t(
          '提示: 编辑明细前请先保存偏远类型信息。系统内置偏远信息不可修改，若发现系统偏远信息有误，请及时与软件供应商联系更新修复，谢谢合作。'
        )
      }}
    </div>
    <div style="display: flex; align-items: center; justify-content: space-around; margin: 20px 0">
      <div style="flex: 1" class="flex-1">
        <el-button @click="onImport">{{ $t('导入') }}</el-button>
        <el-button @click="onAdd">{{ $t('添加') }}</el-button>
      </div>
      <div style="flex: 1" class="flex-1">
        <el-input v-model="keyword" class="search" clearable></el-input>
        <el-button @click="onSearch" type="primary">{{ $t('搜索') }}</el-button>
      </div>
    </div>
    <div style="margin: 20px 0">
      <el-table :data="tableData" border @selection-change="onSelectChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column :label="$t('国家/地区二字码')" prop="code" width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.country && scope.row.country.code }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('国家/地区名称')" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.country && scope.row.country.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('城市')" prop="city"></el-table-column>
        <el-table-column :label="$t('起始邮编')" prop="start_postcode">
          <template slot-scope="scope">
            <span>{{ scope.row.start_postcode === 'null' ? '' : scope.row.start_postcode }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('结束邮编')" prop="end_postcode">
          <template slot-scope="scope">
            <span>{{ scope.row.end_postcode === 'null' ? '' : scope.row.end_postcode }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('偏远等级')" prop="grade"></el-table-column>
        <el-table-column :label="$t('来源')" prop="source_name"></el-table-column>
        <el-table-column :label="$t('操作人')" prop="operator_name"></el-table-column>
        <el-table-column
          :label="$t('最新更新时间')"
          prop="updated_at"
          width="160"
        ></el-table-column>
        <el-table-column :label="$t('操作')" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button @click="onEdit(scope.row.id)" class="btn-main">{{ $t('修改') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom-btn">
      <el-button class="btn-light-red" @click="onBatchDel">{{ $t('批量删除') }}</el-button>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div>
    <el-dialog
      :visible.sync="showAddInfo"
      :title="remoteId ? $t('编辑偏远明细信息') : $t('添加偏远明细信息')"
      @close="clearAddInfo"
      append-to-body
    >
      <el-form label-width="120px" :model="ruleForm">
        <el-form-item :label="$t('国家/地区编码')">
          <el-select
            class="input-box"
            v-model="ruleForm.country_id"
            filterable
            clearable
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :value="item.id"
              :label="item.code_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('城市')">
          <el-input
            v-model="ruleForm.city"
            class="input-box"
            :placeholder="$t('请输入')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('起始邮编')">
          <el-input
            v-model="ruleForm.start_postcode"
            class="input-box"
            :placeholder="$t('请输入')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('结束邮编')">
          <el-input
            v-model="ruleForm.end_postcode"
            class="input-box"
            :placeholder="$t('请输入')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('偏远等级')">
          <el-select
            class="input-box"
            v-model="ruleForm.grade"
            :placeholder="$t('请选择')"
            clearable
          >
            <el-option
              v-for="(item, index) in gradeList"
              :key="index"
              :value="item.label"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <div style="margin-left: 120px; color: red">注意: 偏远等级, A、B、C级偏远</div>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddInfo = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showImport"
      :title="$t('导入偏远明细信息')"
      @close="clearImport"
      class="import-container"
      width="42%"
      append-to-body
    >
      <el-form label-width="120px">
        <div class="table-text">
          <div class="table-item"><span class="red-color">*</span>{{ $t('国家/地区二字码') }}</div>
          <div class="table-item">{{ $t('城市') }}</div>
          <div class="table-item">{{ $t('起始邮编') }}</div>
          <div class="table-item">{{ $t('结束邮编') }}</div>
          <div class="table-item">{{ $t('偏远等级') }}</div>
        </div>
        <el-form-item :label="$t('偏远信息')">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10 }"
            v-model="listVal"
            @paste.native="onPaste"
          ></el-input>
        </el-form-item>
        <div style="margin-left: 120px">
          说明:<br />
          请提前在Excel程序中按如下表头编辑好偏远数据，复制整个数据表格（不含表头）到文本框中即可。<br />
          带*列为必填列，其他列为可选列。可选列导入必须其前面的可选列也导入。<br />
          偏远等级，取值为A、B、C级偏远。
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="showImport = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" :loading="$store.state.btnLoading" @click="onConfirmImport">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      tableData: [],
      showAddInfo: false,
      showImport: false,
      id: '',
      keyword: '',
      remoteId: '',
      showTag: false,
      columns: [],
      listVal: '',
      list: [],
      remote_type_id: '',
      form: {
        name: '',
        remark: ''
      },
      ruleForm: {
        country_id: '',
        city: '',
        start_postcode: '',
        end_postcode: '',
        grade: ''
      },
      countryList: [],
      selectIDs: [],
      rules: {
        name: [{ required: true, message: this.$t('请输入偏远类型'), trigger: 'blur' }]
      },
      gradeList: [
        {
          label: 'A'
        },
        {
          label: 'B'
        },
        {
          label: 'C'
        }
      ],
      arrList: []
    }
  },
  mixins: [pagination],
  components: {
    NlePagination
  },
  methods: {
    init() {
      this.getCountry()
      if (this.id) {
        this.onDetail(this.id)
      }
    },
    getList() {
      this.$request
        .remoteDestination({
          keyword: this.keyword,
          remote_type_id: this.remote_type_id,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    onSave() {
      if (this.form.name) {
        this.showTag = false
      }
      if (!this.id) {
        this.$request.saveRemote(this.form).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.remote_type_id = res.data.id
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.saveEditRemote(this.id, this.form).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    clearAddInfo() {
      this.remoteId = ''
      this.ruleForm = {
        country_id: '',
        city: '',
        start_postcode: '',
        end_postcode: '',
        grade: ''
      }
    },
    onConfirm() {
      let params = {
        ...this.ruleForm
      }
      params.remote_type_id = this.remote_type_id
      if (this.remoteId) {
        this.$request.editRemoteDestination(this.remoteId, params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.showAddInfo = false
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.addRemoteDestination(params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.showAddInfo = false
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    onSearch() {
      this.getList()
    },
    onAdd() {
      if (!this.form.name) {
        return (this.showTag = true)
      }
      this.showAddInfo = true
    },
    onImport() {
      if (!this.form.name) {
        return (this.showTag = true)
      }
      this.showImport = true
    },
    onDetail(id) {
      this.$request.getRemoteDetail(id).then(res => {
        if (res.ret) {
          this.form.name = res.data.name
          this.form.remark = res.data.remark
          this.remote_type_id = res.data.id
          this.getList()
        }
      })
    },
    onEdit(id) {
      this.showAddInfo = true
      this.remoteId = id
      this.onRemoteDetail(id)
    },
    onRemoteDetail(id) {
      this.$request.remoteDestinationDeatil(id).then(res => {
        if (res.ret) {
          for (let key in this.ruleForm) {
            if (Object.hasOwnProperty.call(this.ruleForm, key)) {
              this.ruleForm[key] = res.data[key]
            }
          }
        }
      })
    },
    onPaste(e) {
      this.columns = []
      let source = e.clipboardData.getData('text')
      let rows = source.split('\n')
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] != '') {
          this.arrList = rows[i].split('\t')
          let obj = {
            country_code: '',
            city: '',
            start_postcode: '',
            end_postcode: '',
            grade: ''
          }
          let j = 0
          for (let key in obj) {
            obj[key] = this.arrList[j]
            j++
          }
          this.columns.push(obj)
        }
      }
    },
    onConfirmImport() {
      if (!this.listVal) {
        return this.$message.error(this.$t('偏远信息不能为空'))
      }
      this.list = this.columns
      this.list.forEach(item => {
        if (item.start_postcode === '') {
          item.start_postcode = 'null'
        } else if (item.end_postcode === '') {
          console.log(123655)
          item.end_postcode = 'null'
        }
      })
      this.$request
        .batchRemoteData({ remote_type_id: this.remote_type_id, list: this.list })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.showImport = false
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    getCountry() {
      this.$request.getCountriesList().then(res => {
        this.countryList = res.data.map(item => {
          return {
            id: item.id,
            code: item.code,
            name: item.name,
            code_name: item.code + '---' + item.name
          }
        })
      })
    },
    onSelectChange(selection) {
      this.selectIDs = selection.map(item => item.id)
    },
    onBatchDel() {
      if (!this.selectIDs || !this.selectIDs.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$request.delRemoteDestination({ ids: this.selectIDs }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.id = ''
      this.form = {
        name: '',
        remark: ''
      }
    },
    clearImport() {
      this.listVal = ''
    }
  }
}
</script>

<style lang="scss">
.input-box {
  width: 35%;
}
.flex-1 {
  flex: 1;
}
.search {
  width: 80%;
}
.bottom-btn {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.red-color {
  color: red;
}
.import-container {
  .table-text {
    display: flex;
    margin: 0 0 10px 120px;
    .table-item {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
