<template>
    <div class="modify-permissions-container">
      <el-row>
        <el-col :span="12">
          <el-tree
            :data="permissionMenu"
            show-checkbox
            node-key="id"
            class="tree"
            ref="tree"
            :default-expanded-keys="defaultShowNodes"
            :default-checked-keys="defaultChecked"
            :props="defaultProps">
          </el-tree>
          <el-button class="save-btn" @click="confirmSubmit" type="primary">保存</el-button>
         </el-col>
      </el-row>
    </div>
</template>

<script>
import { getCheckedChild } from '@/utils'
export default {
  name: 'modifyPermissions',
  data () {
    return {
      filterText: '',
      permissionMenu: [],
      data: [],
      defaultShowNodes: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  created () {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$request.getPermissions(this.$route.params.id).then(res => {
        // this.permissionMenu = res.data
        if (res.ret) {
          this.permissionMenu = res.data.map(item => {
            return {
              ...item,
              id: `${item.id}-1`
            }
          })
          console.log(this.permissionMenu)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    confirmSubmit () {
      let permissions = this.$refs.tree.getCheckedKeys(true)
      this.$request.updatePermissions(this.$route.params.id, { permissions }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          // this.$router.push({ name: 'staffgrouplist' })
          this.$router.go(-1)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  watch: {
    filterText (val) {
      console.log(val, 'val')
      this.$refs.tree.filter(val)
    },
    permissionMenu: {
      handler () {
        this.permissionMenu.forEach(item => {
          this.defaultShowNodes.push(item.id)
          console.log(this.defaultShowNodes, 'this.defaultShowNodes')
        })
      }
    }
  },
  computed: {
    defaultChecked () {
      console.log(getCheckedChild(this.permissionMenu))
      return getCheckedChild(this.permissionMenu)
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
