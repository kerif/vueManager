<template>
  <el-drawer :title="$t('同步到文章')" class="ai-content-drawer" :visible.sync="drawer" size="40%">
    <div class="sync-drawer">
      <notice-add isComponent :isClose="!drawer" :content="content" @confirm="drawer = false" />
    </div>
  </el-drawer>
</template>
<script>
import NoticeAdd from '@/views/config/notice/NoticeAddEdit.vue'
export default {
  data() {
    return {
      articleContent: this.content
    }
  },
  props: {
    show: Boolean,
    content: String
  },
  computed: {
    drawer: {
      get() {
        return this.show
      },
      set(newValue) {
        this.$emit('update:show', newValue)
      }
    }
  },
  components: {
    NoticeAdd
  }
}
</script>
<style lang="scss">
.ai-content-drawer {
  .el-dialog__close {
    color: inherit !important;
  }
  .sync-drawer {
    padding: 0 20px;
  }
}
</style>
