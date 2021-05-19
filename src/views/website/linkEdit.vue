<template>
  <div class="link-edit-container">
    <div class="lang-sty">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{ $t('建议添加3～5条链接（限制最多添加10条链接）') }}
      </p>
    </div>
    <el-form label-position="top" ref="ruleForm" class="demo-ruleForm">
      <el-form-item label="区块说明">
        <el-row>
          <el-col :span="10"
            ><span>{{ description }}</span></el-col
          >
        </el-row>
      </el-form-item>
      <!-- 标签 -->
      <el-form-item label="链接模块名称">
        <el-row>
          <el-col :span="10">
            <el-input :placeholder="$t('请输入内容')" v-model="block_name"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <div class="clear-box">
        <add-btn @click.native="addBlock">{{ $t('新增链接') }}</add-btn>
      </div>
      <el-table stripe border class="data-list" v-loading="tableLoading" :data="links">
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column :label="$t('类型')">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('单页链接') }}</span>
            <span v-if="scope.row.type === 2">{{ $t('文章链接') }}</span>
            <span v-if="scope.row.type === 3">{{ $t('外部链接') }}</span>
            <span v-if="scope.row.type === 4">{{ $t('栏目链接') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('标题')" prop="title"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-deep-purple optionBtn" @click="editBlock(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <el-button class="btn-orangey-red optionBtn" @click="editBlock(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="saveNotice()"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      description: '',
      block_name: '',
      links: [],
      tableLoading: false
    }
  },
  components: {
    AddBtn
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.websiteLink(this.$route.params.id).then(res => {
        if (res.ret) {
          this.description = res.data.description
          this.block_name = res.data.block_name
          this.links = res.data.links
        }
      })
    },
    // 编辑链接
    editBlock(id) {
      dialog({ type: 'linkAddEdit', id: id, state: 'edit' }, () => {
        this.getList()
      })
      id
    },
    // 新增 链接
    addBlock() {
      dialog({ type: 'linkAddEdit', state: 'add' }, () => {
        this.getList()
      })
    },
    saveNotice() {
      this.$request
        .updateWebsiteLink(this.$route.params.id, {
          name: this.block_name
        })
        .then(res => {
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
.link-edit-container {
  background-color: #fff !important;
  .lang-sty {
    line-height: 40px;
    color: #e6a344;
    // margin-left: 80px;
    width: 66%;
    p {
      background-color: #fdf6ed;
    }
  }
  .icon-info {
    color: #e6a344;
    font-size: 18px;
    margin-left: 15px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
</style>
