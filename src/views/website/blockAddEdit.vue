<template>
  <div class="block-edit-container">
    <el-form label-position="top">
      <!-- 标题 -->
      <el-form-item :label="$t('区块名')" v-if="this.status === 'origin'">
        <el-row>
          <el-col :span="10"
            ><span>{{ params.name }}</span></el-col
          >
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('标签')" v-if="this.status === 'origin'">
        <el-row>
          <el-col :span="10"
            ><el-input :placeholder="$t('请输入标签')" v-model="params.description"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('区块说明')" v-if="this.status === 'others'">
        <el-row>
          <el-col :span="10">
            <span>{{ params.description }}</span>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 区块详情 -->
      <el-form-item :label="this.status === 'origin' ? $t('区块详情') : $t('内容')">
        <el-row>
          <el-col :span="20">
            <editor :content="params.content" @submit="saveNotice" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import editor from '@/components/editor.vue'
export default {
  components: { editor },
  data() {
    return {
      params: {
        name: '',
        content: '',
        description: ''
      },
      editor: null,
      status: ''
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
      this.status = this.$route.params.status
    }
  },
  methods: {
    getList() {
      this.$request.getBlocksDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.name = res.data.name
          this.params.content = res.data.content
          this.params.description = res.data.description
        }
      })
    },
    saveNotice(data) {
      this.params.content = data
      if (!this.params.description) {
        return this.$message.error(this.$t('请输入标签'))
      }
      this.$request.updateBlocks(this.$route.params.id, this.params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.tips,
            type: 'success'
          })
          this.$router.go(-1)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.block-edit-container {
  background-color: #fff !important;
  padding:0 16px 16px 16px;
}
</style>
