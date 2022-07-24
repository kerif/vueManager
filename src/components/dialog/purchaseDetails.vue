<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('采购详情')"
    width="45%"
    class="purchase-dialog"
    @close="clear"
  >
    <h3>{{ $t('基础信息') }}</h3>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('商品编号') }}</span>
        <span>{{ row.number }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">barcode</span>
        <span>{{ row.barcode }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('中文名称') }}</span> <span>{{ row.cn_name }}</span></el-col
      >
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('英文名称') }}</span>
        <span>{{ row.en_name }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('材质') }}</span>
        <span>{{ row.material }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('包装') }}</span>
        <span>{{ row.casing }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('颜色') }}</span>
        <span>{{ row.color }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('采购单价') }}</span>
        <span>{{ row.purchase_price }}</span></el-col
      >
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('物品总数量') }}</span>
        <span>{{ row.quantity }}</span></el-col
      >
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="10"
        ><span class="leftWidth">{{ $t('总箱数') }}</span>
        <span>{{ row.box_count }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="container-center">
      <el-col :span="12"
        ><span class="leftWidth">{{ $t('物品照片') }}</span>
        <img class="image" :src="$baseUrl.IMAGE_URL + row.image" @click="checkImg(row.image)" />
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
    </div>
    <!-- 查看图片 -->
    <el-dialog :visible.sync="imgDialog">
      <div style="text-align: center">
        <img :src="imgUrl" style="max-width: 100%" />
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      row: {},
      imgDialog: false,
      imgUrl: ''
    }
  },
  methods: {
    checkImg(url) {
      this.imgDialog = true
      this.imgUrl = this.$baseUrl.IMAGE_URL + url
    },
    clear() {}
  }
}
</script>

<style lang="scss">
.purchase-dialog {
  font-size: 16px;
  .container-center {
    margin-bottom: 20px;
  }
  .leftWidth {
    display: inline-block;
    width: 120px;
  }
  .image {
    max-width: 100px;
    cursor: pointer;
    text-align: center;
  }
}
</style>
