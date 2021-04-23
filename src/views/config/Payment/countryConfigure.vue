<template>
  <div>
    <div class="select-box">
      <add-btn @click.native="addCountry">{{ $t("添加") }}</add-btn>
    </div>
    <el-table
      :data="countryData"
      v-loading="tableLoading"
      class="data-list country"
      border
      stripe
      height="550"
    >
      <el-table-column width="100px" align="center">
        <template>
          <i class="el-icon-sort icon-fonts"></i>
        </template>
      </el-table-column>
      <!-- 前缀字符 -->
      <el-table-column prop="name" :label="$t('国家/地区')"> </el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('状态')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeCountry($event, scope.row.enabled, scope.row.id)"
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
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <!-- 删除 -->
          <el-button
            class="btn-light-red"
            @click="deleteCountry(scope.row.id)"
            >{{ $t("删除") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
    <div class="sort-sty">
      *{{ $t("拖拽行可以进行排序") }}
      <el-button @click="rowUpdate" class="btn-deep-purple save-sort">{{
        $t("保存排序结果")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
import Sortable from 'sortablejs'
export default {
  components: {
    AddBtn
  },
  data () {
    return {
      countryData: [],
      countrySendData: [],
      tableLoading: false
    }
  },
  created () {
    this.getCountryList()
  },
  methods: {
    // 获取国家/地区数据
    getCountryList () {
      this.tableLoading = true
      this.$request.countryLocation().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.countryData = res.data
          this.countrySendData = [...res.data]
          console.log('countryData')
          this.$nextTick(() => {
            this.rowDrop()
          })
        }
      })
    },
    // 添加国家/地区
    addCountry () {
      dialog({ type: 'setCountry' }, () => {
        this.getCountryList()
      })
    },
    // 删除国家地区
    deleteCountry (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCountryLocation(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCountryList()
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
    // 国家地区 开启或关闭
    changeCountry (event, enabled, id) {
      console.log(event, 'event')
      if (event === 0) {
        this.$confirm(this.$t('停止支持该国家后，再次开启时需重新添加支持仓库与路线'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$request.closeCountryLocation(id, event).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getCountryList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        })
      } else {
        this.$request.closeCountryLocation(id, event).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getCountryList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 确定拖拽 国家地区
    rowUpdate () {
      // eslint-disable-next-line camelcase
      const ids = this.countrySendData.map(({ id, name }, index) => ({ id, index, name }))
      console.log(ids)
      this.countryData = []
      this.$request.countryLocationIndex(ids).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getCountryList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 国家地区 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.country tbody')
      console.log(tbody, 'tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.countrySendData.splice(oldIndex, 1)[0]
          this.countrySendData.splice(newIndex, 0, oldItem)
        }
      })
    }
  }
}

</script>
<style scoped>
</style>
