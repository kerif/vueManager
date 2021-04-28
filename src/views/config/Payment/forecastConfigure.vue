<template>
  <div class="settings-container">
    <el-form>
      <!-- 物品属性 -->
      <el-form-item :label="$t('物品属性：')">
        <el-tag
          :key="item.id"
          v-for="item in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(item.id)"
        >
          {{ item.cn_name }}
        </el-tag>
        <el-button class="btn-light-red" @click="addProps">{{ $t('添加属性') }}</el-button>
        <el-button
          class="btn-deep-purple others-btn"
          v-for="item in formatLangData"
          :key="item.id"
          @click="onProps(item)"
          >{{ item.name }}</el-button
        >
      </el-form-item>
      <el-form-item :label="$t('物品属性选择方式：')">
        <el-radio-group class="radio-sty" @change="changeBasic">
          <el-radio :label="5">{{ $t('单选') }}</el-radio>
          <el-radio :label="7">{{ $t('多选') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 未入库丢包预警 -->
      <el-form-item>
        <span class="no-warehouse">{{ $t('未入库丢包预警') }}</span>
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            $t('开启后，若预报包裹超过设定时间未入库，将会在包裹列表进行提示，表示包裹有丢失风险')
          "
          placement="top"
        >
          <span class="el-icon-question icon-question"></span>
        </el-tooltip>
        <el-radio-group v-model="basic.package_warning" @change="changeBasic" class="radio-sty">
          <el-radio :label="5">{{ $t('5天') }}</el-radio>
          <el-radio :label="7">{{ $t('7天') }}</el-radio>
          <el-radio :label="10">{{ $t('10天') }}</el-radio>
          <el-radio :label="0">{{ $t('不开启') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 入库是否必填尺寸 -->
      <el-form-item :label="$t('入库是否必填尺寸：')">
        <el-switch
          v-model="basic.size"
          @change="changeBasic($event)"
          :active-text="$t('开')"
          :inactive-text="$t('关')"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
      <!-- 入库是否必填货位 -->
      <el-form-item :label="$t('入库是否必填货位：')">
        <el-switch
          v-model="basic.location"
          @change="changeBasic($event)"
          :active-text="$t('开')"
          :inactive-text="$t('关')"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      languageData: [],
      dynamicTags: [],
      basic: {
        size: '',
        location: '',
        package_warning: 0
      }
    }
  },
  created() {
    this.getProps()
    this.getBasic()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    // 基础配置 修改语言
    onProps(item) {
      console.log(item, 'item')
      dialog({ type: 'propsLang', lang: item, dynamicTags: this.dynamicTags }, () => {
        this.getProps()
      })
    },
    // 添加属性
    addProps() {
      dialog({ type: 'addPackage' }, () => {
        this.getProps()
      })
    },
    changeBasic() {
      this.$request
        .updateBasic({
          size: this.basic.size,
          location: this.basic.location,
          package_warning: this.basic.package_warning
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getBasic()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 获取入库是否必填
    getBasic() {
      this.$request.getBasic().then(res => {
        if (res.ret) {
          this.basic.size = res.data.size
          this.basic.location = res.data.location
          this.basic.package_warning = res.data.package_warning
        }
      })
    },
    handleClose(id) {
      console.log(id, 'id')
      this.dynamicTags.splice(this.dynamicTags.indexOf(id), 1)
      this.$request
        .deleteProps({
          DELETE: [id]
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getProps()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 获取物品属性
    getProps() {
      this.$request.getPackage().then(res => {
        if (res.ret) {
          this.dynamicTags = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style scoped></style>
