<template>
  <div class="box-reserved-detail">
    <div class="box-info">
      <el-row :gutter="20" class="line-box">
        <el-col :span="8"
          ><span>{{ $t('批次号') }}:</span
          ><span class="info-text">{{ boxInfo.batch_no }}</span></el-col
        >
        <el-col :span="8">
          <span>{{ $t('箱号') }}:</span
          ><span class="info-text">{{
            boxInfo.system_box && boxInfo.system_box.name
          }}</span></el-col
        >
        <el-col :span="8"
          ><span>{{ $t('创建时间') }}</span
          ><span class="info-text">{{ boxInfo.created_at }}</span></el-col
        >
      </el-row>
      <el-row :gutter="20" class="line-box">
        <el-col :span="8"
          ><span>{{ $t('单号总量') }}:</span
          ><span class="info-text">{{ boxInfo.count }}</span></el-col
        >
        <el-col :span="8"
          ><span>{{ $t('已使用') }}:</span
          ><span class="info-text">{{ boxInfo.used_count }}</span></el-col
        >
        <el-col :span="8"
          ><span>{{ $t('作废数量') }}:</span
          ><span class="info-text">{{ boxInfo.invalid_count }}</span></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8"
          ><span>{{ $t('可用数量') }}:</span
          ><span class="info-text">{{ boxInfo.enabled_count }}</span></el-col
        >
        <el-col :span="8"
          ><span>{{ $t('备注') }}:</span><span class="info-text">{{ boxInfo.remark }}</span></el-col
        >
      </el-row>
    </div>
    <div class="reserved-box">
      <div class="search-box">
        <el-input v-model="keyword" class="search-ipt"> </el-input>
        <el-button type="primary" @click="onSearch">{{ $t('搜索') }}</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        @selection-change="selectionChange"
        height="calc(100vh - 450px)"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="box_sn" :label="$t('箱/袋号')"></el-table-column>
        <el-table-column prop="status" :label="$t('状态')">
          <template slot-scope="scope">
            <span>{{
              scope.row.status === 0
                ? $t('待使用')
                : scope.row.status === 1
                ? $t('已使用')
                : $t('已作废')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('使用时间')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">{{ scope.row.updated_at }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="packages" :label="$t('对应包裹号')"> </el-table-column>
        <el-table-column prop="clearance_area" :label="$t('通关专区')"></el-table-column>
        <el-table-column prop="customs_broker" :label="$t('报关业者')"></el-table-column>
      </el-table>
      <div class="bottom-box">
        <div style="width: 300px">
          <el-button @click="onInvalid" class="invalid-btn">{{ $t('作废') }}</el-button>
        </div>
        <nle-pagination
          class="onPage"
          :pageParams="page_params"
          :notNeedInitQuery="false"
        ></nle-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      boxInfo: {},
      keyword: '',
      status: '',
      ids: [],
      tableData: []
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  created() {
    if (this.$route.query.id) {
      this.getDetail()
    }
    this.getList()
  },
  methods: {
    getDetail() {
      let id = this.$route.query.id
      this.$request.reservedDetail(id).then(res => {
        if (res.ret) {
          this.boxInfo = res.data
        }
      })
    },
    selectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    getList() {
      this.$request
        .reservedNumList({
          keyword: this.keyword,
          batch_number_id: this.$route.query.id,
          status: this.status,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data.map(item => {
              return {
                ...item,
                packages: item.packages.map(item => item.express_num).join(',')
              }
            })
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    onInvalid() {
      this.$confirm(this.$t('您确定要作废吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        let batchId = this.$route.query.id
        this.$request.invalidReservedNum(batchId, { ids: this.ids }).then(res => {
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
      })
    },
    onSearch() {
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.box-reserved-detail {
  .box-info {
    padding: 20px;
    background-color: #fff !important;
  }
  .line-box {
    margin-bottom: 28px;
  }
  .info-text {
    display: inline-block;
    margin-left: 20px;
  }
  .search-box {
    margin-bottom: 20px;
    .search-ipt {
      width: 30%;
    }
  }

  .reserved-box {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff !important;
  }

  .bottom-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .invalid-btn {
      margin-top: 20px;
    }
    .onPage {
      flex: 1;
      margin-top: 5px;
    }
  }
}
</style>
