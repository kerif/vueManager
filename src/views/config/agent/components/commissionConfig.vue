<template>
  <div class="commission-config">
    <div class="commission-box">
      <el-form label-width="100px">
        <el-form-item :label="$t('分成方式')">
          <el-select v-model="config.type">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('计佣金额')">
          <el-radio-group v-model="config.mode">
            <el-radio :label="0">{{ $t('应付总额（不含优惠券、积分抵扣等）') }}</el-radio>
            <el-radio :label="1">{{ $t('应付运费（不含增值服务、优惠券、积分抵扣等）') }}</el-radio>
            <el-radio :label="2">{{ $t('实付总额') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('默认佣金')">
          <el-input class="ipt" v-model="config.value">
            <template slot="append">
              {{ config.type === 1 ? '%' : localization.currency_unit }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('客户首单金额')">
          <el-input class="ipt" v-model="config.first_order_value">
            <template slot="append">
              {{ localization.currency_unit }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-table :data="showLines" border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column :label="$t('线路名称')" prop="name"></el-table-column>
            <el-table-column :label="$t('分成方式')">
              <template slot-scope="scope">
                <el-select v-model="config.rules[scope.row.express_line_id].type" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              :label="`值（比例%/金额${localization.currency_unit || ''}/单位金额${
                localization.currency_unit || ''
              }）`"
            >
              <template slot-scope="scope">
                <el-input v-model="config.rules[scope.row.express_line_id].value" type="number">
                  <template slot="append">
                    {{
                      config.rules[scope.row.express_line_id].type === 1
                        ? '%'
                        : localization.currency_unit
                    }}
                  </template>
                </el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="lineList.length"
        :current-page.sync="page"
        :page-size="2"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          id: 1,
          name: this.$t('按比例提成')
        },
        {
          id: 2,
          name: this.$t('按固定金额提成')
        },
        {
          id: 3,
          name: this.$t('按计费重量计佣设置每单位重量佣金')
        }
      ],
      page: 1
    }
  },
  props: {
    localization: {
      type: Object,
      default: () => {}
    },
    lineList: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    showLines() {
      if (this.lineList.length) {
        const page = this.page
        return this.lineList.slice((page - 1) * 2, page * 2)
      } else {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.commission-box {
  background-color: #f6f6f6;
  padding: 25px 25px 20px 15px;
  margin-bottom: 15px;
}
.ipt {
  max-width: 150px !important;
  margin-bottom: 15px;
}
.pagination {
  text-align: right;
}
</style>
