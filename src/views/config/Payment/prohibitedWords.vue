<template>
  <el-form>
    <el-form-item class="prohibited">
      <span class="prohibited-text">{{ $t('预报禁用词汇库') }}</span>
      <el-input
        type="textarea"
        :rows="2"
        :autosize="{ minRows: 2, maxRows: 4 }"
        :placeholder="$t('请输入禁用词(用,隔开)')"
        v-model="prohibited.prohibited_words"
        style="width: 60%; height: 10%; font-size: 18px"
        class="prohibited-text"
      >
      </el-input>
      <span class="prohibited-warn">{{
        $t(
          '注意: 多个禁用词汇，使用逗号分开，填写后客人预报包裹中物品名称如果包括其中一项，将会禁止提交!'
        )
      }}</span>
      <span class="prohibited-text">{{ $t('禁词匹配规则') }}</span>
      <el-radio-group v-model="prohibited.match_type">
        <el-radio :label="0">{{ $t('全匹配') }}</el-radio>
        <el-radio :label="1">{{ $t('半匹配') }}</el-radio>
      </el-radio-group>
      <el-button @click="updateProhibitedWords" class="prohibited-btn">{{ $t('保存') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      prohibited: {
        id: 0,
        prohibited_words: '',
        match_type: 0
      }
    }
  },
  created() {
    this.getProhibitedWords()
  },
  methods: {
    // 获取禁用词配置库
    getProhibitedWords() {
      this.$request.getProhibitedWords().then(res => {
        if (res.ret) {
          this.prohibited = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 修改禁用词库
    updateProhibitedWords() {
      this.$request.updateProhibitedWords(this.prohibited).then(res => {
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
      })
    }
  }
}
</script>

<style scoped lang="scss">
.prohibited {
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  .prohibited-text {
    display: flex;
    align-content: flex-start;
    margin: 5px 0;
    //font-weight: bold;
  }

  .prohibited-btn {
    display: flex;
    background-color: #4055c8;
    color: #ffffff;
    margin: 5px 0;
  }

  .prohibited-warn {
    color: orangered;
    display: flex;
    flex-direction: column;
    margin: 5px 40px;
  }

  .prohibited-radio {
    display: flex;
    flex-direction: column;
    margin-left: 10%;
  }
}
</style>
