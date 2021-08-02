<template>
  <div class="added-services">
    <!-- <el-dialog
      :title="$t('编辑/新增增值费用')"
      :visible.sync="dialogVisible"
      width="70%"
      @close="closeDialog"
    > -->
    <vxe-modal
      v-model="dialogVisible"
      @hide="closeDialog"
      id="myModal6"
      width="70%"
      show-footer
      esc-closable
      type="modal"
      :position="position"
      :title="title"
    >
      <div>
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item :label="$t('增值费用名称')">
            <el-input
              v-model="form.name"
              :placeholder="$t('请输入')"
              style="width: 217px"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('类型')"
            ><el-select v-model="form.type">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('收取方式')">
            <el-select v-model="form.is_forced">
              <el-option
                v-for="item in forcedList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('费用值')">
            <vxe-table
              border
              resizable
              show-overflow
              align="center"
              ref="xTable"
              :data="detailsList"
              :edit-config="{ trigger: 'click', mode: 'cell' }"
            >
              <vxe-table-column type="seq" title="分区" width="60"></vxe-table-column>
              <vxe-table-column field="name" title="分区名称"></vxe-table-column>
              <vxe-table-column field="areas" title="国家/地区"></vxe-table-column>
              <vxe-table-column
                field="value"
                :title="$t('值(点击修改)')"
                :edit-render="{ name: 'input', attrs: { type: 'text', placeholder: $t('请输入') } }"
              ></vxe-table-column>
            </vxe-table>
          </el-form-item>
        </el-form>
        <h5>{{ $t('增值费用名称（多语言）') }}：</h5>
        <el-form ref="langForm" :model="langForm" label-width="120px">
          <el-form-item label="English">
            <el-input
              v-model="langForm.en_US"
              :placeholder="$t('请输入')"
              style="width: 217px"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('繁体中文')">
            <el-input
              v-model="langForm.zh_TW"
              :placeholder="$t('请输入')"
              style="width: 217px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="save">{{ $t('确 定') }}</el-button>
      </span>
    </vxe-modal>
    <!-- </el-dialog> -->
    <vxe-grid
      ref="xGrid"
      resizable
      auto-resize
      show-overflow
      highlight-hover-row
      :export-config="{}"
      :tooltip-config="{ enterable: true }"
      :data="servicesList"
      v-bind="gridOptions"
    >
      <template #toolbar_buttons>
        <vxe-button>{{ $t('导入') }}</vxe-button>
        <vxe-button @click="exportDataEvent">{{ $t('导出') }}</vxe-button>
        <vxe-button @click="addServices">{{ $t('新增') }}</vxe-button>
      </template>
      <template #num1_header="{ column }">
        <el-tooltip class="item" effect="dark" :content="column.params.tips" placement="top">
          <div class="function">
            <span>{{ column.title }}</span>
            <span class="func-icon">
              <i class="el-icon-edit-outline" @click="editRowEvent(column)"></i>
              <i class="el-icon-delete" @click="deleteServices(column)"></i>
            </span>
            <!-- <vxe-button type="text" @click="editRowEvent(column)">{{ $t('编辑') }}</vxe-button> -->
            <!-- <vxe-button type="text" @click="deleteServices(column)">{{ $t('删除') }}</vxe-button> -->
          </div>
        </el-tooltip>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
export default {
  data() {
    return {
      servicesList: [],
      detailsList: [],
      title: '',
      content: '',
      position: {
        top: '10%'
      },
      gridOptions: {
        columns: [
          {
            type: 'seq',
            title: this.$t('分区'),
            fixed: 'left',
            width: 60
          },
          {
            field: 'name',
            title: this.$t('分区名称'),
            fixed: 'left',
            minWidth: 160
          },
          {
            field: 'areas',
            title: this.$t('区域'),
            fixed: 'left',
            minWidth: 400
          }
        ],
        border: true,
        align: 'center',
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons'
          }
        }
      },
      dialogVisible: false,
      serviceId: 0,
      form: {
        name: '',
        type: '',
        is_forced: ''
      },
      langForm: {
        en_US: '',
        zh_TW: ''
      },
      typeList: [
        {
          value: 1,
          label: this.$t('运费比例')
        },
        {
          value: 2,
          label: this.$t('整票固定费用')
        },
        {
          value: 3,
          label: this.$t('单箱固定费用')
        },
        {
          value: 4,
          label: this.$t('单位计费重量固定费用')
        },
        {
          value: 5,
          label: this.$t('单位实际重量固定费用')
        }
      ],
      forcedList: [
        {
          value: 0,
          label: this.$t('强制收取')
        },
        {
          value: 1,
          label: this.$t('自愿勾选')
        }
      ]
    }
  },
  created() {
    this.getServicesList()
  },
  methods: {
    // 获取增值服务列表
    getServicesList() {
      this.gridOptions.columns = [
        {
          type: 'seq',
          title: this.$t('分区'),
          fixed: 'left',
          width: 60
        },
        {
          field: 'name',
          title: this.$t('分区名称'),
          fixed: 'left',
          minWidth: 160
        },
        {
          field: 'areas',
          title: this.$t('区域'),
          fixed: 'left',
          minWidth: 400
        }
      ]
      this.$request.getServicesList(this.$route.params.id).then(res => {
        if (res.ret) {
          this.servicesList = res.data.map(item => {
            const areas = item.areas
              .map(item => item.country_name + item.area_name + item.sub_area_name)
              .join('、')
            return {
              ...item,
              areas
            }
          })
          this.servicesList.forEach(item => {
            if (item.service.length) {
              item.service.forEach(ele => {
                item[`service_${ele.id}`] = ele.value
                if (ele.type === 1 && ele.is_forced === 0) {
                  this.content = this.$t('类型：运费比例 收取方式：强制收取')
                } else if (ele.type === 2 && ele.is_forced === 0) {
                  this.content = this.$t('类型：整票固定费用 收取方式：强制收取')
                } else if (ele.type === 3 && ele.is_forced === 0) {
                  this.content = this.$t('类型：单箱固定费用 收取方式：强制收取')
                } else if (ele.type === 4 && ele.is_forced === 0) {
                  this.content = this.$t('类型：单位计费重量固定费用 收取方式：强制收取')
                } else if (ele.type === 5 && ele.is_forced === 0) {
                  this.content = this.$t('类型：单位实际重量固定费用 收取方式：强制收取')
                } else if (ele.type === 1 && ele.is_forced === 1) {
                  this.content = this.$t('类型：运费比例 收取方式：自愿勾选')
                } else if (ele.type === 2 && ele.is_forced === 1) {
                  this.content = this.$t('类型：整票固定费用 收取方式：自愿勾选')
                } else if (ele.type === 3 && ele.is_forced === 1) {
                  this.content = this.$t('类型：单箱固定费用 收取方式：自愿勾选')
                } else if (ele.type === 4 && ele.is_forced === 1) {
                  this.content = this.$t('类型：单位计费重量固定费用 收取方式：自愿勾选')
                } else if (ele.type === 5 && ele.is_forced === 1) {
                  this.content = this.$t('类型：单位实际重量固定费用 收取方式：自愿勾选')
                }
                this.gridOptions.columns.push({
                  field: `service_${ele.id}`,
                  title: ele.name,
                  params: {
                    tips: this.content
                  },
                  minWidth: 180,
                  showHeaderOverflow: true,
                  slots: {
                    header: 'num1_header'
                  }
                })
                var obj = {}
                this.gridOptions.columns = this.gridOptions.columns.reduce((item, next) => {
                  obj[next.field] ? '' : (obj[next.field] = true && item.push(next))
                  return item
                }, [])
              })
            }
          })
        }
      })
    },
    //编辑增值服务
    editRowEvent(row) {
      this.title = this.$t('编辑增值费用')
      this.dialogVisible = true
      this.detailsList = this.servicesList
      this.serviceId = +row.property.split('_')[1]
      // 获取编辑时表格数据
      this.$request.getServicesDetails(this.$route.params.id, this.serviceId).then(res => {
        if (res.ret) {
          this.form.name = res.data.name
          this.form.type = res.data.type
          this.form.is_forced = res.data.is_force
          this.langForm.en_US = res.data.name_translations.en_US
          this.langForm.zh_TW = res.data.name_translations.zh_TW
          this.detailsList = res.data.prices.map(item => {
            const name = item.region_name
            const areas = item.areas
              .map(item => item.country_name + item.area_name + item.sub_area_name)
              .join('、')
            return {
              ...item,
              name,
              areas
            }
          })
        }
      })
    },
    // 新增增值服务
    addServices() {
      this.title = this.$t('新增增值费用')
      this.dialogVisible = true
      this.detailsList = this.servicesList
    },
    // 删除增值服务
    deleteServices(column) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.serviceId = +column.property.split('_')[1]
        this.$request.deleteServices(this.$route.params.id, this.serviceId).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getServicesList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    exportDataEvent() {
      this.$refs.xGrid.openExport({
        // 默认勾选源
        original: true
      })
    },
    // 保存
    save() {
      let updateRecords = this.$refs.xTable.data
      updateRecords = updateRecords.map(item => {
        const id = item.id
        const value = item.value ? item.value : 0
        return {
          id,
          value
        }
      })
      const params = {
        ...this.form,
        regions: [...updateRecords],
        name_translations: { ...this.langForm }
      }
      if (this.title === '编辑增值费用') {
        this.$request.updateServices(this.$route.params.id, this.serviceId, params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.dialogVisible = false
            this.detailsList = []
            this.getServicesList()
            // this.$router.go(0)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.addServices(this.$route.params.id, params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.dialogVisible = false
            this.getServicesList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.detailsList.length = 0
      this.serviceId = 0
      this.form.name = ''
      this.form.type = ''
      this.form.is_forced = ''
      this.langForm.en_US = ''
      this.langForm.zh_TW = ''
    }
  }
}
</script>
<style scoped lang="scss">
.added-services {
  padding: 30px;
  overflow: hidden;
  background-color: #fff;
  .func-btn {
    float: right;
    padding-bottom: 30px;
  }
  .function {
    display: flex;
    align-items: center;
  }
  .func-icon {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 10px;
    i {
      cursor: pointer;
      font-size: 17px;
    }
    :nth-child(1) {
      color: #3540a5;
    }
    :nth-child(2) {
      color: #ff4444;
    }
  }
}
</style>
