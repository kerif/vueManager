<template>
  <div class="grade">
    <h3>{{ $t('会员等级') }}</h3>
    <!-- 添加弹窗 -->
    <el-dialog
      :title="$t('添加/编辑会员等级')"
      :visible.sync="gradeDialog"
      width="30%"
      @close="resetForm('gradeForm')"
    >
      <el-form ref="gradeForm" :model="gradeForm">
        <el-form-item :label="$t('等级名称')" prop="name">
          <el-input v-model="gradeForm.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('等级成长值') + '(>=)'" prop="growth">
          <el-input v-model="gradeForm.growth"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gradeDialog = false">取 消</el-button>
        <el-button type="primary" @click="gradeDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 等级说明弹窗 -->
    <el-dialog
      :title="$t('等级说明')"
      :visible.sync="tipsDialog"
      width="30%"
      label-width="80px"
      @close="resetForm('tipsForm')"
    >
      <el-form ref="tipsForm" :model="tipsForm">
        <el-form-item :label="$t('简体中文')" prop="cn">
          <el-input type="textarea" v-model="tipsForm.cn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('繁体中文')" prop="tw">
          <el-input type="textarea" v-model="tipsForm.tw"></el-input>
        </el-form-item>
        <el-form-item label="English" prop="en">
          <el-input type="textarea" v-model="tipsForm.en"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipsDialog = false">取 消</el-button>
        <el-button type="primary" @click="tipsDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="function-btn">
      <el-button size="small" @click="gradeDialog = true">{{ $t('添加') }}</el-button>
      <el-button size="small" @click="tipsDialog = true">{{ $t('等级说明') }}</el-button>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="name" :label="$t('等级名称')"> </el-table-column>
        <el-table-column prop="name" :label="$t('成长值') + '(>=)'"> </el-table-column>
        <el-table-column label="English">
          <template>
            <span class="el-icon-plus icon-sty"></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('繁体中文')">
          <template> <span class="el-icon-plus icon-sty"></span> </template
        ></el-table-column>
        <el-table-column prop="name" :label="$t('日本语')">
          <template> <span class="el-icon-plus icon-sty"></span> </template
        ></el-table-column>
        <el-table-column prop="name" :label="$t('操作')">
          <template>
            <el-button size="mini">{{ $t('编辑') }}</el-button>
            <el-button size="mini">{{ $t('删除') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gradeDialog: false,
      gradeForm: {
        name: '',
        growth: ''
      },
      tipsDialog: false,
      tipsForm: {
        cn: '',
        tw: '',
        en: ''
      },
      tableData: [
        {
          name: '11'
        }
      ]
    }
  },
  methods: {
    resetForm(form) {
      this.$refs[form].resetFields()
    }
  }
}
</script>
<style scoped lang="scss">
.grade {
  .function-btn {
    margin-bottom: 20px;
  }
}
</style>
