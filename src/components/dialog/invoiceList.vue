<template>
  <el-drawer size="85%" :visible.sync="show" :title="$t('创建发货单')" class="invoice-container">
    <el-form :model="form" class="form-box" label-width="180px">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('目的地')">
            <el-select v-model="form.value">
              <el-option></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('仓库')">
            <el-select v-model="form.value">
              <el-option></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('发货单名称')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="MAWB">
            <el-select v-model="form.value">
              <el-option></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('发货单名称')">
            <el-input type="textarea" v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div>{{ $t('高级选项') }}</div>
      <el-row :gutter="20">
        <el-form-item>
          <el-radio-group v-model="form.value">
            <el-radio :label="0">{{ $t('空运发货单') }}</el-radio>
            <el-radio :label="0">{{ $t('海运发货单') }}</el-radio>
            <el-radio :label="0">{{ $t('其他发货单') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <div>{{ $t('航班信息') }}</div>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('航班')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('起飞机场')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('落地机场')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('预计起飞时间')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('实际起飞时间')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('预计到达时间')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('实际到达时间')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div>{{ $t('船信息') }}</div>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('船名')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('航次')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('预计开船时间')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('实际开船时间')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('预计到达时间')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('实际到达时间')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('出发港口')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('目的港口')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Lloyds no">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('船公司名称')">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div>{{ $t('默认发件人') }}</div>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Name">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Address">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Country">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="State">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="City">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Postcode">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="出发港口 / Origin Port">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="目的港口 / Dest Port">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Goods currency">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Shipper code">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div>{{ $t('其他信息') }}</div>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Cyber Vendor Account">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Vender Customs Code">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Cyber Importer Account">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Importer ABN">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Cyber Supplier Account">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Importer CAC">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Supplier Customs Code">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Pkgs description">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Reference">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Lower value Flag">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Customer Code">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Payment Type">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="SUBMASTER">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Marks & Numbers">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Load">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Responsible Party">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      form: {
        value: ''
      }
    }
  },
  methods: {
    onConfirm() {}
  }
}
</script>

<style lang="scss">
.invoice-container {
  .form-box {
    margin: 20px;
  }
  .btn {
    margin: 20px;
    text-align: center;
  }
}
</style>
