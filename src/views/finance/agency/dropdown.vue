<template>
  <div class="headline">
    <el-row :gutter="10">
      <el-col :span="3">
        <!-- 下拉 -->
        <el-select v-model="value" :placeholder="$t('提现方式')" size="small">
          <el-option :label="$t('提现方式')" :value="$t('选项一')"> </el-option>
        </el-select>
      </el-col>
      <!-- 审核状态 -->
      <el-col :span="3">
        <el-select v-model="page_params.abc" :placeholder="$t('审核状态')" size="small">
          <el-option v-for="item in statusData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <!-- 搜索 -->
      <el-col :span="4">
        <el-input placeholder="请输入内容" v-model="input" clearable size="small"> </el-input>
      </el-col>
      <el-col :span="3">
        <el-button size="small" class="searchBtn">搜索</el-button>
      </el-col>
      <el-col :span="3">
        <el-button size="small" type="primary" class="unsettled" @click="editSettled(id)">
          待结算
          <i class="count">5</i>
        </el-button>
      </el-col>
      <el-col :span="5" :offset="3">
        <search-group
          v-model="page_params.keyword"
          @search="goSearch"
          :placeholder="$t('请输入关键字')"
        >
        </search-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      page_params: {
        asda: ''
      },
      value: '',
      value1: '',
      input: '',
      page: 1,
      statusData: [
        {
          id: 0,
          name: this.$t('待审核')
        },
        {
          id: 1,
          name: this.$t('审核通过')
        },
        {
          id: 2,
          name: this.$t('审核拒绝')
        }
      ]
    }
  },
  mixins: [pagination],
  components: {
    SearchGroup
  },
  methods: {
    editSettled(id) {
      this.$router.push({
        name: 'agencyCommission',
        params: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.headline {
  margin-top: 20px;
  /deep/.el-button {
    margin: 0px;
  }
  .searchBtn {
    width: 120px;
  }
  .unsettled {
    width: 120px;
    position: relative;
    .count {
      position: absolute;
      top: -5px;
      left: 105px;
      width: 20px;
      height: 16px;
      line-height: 16px;
      color: #fff;
      background-color: #c81623;
      border-radius: 50%;
    }
  }
}
</style>
