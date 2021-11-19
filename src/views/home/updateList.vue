<template>
  <div class="updates-container">
    <div class="timeline-box">
      <el-timeline class="timeline">
        <el-timeline-item
          placement="top"
          v-for="item in updateList"
          :key="item.id"
          :timestamp="item.created_at"
          size="large"
        >
          <div>
            <div class="title-box">
              <div class="title">{{ item.title }}</div>
              <div
                class="detail"
                @click="$router.push({ name: 'systemNotice', params: { id: item.id } })"
              >
                {{ $t('展开') }} &gt;&gt;
              </div>
            </div>
            <div class="content">
              <div v-html="item.content"></div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      updateList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.getSystem().then(res => {
        if (res.ret) {
          this.updateList = res.data.slice(0, 20).map(item => {
            const content = item.content.replaceAll(/<img.*?>/gi, '')
            return {
              id: item.id,
              title: item.title,
              content: content,
              created_at: item.created_at.split(' ')[0]
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.updates-container {
  min-height: 100vh;
  background-color: #fff !important;
  .timeline-box {
    padding: 50px 0 0 70px;
  }
  .timeline {
    width: 80%;
    margin: 0 auto;
    .el-timeline-item__node {
      background-color: #fff;
      border: 4px solid #3540a5;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
    }
    .el-timeline-item__tail {
      left: 6px;
      border-color: #7e8bff;
    }
    .el-timeline-item__timestamp {
      position: absolute;
      color: #6c757d;
      font-size: 15px;
      left: -90px;
    }
  }
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .title {
    font-size: 18px;
  }
  .detail {
    cursor: pointer;
    color: #3540a5;
  }
  .content {
    background-color: #f8f9fa;
    padding: 20px 15px;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 4px;
    color: #6c757d;
    max-height: 400px;
    overflow-y: auto;
    box-sizing: border-box;
  }
}
@media (min-width: 1199px) {
  .updates-container {
    .content {
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #3640a5;
      }
      &::-webkit-scrollbar-track {
        background-color: #e5e5e5;
      }
    }
  }
}
</style>
