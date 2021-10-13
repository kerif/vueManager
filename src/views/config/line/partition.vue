<template>
  <div class="partition-container">
    <div class="bottom-sty">
      <div>
        <!-- <el-button size="small" type="warning" plain>{{ $t('导入') }}</el-button>
        <el-button size="small" type="success" plain>{{ $t('导出') }}</el-button> -->
        <!-- <el-button size="small" @click="chooseTemplate" type="danger" plain>{{
          $t('选择模版')
        }}</el-button> -->
        <el-input
          size="small"
          :placeholder="$t('分区表名称')"
          v-model="input"
          class="edit"
        ></el-input>
      </div>
      <div class="addUser">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        </div>
        <el-button
          type="danger"
          v-if="this.$route.params.id"
          plain
          @click.native="selectPartition"
          >{{ $t('选用预设分区表') }}</el-button
        >
        <add-btn @click.native="addPartition">{{ $t('新增') }}</add-btn>
      </div>
    </div>
    <div class="clear"></div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        border
        stripe
        :data="addressList"
        ref="table"
        class="data-list"
        height="calc(100vh - 270px)"
      >
        <el-table-column type="index" :index="1"></el-table-column>
        <el-table-column :label="$t('分区名称')" prop="name"></el-table-column>
        <el-table-column :label="$t('分区类型')">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('国家地区') }}</span>
            <span v-else>{{ $t('国家邮编') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('启用国家/地区')" :show-overflow-tooltip="true" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">
              <span v-for="item in scope.row.areas" :key="item.id"
                >{{ item.country_name }}{{ item.area_name }}{{ item.sub_area_name }}&nbsp;</span
              >
            </span>
            <span v-else>{{ scope.row.country.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('启用国家/地区总数量')" prop="areas_count"></el-table-column>
        <el-table-column :label="$t('是否启用')" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="changeTransfer(scope.row.id, scope.row.enabled)"
              :active-text="$t('开')"
              :inactive-text="$t('关')"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          :label="item.name"
          v-for="item in formatLangData"
          :key="item.id"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row['trans_' + item.language_code]"
              class="el-icon-check icon-sty"
              @click="onLang(scope.row, item)"
            ></span>
            <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" width="140">
          <template slot-scope="scope">
            <el-button class="btn-green edit-sty" @click="editPartition(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <el-button class="btn-light-red" @click="deletePart(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
    <el-dialog :title="$t('选择模版')" :visible.sync="dialogVisible" width="35%" @close="clearTmp">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item :label="$t('*请选择预设模版')">
          <el-select v-model="form.templateId" :placeholder="$t('请选择')">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmAdd">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('选用预设分区表')"
      :visible.sync="show"
      class="dialog-preset"
      width="35%"
      @close="clearPreset"
    >
      <div class="remark">
        {{ $t('*选用预设分区表后，将在当前渠道增加分区，需设置价格表后再启用分区') }}
      </div>
      <el-form ref="form" :model="form" label-width="120px">
        <el-radio-group v-model="radio">
          <el-radio class="options" v-for="item in tmpData" :key="item.id" :label="item.id"
            >{{ item.name }} ({{ item.regions_count }}{{ $t('个分区') }})</el-radio
          ><br />
        </el-radio-group>
      </el-form>
      <span slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
export default {
  name: 'vipaddress',
  data() {
    return {
      addressList: [],
      tableLoading: false,
      languageData: [],
      dialogVisible: false,
      options: [],
      form: {
        templateId: ''
      },
      show: false,
      radio: 1,
      tmpData: [],
      input: ''
    }
  },
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  mounted() {
    this.getList()
    this.getLanguageList() // 获取支持语言
  },
  created() {
    this.getTmp()
  },
  methods: {
    // 获取分区
    async getList() {
      let res = {}
      this.tableLoading = true
      this.page_params = {
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size,
        total: this.page_params.total
      }
      if (this.$route.params.id) {
        // 获取分区模板
        res = await this.$request.getRegions(this.$route.params.id, { ...this.page_params })
      } else {
        // 获取预设分区模板
        res = await this.$request.regionTemplates(this.$route.query.id, { ...this.page_params })
      }
      this.tableLoading = false
      if (res.ret) {
        this.addressList = res.data
        this.page_params.page = res.meta.current_page
        this.page_params.total = res.meta.total
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
      } else {
        this.$notify({
          title: this.$t('操作失败'),
          message: res.msg,
          type: 'warning'
        })
      }
    },
    // 修改开关
    async changeTransfer(id, status) {
      let res = {}
      if (this.$route.params.id) {
        res = await this.$request.regionsEnabled(this.$route.params.id, id, status)
      } else {
        res = await this.$request.presetRegionsEnabled(this.$route.query.id, id, status)
      }
      if (res.ret) {
        this.$notify({
          type: 'success',
          title: this.$t('操作成功'),
          message: res.msg
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
      this.getList()
    },
    // 新增
    addPartition() {
      let status = this.$route.params.id ? 'channel' : 'partition'
      dialog(
        { type: 'partitionAddEdit', tmpId: this.$route.query.id, state: 'add', status: status },
        () => {
          this.getList()
        }
      )
    },
    // 获取模板的分区个数
    getTmp() {
      this.$request.lineRegion().then(res => {
        if (res.ret) {
          this.tmpData = res.data
        }
      })
    },
    //选用预设分区表
    selectPartition() {
      this.show = true
    },
    // 删除
    deletePart(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(async () => {
        let res = {}
        if (this.$route.params.id) {
          res = await this.$request.regionsDelete(this.$route.params.id, id)
        } else {
          res = await this.$request.deleteRegionTmp(this.$route.query.id, id)
        }
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 修改资料
    editPartition(id) {
      let status = this.$route.params.id ? 'channel' : 'partition'
      dialog(
        {
          type: 'partitionAddEdit',
          state: 'edit',
          id: id,
          status: status,
          tmpId: this.$route.query.id
        },
        () => {
          this.getList()
        }
      )
    },
    // 获取支持语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 修改语言
    onLang(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      dialog(
        {
          type: 'partitionLang',
          line: line,
          lang: lang,
          transCode: this.transCode,
          state: 'translate'
        },
        () => {
          this.getList()
        }
      )
    },
    // 获取模版数据
    getPreset() {
      this.$request.getRegionTemplate().then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    chooseTemplate() {
      this.dialogVisible = true
      this.getPreset()
    },
    clearTmp() {
      this.form.templateId = ''
    },
    clearPreset() {},
    confirmAdd() {
      if (!this.form.templateId) {
        return this.$message.error(this.$t('模版不能为空'))
      }
      this.$request.submitTmp(this.$route.params.id, this.form.templateId).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.dialogVisible = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          // this.getList()
        }
      })
    },
    confirm() {
      this.$request.copyPartitionTmp(this.$route.params.id, this.radio).then(res => {
        if (res.ret) {
          console.log(res)
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
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
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  }
}
</script>
<style lang="scss">
.partition-container {
  .addUser > .add-btn-container {
    margin-left: 10px;
  }
  .import-list {
    display: inline-block;
    margin-left: 10px;
    // text-align: right;
  }
  .remark {
    color: red;
    margin-bottom: 10px;
  }
  .addUser {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    .searchGroup {
      // width: 29.42%;
      // float: left;
      margin-right: 10px;
    }
  }
  .bottom-sty {
    width: 100%;
    // margin-top: 20px;
    margin-bottom: 10px;
    float: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .edit .el-input__inner {
      border: 1px solid #f5f5f5;
      background-color: #f5f5f5;
    }
  }
  .searchGroup {
    width: 21.5%;
    float: right;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .clear {
    clear: both;
  }
  .tips-sty {
    background-color: #f2e2b8;
    line-height: 40px;
    font-size: 14px;
    padding-left: 10px;
    margin-top: 10px;
  }
  .icon-info {
    color: #e6a344;
    font-size: 18px;
    // margin-left: 15px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .edit-sty {
    margin-right: 5px;
  }
  .options {
    display: block;
    margin-bottom: 10px;
  }
}
</style>
