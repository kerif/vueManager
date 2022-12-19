<template>
  <div>
    <div class="select-box">
      <!-- <el-select v-model="value" :placeholder="$t('请选择')" class="select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value" :placeholder="$t('请选择')" class="select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <el-input v-model="page_params.keyword" :placeholder="$t('请输入内容')" class="select input"></el-input>
      <el-button type="primary" @click="declareList()"> {{ $t('搜索') }}</el-button>
      <add-btn @click.native="addClassify">{{ $t('新增') }}</add-btn>
    </div>

    <el-table ref="multipleTable" @expand-change="stairExpand" :data="tableData" border style="width: 100%;margin: 20px 0px" header-align="center" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="expand">
        <!-- slot-scope="props" -->
        <template slot-scope="scope">
          <el-table :data="scope.row.children" @expand-change="second" border style="width: 100%;margin: 20px 0px" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table :data="scope.row.childrens" border style="width: 100%;" @selection-change="handleSelection">
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="parent_name" :label="$t('分类名称')"></el-table-column>
                  <el-table-column prop="name" :label="$t('中文名称')"></el-table-column>
                  <el-table-column prop="en_name" :label="$t('英文名称')"></el-table-column>
                  <el-table-column prop="name" :label="$t('所属用户')">
                    <template slot-scope="scope">
                      {{scope.row.user.name}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="created_at" :label="$t('创建时间')"></el-table-column>
                  <el-table-column :label="$t('操作')" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" @click="editClassify(scope.row.id)">{{ $t('修改') }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="parent_name" :label="$t('分类名称')"></el-table-column>
            <el-table-column prop="name" :label="$t('中文名称')"></el-table-column>
            <el-table-column prop="en_name" :label="$t('英文名称')"></el-table-column>
            <el-table-column prop="name" :label="$t('所属用户')">
              <template slot-scope="scope">
                {{scope.row.user.name}}
              </template>
            </el-table-column>
            <el-table-column prop="created_at" :label="$t('创建时间')"></el-table-column>
            <el-table-column :label="$t('操作')" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="editClassify(scope.row.id)">{{ $t('修改') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('中文名称')">
      </el-table-column>
      <el-table-column prop="en_name" :label="$t('英文名称')">
      </el-table-column>
      <el-table-column :label="$t('所属用户')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.user.name}}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('创建时间')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column :label="$t('操作')" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editClassify(scope.row.id)">{{ $t('修改') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="12">
        <div>
          <el-button type="danger" @click="removeProduct">{{ $t('删除') }}</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data() {
    return {
      page_params: {
        type: ''
      },
      options: [],
      tableData: [],
      multipleSelection: [],
      selectNum:[],
      deleteNum:[]
    }
  },
  methods: {
    declareList() {
      this.$request.declareLists({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data.map(item => {
            return {
              ...item,
              children: []
            }
          })
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        }
      })
    },
    second(row) {
      if (row.childrens.length) return
      let id = row.id
      this.$request.declareListChildren(id).then(res => {
        if (res.ret) {
          row.childrens = res.data
        }
      })
    },
    stairExpand(row) {
      if (row.children.length) return
      let id = row.id
      this.$request.declareListChildren(id).then(res => {
        if (res.ret) {
          row.children = res.data.map(item => {
            return {
              ...item,
              childrens: []
            }
          })
        }
      })
    },
    selectionChange(select){
      this.selectNum = select.map(item => item.id)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id);
    },
    handleSelection(sel) {
      this.deleteNum = sel.map(item => item.id)
    },
    removeProduct() {
      const num  = this.multipleSelection.concat(this.selectNum,this.deleteNum)
      if (num.length == 0) {
        this.$message({
          message: this.$t('请选择'),
          type: 'warning'
        });
        return
      }
      this.$request.removeProduct({ids:num}).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.declareList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    addClassify() {
      dialog({ type: 'addDeclared', state: 'add', id: '' }, () => {
        this.declareList()
      })
    },
    // 修改
    editClassify(id) {
      dialog({ type: 'addDeclared', state: 'edit', id: id }, () => {
        this.declareList()
      })
    },
  },
  created() {
    this.declareList()
  }
}
</script>
<style scoped>
.select {
  margin-right: 10px;
}
.input {
  width: 300px;
}
</style>