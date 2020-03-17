<template>
  <div class="line-add-container">
    <el-form label-position="top" :model="form" ref="form">
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>*线路名称</div>
            <el-input placeholder="请输入内容" v-model="form.cn_name"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <div>*支持仓库</div>
            <el-select
              v-model="form.warehouses"
              multiple
              filterable
              @change="supportWarehouse"
              class="country-select"
              placeholder="请选择仓库">
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.warehouse_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <div>*支持国家/地区</div>
            <el-select
              v-model="form.countries"
              :disabled="!this.form.warehouses.length"
              multiple
              filterable
              class="country-select"
              placeholder="请选择国家/地区">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.cn_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <!-- <el-col :span="10" class="country-btn">
            <el-button type="primary" @click="onAddCountry">+ 新增国家/地区</el-button>
          </el-col> -->
        </el-row>
      </el-form-item>
      <el-form-item>
        <div>*参考时效</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.reference_time" placeholder="例：5-12工作日/日"></el-input>
          </el-col>
          <!-- <el-col :span="4">
            <el-input v-model="referenceTime.minTime" placeholder="最小天数"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="referenceTime.maxTime" placeholder="最大天数" class="max-time"></el-input>
          </el-col>
          <el-col :span="4">
            <el-select class="select-box" v-model="referenceTime.symbol">
              <el-option label="工作日" value="工作日"></el-option>
              <el-option label="日" value="日"></el-option>
            </el-select>
          </el-col> -->
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>{{'*首重' + this.localization.weight_unit}}</div>
            <el-input v-model="form.first_weight" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="10">
            <div>{{'*首费' + this.localization.currency_unit}}</div>
            <el-input v-model="form.first_money" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>{{'*续重' + this.localization.weight_unit}}</div>
            <el-input v-model="form.next_weight" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="10">
            <div>{{'*续费' + this.localization.currency_unit}}</div>
            <el-input v-model="form.next_money" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>{{'*最小重量' + this.localization.weight_unit}}</div>
            <el-input v-model="form.min_weight" placeholder="请输入内容"></el-input>
          </el-col>
           <el-col :span="10">
             <div>{{'*最大重量' + this.localization.weight_unit}}</div>
            <el-input v-model="form.max_weight" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>*体积系数</span>
              <el-tooltip class="item" effect="dark" content="主要用于计算包裹体积重量（5000或6000），如：长*高*宽/系数" placement="top">
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
            <el-input v-model="form.factor" placeholder="请输入内容"></el-input>
          </el-col>
          <!-- 计重模式 -->
          <el-col :span="10">
             <div>
              <span>计重模式</span>
              <el-tooltip class="item" effect="dark" content="勾选表示按实际重量和体积重量两者取大计算" placement="top">
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
              <el-checkbox v-model="form.has_factor">考虑体积重</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>*线路类型</div>
            <el-checkbox-group v-model="form.types">
              <el-checkbox v-for="item in typeList" :key="item.id" :label="item.id">
                {{item.cn_name}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 设为推荐 -->
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>
              <span>设为推荐</span>
              <el-tooltip class="item" effect="dark" content="设为推荐后，该路线标为推荐路线。" placement="top">
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
            <el-radio-group v-model="form.is_great_value">
              <el-radio :label="1">推荐</el-radio>
              <el-radio :label="0">不推荐</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 清关编码 -->
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <!-- <div>清关编码</div> -->
            <div>
              <span>清关编码</span>
              <el-tooltip class="item" effect="dark" content="开启表示需要提供收件人清关编码。" placement="top">
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
              <el-switch
                v-model="form.need_clearance_code"
                active-text="开"
                :active-value="1"
                :inactive-value="0"
                inactive-text="关"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
          </el-col>
          <el-col :span="10" v-if="form.need_clearance_code === 1">
            <div>清关备注</div>
            <el-input v-model="form.clearance_code_remark" placeholder="请输入清关备注"
            :rows="2" type="textarea"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 下单是否需要身份证 -->
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>
              <span>下单是否需要身份证</span>
              <!-- <el-tooltip class="item" effect="dark" content="开启表示需要提供收件人清关编码。" placement="top">
                <span class="el-icon-question icon-info"></span>
              </el-tooltip> -->
            </div>
              <el-switch
                v-model="form.need_id_card"
                active-text="开"
                :active-value="1"
                :inactive-value="0"
                inactive-text="关"
                active-color="#13ce66"
                inactive-color="gray">
              </el-switch>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 路线icon -->
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <div>*路线icon</div>
            <el-select
              v-model="form.icon"
              class="country-select"
              @change="onSelectChange"
              placeholder="请选择路线icon">
              <el-option
                v-for="item in iconList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10" class="country-btn">
            <el-button type="primary" @click="addIcon">+ 新增icon</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- icon预览 -->
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>icon预览</div>
            <!-- {{icon.icon}} -->
            <div class="icon-img" v-if="icon.icon">
              <span style="cursor:pointer;"
                @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${icon.icon}`, imgVisible=true">
                  <img :src="`${$baseUrl.IMAGE_URL}${icon.icon}`" style="width: 100px;">
              </span>
            </div>
            <div v-else>
              <span>无</span>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>*备注</div>
            <el-input v-model="form.remark" placeholder="请输入内容" :rows="4" type="textarea"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="sava-btn" :loading="$store.state.btnLoading" @click="saveLine">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="imgVisible" size="small">
    <div class="img_box">
      <img :src="imgSrc" class="imgDialog">
    </div>
  </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        cn_name: '',
        warehouses: '',
        countries: '',
        first_weight: '',
        first_money: '',
        next_weight: '',
        next_money: '',
        max_weight: '',
        factor: '',
        has_factor: '',
        min_weight: '',
        reference_time: '',
        types: [],
        is_great_value: '',
        icon: '',
        need_id_card: '',
        remark: '',
        clearance_code_remark: '',
        need_clearance_code: 0
      },
      referenceTime: {
        minTime: '',
        maxTime: '',
        symbol: '工作日'
      },
      value: [],
      options: [],
      iconList: [],
      warehouseList: [], // 获取全部仓库
      typeList: [],
      localization: {},
      warehouseIds: [], // 保存支持仓库的id
      imgVisible: false,
      imgSrc: '',
      icon: {}
    }
  },
  created () {
    this.getProp()
    this.getWarehouse()
    this.getIcon()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    // 编辑时拉取的数据
    getList () {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        const warehouses = res.data.warehouses.map(item => item.id)
        this.form = res.data
        this.icon = res.data.icon
        this.form.icon = res.data.icon.id
        this.form.types = res.data.types.map(item => item.id)
        this.form.countries = res.data.countries.map(item => item.id)
        this.form.warehouses = res.data.warehouses.map(item => item.id)
        this.form.has_factor = Boolean(res.data.has_factor)
        this.supportWarehouse(warehouses)
      })
    },
    onSelectChange (e) {
      console.log(e)
      this.icon = this.iconList.find(item => item.id === e)
      // console.log(this.form.icon)
    },
    supportWarehouse (item) {
      this.warehouseIds = item
      if (this.warehouseIds) {
        this.searchCountry()
      }
    },
    // 获取全部路线icon
    getIcon () {
      this.$request.getAllIcon().then(res => {
        if (res.ret) {
          this.iconList = res.data
        }
      })
    },
    // 获取多选框
    getProp () {
      this.$request.getProps().then(res => {
        if (res.ret) {
          this.typeList = res.data
          this.localization = res.localization
          console.log(this.typeList)
        }
      })
    },
    // 跳转到增加icon
    addIcon () {
      this.$router.push({ name: 'IconAdd' })
    },
    // 获取支持国家数据
    searchCountry () {
      console.log(111)
      this.$request.supportCountry({
        warehouseIds: this.warehouseIds
      }).then(res => {
        if (res.ret) {
          this.options = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取全部支持仓库
    getWarehouse () {
      this.$request.getAllWarehouse().then(res => {
        this.warehouseList = res.data
      })
    },
    saveLine () {
      console.log(Number(this.form.has_factor), 'has_factor')
      if (this.form.cn_name === '') {
        return this.$message.error('请输入线路名称')
      } else if (this.form.warehouses === '') {
        return this.$message.error('请选择支持仓库')
      } else if (this.form.countries === '') {
        return this.$message.error('请选择支持国家或地区')
      } else if (this.form.first_weight === '') {
        return this.$message.error('请输入首重')
      } else if (this.form.first_money === '') {
        return this.$message.error('请输入首费')
      } else if (this.form.next_weight === '') {
        return this.$message.error('请输入续重')
      } else if (this.form.next_money === '') {
        return this.$message.error('请输入续费')
      } else if (this.form.min_weight === '') {
        return this.$message.error('请输入最小重量')
      } else if (this.form.max_weight === '') {
        return this.$message.error('请输入最大重量')
      } else if (this.form.factor === '') {
        return this.$message.error('请输入体积系数')
      } else if (!this.form.types[0]) {
        return this.$message.error('请选择线路类型')
      } else if (this.form.remark === '') {
        return this.$message.error('请输入备注')
      }
      if (this.$route.params.id) { // 编辑状态
        this.$request.saveEditLine(this.$route.params.id, {
          ...this.form,
          has_factor: Number(this.form.has_factor)
        }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            // this.$router.push({ name: 'linelist' })
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else { // 新建状态
        this.$request.updateLines({
          ...this.form,
          has_factor: Number(this.form.has_factor) }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            // this.$router.push({ name: 'linelist' })
            this.$router.go(-1)
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
}
</script>
<style lang="scss">
.line-add-container {
  background-color: #fff !important;
  .country-select {
    width: 100%;
  }
  .sava-btn {
    min-width: 100px;
  }
  .icon-info {
    color: #74B34F;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .max-time {
    position: relative;
    &::before {
      content: '—';
      position: absolute;
      left: -22px;
    }
  }
  .select-box {
    width: 100%;
  }
  .country-btn {
    margin-top: 40px;
    .el-button--primary {
      background-color: #EAECF5;
      border-color: #EAECF5;
      color: #3540A5;
    }
  }
  .el-tag.el-tag--info {
    border-color: #3540A5;
    color: #3540A5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540A5;
    background-color: #fff;
  }
  .icon-img {
    width: 100px;
    img {
      width: 100%;
    }
  }
  .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
}
</style>
