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
          :props="defaultProps"
        >
        </el-tree>
        <el-button class="save-btn" @click="confirmSubmit" type="primary">{{
          $t('保存')
        }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCheckedChild } from '@/utils'
export default {
  name: 'modifyPermissions',
  data() {
    return {
      permissionMenu: [],
      defaultShowNodes: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  computed: {
    defaultChecked() {
      return getCheckedChild(this.permissionMenu)
    }
  },
  methods: {
    getList() {
      this.$request.getPermissions(this.$route.params.id).then(res => {
        // this.permissionMenu = res.data
        if (res.ret) {
          // this.permissionMenu = res.data.map(item => {
          //   return {
          //     ...item,
          //     child: item.child.map(item => ({ ...item, name: item.name })),
          //     name: item.name,
          //     id: `${item.id}-1`
          //   }
          // })
          this.formatIds(res.data)
          this.permissionMenu = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    formatIds(arr) {
      arr.forEach(ele => {
        if (ele.child) {
          this.formatIds(ele.child)
        } else if (ele.tag) {
          ele.id = `${ele.id}-1`
        }
        ele.name = this.$t(ele.name)
      })
    },
    confirmSubmit() {
      let permissions = this.$refs.tree.getCheckedKeys(true)
      this.$request.updatePermissions(this.$route.params.id, { permissions }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
    permissionMenu: {
      handler() {
        this.permissionMenu.forEach(item => {
          this.defaultShowNodes.push(item.id)
        })
      }
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
