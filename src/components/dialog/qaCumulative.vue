<template>
  <el-dialog :title="$t('问答累计积分')" :visible.sync="show" @close="clear">
    <el-form label-width="220px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('积分到账之日起计算,有效期为:')">
            <el-select v-model="qaList.valid_time" :placeholder="$t('请选择')">
              <el-option
                v-for="item in dateList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button @click="addRules">{{ $t('设置规则说明') }}</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <h3>{{ $t('【提问】获取积分规则:') }}</h3>
      <el-form-item :label="$t('获取积分限制')">
        <el-input
          v-model="qaList.q_count"
          style="width: 30%"
          :placeholder="$t('请填写次数')"
        ></el-input>
        /
        <el-select v-model="qaList.q_frequency" :placeholder="$t('请选择频率')">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('符合多项时获取方式')">
        <el-radio-group v-model="qaList.q_type">
          <el-radio :label="1">{{ $t('按最高获取') }}</el-radio>
          <el-radio :label="2">{{ $t('叠加选取') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div>
        <el-button type="primary" size="small" @click="addIntegral(1)">{{ $t('新增') }}</el-button>
        <span style="display: inline-block; margin-left: 10px">{{ $t('*最多添加10条') }}</span>
      </div>
      <div style="margin-top: 20px">
        <el-table :data="pointData" border style="width: 100%">
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="word_count" :label="$t('字数') + '>='"> </el-table-column>
          <el-table-column prop="pic_count" :label="$t('图片') + '>='"> </el-table-column>
          <el-table-column prop="point" :label="$t('积分')"> </el-table-column>
          <el-table-column :label="$t('操作')">
            <template slot-scope="scope">
              <el-button class="btn-deep-blue" @click="editPoint(scope.row.id, scope.row.type)">{{
                $t('编辑')
              }}</el-button>
              <el-button class="btn-light-red" @click="deltePoint(scope.row.id, scope.row.type)">{{
                $t('删除')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider></el-divider>
      <h3>{{ $t('【回答】获取积分规则:') }}</h3>
      <el-form-item :label="$t('获取积分限制')">
        <el-input
          v-model="qaList.a_count"
          style="width: 30%"
          :placeholder="$t('请填写次数')"
        ></el-input>
        /
        <el-select v-model="qaList.a_frequency" :placeholder="$t('请选择频率')">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('符合多项时获取方式')">
        <el-radio-group v-model="qaList.a_type">
          <el-radio :label="1">{{ $t('按最高获取') }}</el-radio>
          <el-radio :label="2">{{ $t('叠加选取') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div>
        <el-button type="primary" size="small" @click="addIntegral(2)">{{ $t('新增') }}</el-button>
        <span style="display: inline-block; margin-left: 10px">{{ $t('*最多添加10条') }}</span>
      </div>
      <div style="margin-top: 20px">
        <el-table :data="pointAnswerData" border style="width: 100%">
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="word_count" :label="$t('字数') + '>='"> </el-table-column>
          <el-table-column prop="pic_count" :label="$t('图片') + '>='"> </el-table-column>
          <el-table-column prop="point" :label="$t('积分')"> </el-table-column>
          <el-table-column :label="$t('操作')">
            <template slot-scope="scope">
              <el-button class="btn-deep-blue" @click="editPoint(scope.row.id, scope.row.type)">{{
                $t('编辑')
              }}</el-button>
              <el-button class="btn-light-red" @click="deltePoint(scope.row.id, scope.row.type)">{{
                $t('删除')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      qaList: {
        valid_time: '',
        illustrate: {},
        q_type: 1,
        q_count: '',
        q_frequency: '',
        a_type: 1,
        a_count: '',
        a_frequency: ''
      },
      type: '',
      dateList: [],
      langObj: {},
      options: [
        {
          id: 0,
          name: this.$t('永久')
        },
        {
          id: 1,
          name: this.$t('每天')
        },
        {
          id: 2,
          name: this.$t('每周')
        },
        {
          id: 3,
          name: this.$t('每月')
        },
        {
          id: 4,
          name: this.$t('每年')
        }
      ],
      pointData: [],
      pointAnswerData: []
    }
  },
  methods: {
    init() {
      this.getDate()
      this.getList()
      this.getPointListQ()
      this.getPointListA()
    },
    addRules() {
      dialog(
        {
          type: 'qaExplain',
          langObj: this.langObj
        },
        data => {
          this.qaList.illustrate = data
        }
      )
    },
    addIntegral(types) {
      dialog(
        {
          type: 'qaPointTable',
          id: '',
          types
        },
        () => {
          types === 1 ? this.getPointListQ() : this.getPointListA()
        }
      )
    },
    editPoint(id, types) {
      dialog(
        {
          type: 'qaPointTable',
          id
        },
        () => {
          types === 1 ? this.getPointListQ() : this.getPointListA()
        }
      )
    },
    getDate() {
      this.$request.qaInitConfig().then(res => {
        this.dateList = res.data.valid_time_list
      })
    },
    getList() {
      this.$request.getqaDetail().then(res => {
        for (let key in this.qaList) {
          if (Object.hasOwnProperty.call(this.qaList, key)) {
            this.qaList[key] = res.data[key]
          }
        }
        this.langObj = res.data.illustrate ? res.data.illustrate : {}
      })
    },
    getPointListQ() {
      this.$request.QaListSearch({ type: 1 }).then(res => {
        this.pointData = res.data
      })
    },
    getPointListA() {
      this.$request.QaListSearch({ type: 2 }).then(res => {
        this.pointAnswerData = res.data
      })
    },
    deltePoint(id, type) {
      this.type = type
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteQa(id).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            if (this.type === 1) {
              this.getPointListQ()
            } else {
              this.getPointListA()
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    confirm() {
      this.$request.updateQa(this.qaList).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.qaList.valid_time = ''
      this.qaList.illustrate = {}
      this.qaList.q_type = 1
      this.qaList.q_count = ''
      this.qaList.q_frequency = ''
      this.qaList.a_type = 1
      this.qaList.a_count = ''
      this.qaList.a_frequency = ''
    }
  }
}
</script>

<style lang="scss">
.el-dialog__header {
  background-color: #0e102a;
}
.el-dialog__title {
  font-size: 14px;
  color: #fff;
}
.el-dialog__close {
  color: #fff;
}
</style>
