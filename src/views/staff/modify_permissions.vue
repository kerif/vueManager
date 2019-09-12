<template>
    <div class="modify-permissions-container">
      <el-row>
        <el-col :span="12">
          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            class="tree"
            ref="tree"
            :filter-node-method="filterNode"
            :default-checked-keys="permisssion_checked"
            :props="defaultProps">
          </el-tree>
          <el-button class="save-btn" @click="confirmSubmit" type="primary">保存</el-button>
         </el-col>
      </el-row>
    </div>
</template>

<script>
export default {
  name: 'modifyPermissions',
  data () {
    return {
      filterText: '',
      permisssion_menu: [],
      permisssion_checked: [],
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    filterNode (value, data) {
    //   if (!value) return true
    //   return data.label.indexOf(value) !== -1
    },
    confirmSubmit () {
    // this.$confirm(this.$t('confirmSubmit'), this.$t('point'), {
    //   confirmButtonText: this.$t('confirm'),
    //   cancelButtonText: this.$t('cancel'),
    //   type: 'warning'
    // }).then(() => {
    //   this.submit()
    // })
    },
    submit () {
      this.$http.post(`u2/menu/set_priv/${this.$route.params.id}`, {
        ids: this.$refs.tree.getCheckedKeys(true).toString()
      }).then(res => {
        this.$notify({
          type: 'success',
          title: this.$t('success'),
          message: res.tips
        })
        if (this.$route.params.id === this.$store.state.vipInfo.role_id) this.$store.commit('switchPermissionMapFilterStatus', { status: false }) // 重新筛选路由
        this.$router.push({ name: 'staffgrouplist' })
      })
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style lang="scss" scope>
@import '../../styles/communalVariate.scss';
.modify-permissions-container {
  padding: 20px 50px;
}
.tree {
  margin: 10px 0;
}
.el-tree {
  cursor: default;
  border: 1px solid #d1d7e5;
}
</style>
