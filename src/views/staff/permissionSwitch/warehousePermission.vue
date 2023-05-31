<!--仓库权限界面-->
<template>
  <div>
    <div class="warehouse-container">
      <ware-house
        v-for="item in allHouse"
        :key="item.id"
        :warehouse_name="item.warehouse_name"
        :warehouse_id="warehouseId"
        :currentId="item.id"
        @makeChecked="cardChecked"
        @cancelChecked="cardCancleChecked"
      ></ware-house>
    </div>
    <button id="confirm" @click="confirm">确定</button>
  </div>
</template>

<script>
import WareHouse from './wareHouse.vue'
export default {
  props: {
    id: ''
  },
  components: {
    WareHouse
  },
  data() {
    return {
      warehouseId: [],
      userList: [],
      allHouse: []
    }
  },

  methods: {
    cardChecked(currentId) {
      if (!this.warehouseId.includes(currentId)) {
        this.warehouseId.push(currentId)
        console.log('添加了数据')
        console.log(this.warehouseId)
      }
    },
    cardCancleChecked(currentId) {
      if (this.warehouseId.includes(currentId)){
        this.warehouseId = this.warehouseId.filter(item => item != currentId)
        console.log('删除了数据')
        console.log(this.warehouseId)
      }
    },

    // 获取当前所属仓库
    getList() {
      console.log('this-id',this.id)
      this.$request.getAffiliation(this.id).then(res => {
        if (res.ret) {
          this.warehouseId = res.data.length ? res.data.map(item => item.id) : [this.allHouse[0].id]
        }
      })
    },

    // 获取全部仓库
    getAllWarehouse() {
      this.allHouse = [
        {
          id: 0,
          warehouse_name: this.$t('全部仓库')
        }
      ]
      this.$request.getAffiliationAll().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.allHouse = this.allHouse.concat(
              res.data.map(item => ({ id: item.id, warehouse_name: item.warehouse_name }))
            )
          }
        }
      })
    },

    confirm() {
      let allId = this.allHouse[0].id
      let ids = this.warehouseId.includes(allId) ? [] : this.warehouseId
      console.log(ids)
      this.$request.editAffiliations(this.id, { ids }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  },

  created() {
    this.getAllWarehouse()
    this.getList()
    // 这里的warehouseID没有数据啊
  }
}
</script>

<style lang="scss">
.warehouse-container {
  width: 100%;
  height: 460px;
  overflow: scroll;
  overflow-x: hidden;
}
#confirm {
  width: 100px;
  height: 50px;
  background-color: #3641a3;
  color: white;
  border-radius: 10px;
}
</style>