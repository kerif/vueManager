<template>
  <div>
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item :label="$t('清点项目')">
        <el-checkbox-group v-model="form.items">
          <el-checkbox v-for="(item, index) in items" :key="index" :label="item.code">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="default-box">
        <div class="default-title">{{ $t('清点默认值') }}:</div>
        <el-form-item :label="$t('货物属性')">
          <el-radio-group v-model="form.prop_id">
            <el-radio v-for="item in propList" :key="item.id" :label="item.id"
              >{{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('货品重量')">
          <el-input v-model="form.weight" class="ipt" :placeholder="$t('请输入重量')"></el-input
          >{{ localization.weight_unit }}
        </el-form-item>
        <el-form-item :label="$t('货品尺寸')">
          <el-input
            v-model="form.length"
            class="size-ipt"
            :placeholder="`${$t('长')}${localization.length_unit}`"
          ></el-input>
          <el-input
            v-model="form.width"
            class="size-ipt"
            :placeholder="`${$t('宽')}${localization.length_unit}`"
          ></el-input>
          <el-input
            v-model="form.height"
            class="size-ipt"
            :placeholder="`${$t('高')}${localization.length_unit}`"
          ></el-input>
        </el-form-item>
        <div class="flex-item">
          <el-form-item :label="$t('货品名称')">
            <el-input
              v-model="form.name"
              class="name-ipt"
              :placeholder="$t('请输入货品名称')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('数量')" class="number">
            <el-input v-model="form.qty" :placeholder="$t('请输入数量')"></el-input>
          </el-form-item>
        </div>
        <el-form-item :label="$t('货品分类')">
          <el-cascader
            v-model="category"
            :show-all-levels="false"
            :options="classifyList"
            :placeholder="$t('请选择')"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('货品价格')">
          <el-input v-model="form.price" class="ipt" :placeholder="$t('请输入货品价格')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('货物状态')">
          <el-radio-group v-model="form.goods_status">
            <el-radio :label="0">{{ $t('正常件') }}</el-radio>
            <el-radio :label="1">{{ $t('异常件') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSave" type="primary">{{ $t('保存') }}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        items: [],
        prop_id: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        name: '',
        qty: '',
        price: '',
        goods_status: 0,
        category: {
          id: null,
          name: null
        }
      },
      category: null,
      propList: [],
      items: [],
      localization: {},
      classifyList: [],
      options: []
    }
  },
  created() {
    this.getProp()
    this.getGoods()
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    getParentId(childId, categories) {
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i]
        if (category.id == childId) {
          return [category.id]
        } else if (category.children && category.children.length) {
          const subId = this.getParentId(childId, category.children)
          if (subId && subId.length >= 2) {
            return [category.id, ...subId]
          } else if (subId) {
            return [category.id, subId[0]]
          }
        }
      }
      return null
    },
    getList() {
      this.$request.getUnpackConfig().then(res => {
        if (res.ret) {
          if (res.data.default) {
            for (let key in this.form) {
              if (Object.hasOwnProperty.call(this.form, key)) {
                this.form[key] = res.data.default[key]
              }
            }
            this.form.prop_id = res.data.default.prop_id == null ? '' : res.data.default.prop_id
            const categoryIds = this.getParentId(
              res.data.default && res.data.default.category && res.data.default.category.id,
              this.options
            )
            console.log(categoryIds, 'categoryIds')
            if (categoryIds && categoryIds.length > 0) {
              this.category = categoryIds
            } else {
              this.category = [
                res.data.default && res.data.default.category && res.data.default.category.id
              ]
            }
          }
          this.items = res.data.items
          this.form.items = res.data.items.filter(item => item.status == 1).map(item => item.code)
        }
      })
    },
    getProp() {
      this.$request.getProps().then(res => {
        this.propList = res.data
        this.localization = res.localization
      })
    },
    getGoods() {
      this.$request.getAllTree().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.options = res.data
            this.classifyList = res.data.map(item => {
              return {
                value: item.id,
                label: item.name,
                children:
                  item.children < 1
                    ? undefined
                    : item.children.map(item => {
                        return {
                          value: item.id,
                          label: item.name,
                          children:
                            item.children < 1
                              ? undefined
                              : item.children.map(item => {
                                  return {
                                    value: item.id,
                                    label: item.name
                                  }
                                })
                        }
                      })
              }
            })
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    findCategoryNameById(id, categories) {
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i]
        if (category.id === id) {
          return category.name
        }
        if (category.children && category.children.length > 0) {
          const childResult = this.findCategoryNameById(id, category.children)
          if (childResult) {
            return childResult
          }
        }
      }
      return null
    },
    handleChange(val) {
      console.log(val, 'valll')
      if (val.length > 1) {
        this.form.category = {
          id: val[val.length - 1],
          name: this.findCategoryNameById(val[val.length - 1], this.options)
        }
      } else {
        this.form.category = {
          id: val[0],
          name: this.findCategoryNameById(val[0], this.options)
        }
      }
    },
    onSave() {
      let params = {
        ...this.form,
        items: []
      }
      this.items.forEach(item => {
        this.form.items.forEach(ele => {
          if (item.code == ele) {
            const param = {
              name: item.name,
              status: 1
            }
            params.items.push(param)
          }
        })
      })
      this.$request.updateUnpackConfig(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
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
</script>

<style>
.default-box {
  margin-top: 20px;
}
.default-title {
  margin: 0 0 20px 0;
}
.size-ipt {
  width: 10%;
  margin-right: 10px;
}
.flex-item {
  display: flex;
  align-items: center;
}
.name-ipt {
  width: 500px;
}
.ipt {
  width: 45%;
}
.number {
  margin-left: 50px;
}
</style>
