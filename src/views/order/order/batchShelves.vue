<template>
  <div class="batch-shelves-container">
    <el-form label-position="top">
      <!-- 公告标题 -->
      <el-form-item :label="$t('下载模版')">
        <span class="import-sty">{{
          $t('下载对应模版，如实填写批量下单表后，请以Excel形式保存，点击第二步上传')
        }}</span
        ><br />
        <el-row>
          <el-col :span="10">
            <el-button @click="uploadList">{{ $t('下载模版') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('上传模版')">
        <el-row>
          <el-col :span="20">
            <el-upload
              class="upload-demo"
              action=""
              :limit="1"
              :on-remove="onFileRemove"
              :file-list="fileList"
              :on-exceed="handleExceed"
              :before-upload="beforeUploadImg"
              :http-request="uploadBaleImg"
            >
              <el-button size="small" type="primary">{{ $t('点击上传') }}</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="logisticsList"
          stripe
          border
          class="data-list"
          v-loading="tableLoading"
          height="350"
        >
          <el-table-column type="index" width="55" align="center"></el-table-column>
          <el-table-column :label="$t('仓库')" prop="user_id"> </el-table-column>
          <el-table-column :label="$t('货位')"></el-table-column>
          <!-- 商品名称 -->
          <el-table-column :label="$t('上架数量')" prop="package_name"> </el-table-column>
          <el-table-column :label="$t('包裹')" prop="express_num"></el-table-column>
          <el-table-column :label="$t('操作')" width="260">
            <template>
              <!-- 轨迹 -->
              <el-button class="btn-green">{{ $t('详细') }}</el-button>
              <!-- 删除 -->
              <el-button class="btn-light-red">{{ $t('删除') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="saveImport"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.batch-shelves-container {
  background-color: #fff !important;
}
</style>
