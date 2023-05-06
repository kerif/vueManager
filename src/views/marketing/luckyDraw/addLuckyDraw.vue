<template>
  <div class="main">
    <div class="addLuckyDrawContainer">
      <div class="tabs">
        <el-tabs v-model="infoType">
          <el-tab-pane :label="$t('基础信息')" name="1"></el-tab-pane>
          <el-tab-pane :label="$t('奖品信息')" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="base-info" v-if="~~infoType === 1" v-loading="this.loadingData.getLuckyDrawInfo">
        <el-form ref="form" :model="baseForm" label-width="110px">
          <div>
            <el-form-item :label="$t('活动名称')">
              <el-input
                v-model="baseForm.name"
                :placeholder="$t('请输入活动名称')"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('活动入口图片')">
              <span class="img-item" v-if="baseForm.activity_image">
                <img :src="$baseUrl.IMAGE_URL + baseForm.activity_image" alt="" class="goods-img" />
                <span class="model-box"></span>
                <span class="operate-box">
                  <i class="el-icon-zoom-in" @click="onPreview(baseForm.activity_image)"></i>
                  <i class="el-icon-delete" @click="onDeleteImg()"></i>
                </span>
              </span>
              <el-upload
                v-show="!baseForm.activity_image"
                class="avatar-uploader"
                action=""
                list-type="picture-card"
                :http-request="uploadBaleImg"
                :show-file-list="false"
              >
                <i class="el-icon-plus"> </i>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('活动规则说明')">
              <el-input
                v-model="baseForm.description"
                :placeholder="$t('请输入活动的规则和奖品信息')"
                type="textarea"
                :autosize="{ minRows: 4 }"
                style="width: 700px"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <div style="margin-top: 20px; font-weight: 600">设置时间</div>
            <div>
              <el-form-item label="活动时间">
                <el-date-picker
                  v-model="baseForm.time"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="抽奖时间">
                <el-date-picker
                  v-model="baseForm.draw_time"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="抽奖公示时间">
                <el-date-picker
                  v-model="baseForm.publish_time"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="可参与抽奖用户">
            <span style="width: 300px; margin-right: 20px">{{ getSelectUser }}</span>
            <el-button type="primary" @click="showChooseUser()">选择</el-button>
          </el-form-item>
          <div>
            <div style="margin-top: 20px; font-weight: 600">抽奖规则</div>
            <div style="display: flex">
              <el-form-item :label="$t('最多参与次数')">
                <el-input type="number" v-model="baseForm.max_num" style="width: 200px">
                  <template slot="append">{{ $t('次/人') }}</template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('每天参与次数')">
                <el-input type="number" v-model="baseForm.day_max_num" style="width: 200px">
                  <template slot="append">{{ $t('次/人') }}</template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('最多中奖次数')">
                <el-input type="number" v-model="baseForm.max_prize_num" style="width: 200px">
                  <template slot="append">{{ $t('次/人') }}</template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div style="padding-left: 300px; margin-top: 20px">
            <el-button type="primary" @click="infoType = '2'">{{ $t('下一步') }}</el-button>
          </div>
        </el-form>
      </div>
      <div class="gift-info" v-else v-loading="this.loadingData.getLuckyDrawInfo">
        <div class="gift-list">
          <div class="gift-title">
            <div>奖品列表</div>
            <div>
              <el-button type="primary" @click="showAddGift()" size="small">{{
                $t('添加奖品')
              }}</el-button>
              <!--              <el-button type="danger" @click="showAddGift()" size="small">{{-->
              <!--                $t('删除')-->
              <!--              }}</el-button>-->
            </div>
          </div>
          <el-table :data="giftList" :border="true">
            <el-table-column prop="gift_name" :label="$t('奖品名称')"> </el-table-column>
            <el-table-column :label="$t('奖品图片')" width="180">
              <template slot-scope="scope">
                <el-image
                  v-if="scope.row.gift_image"
                  :src="$baseUrl.IMAGE_URL + scope.row.gift_image"
                  style="height: 50px"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="gift_type" :label="$t('奖品类型')">
              <template slot-scope="scope">
                {{ scope.row.gift_type === 1 ? '优惠券' : '自定义' }}
              </template>
            </el-table-column>
            <el-table-column prop="gift_num" :label="$t('投放数量')"> </el-table-column>
            <el-table-column :label="$t('限定中奖用户')" width="200px">
              <template slot-scope="scope">
                <span v-for="(item) in scope.row.limit_user">
                  {{ item }} ,
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button type="text" @click="showAddGift(scope.row, scope.$index)">编辑</el-button>
                <el-button type="text" style="color: red" @click="delGift(scope.$index)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  style="color: red"
                  @click="setDefaultGift(scope.row, 1)"
                  v-show="scope.row.is_default !== 1"
                >{{ $t('设为默认奖品') }}</el-button>
                <el-button
                  type="text"
                  @click="setDefaultGift(scope.row, 0)"
                  v-show="scope.row.is_default === 1"
                >{{ $t('取消默认奖品') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="gift-probability">
          <div class="gift-title">
            <div>获奖概率</div>
            <div>
              <el-button type="primary" @click="addProbability()" size="small">{{
                $t('添加')
              }}</el-button>
<!--              <el-button type="danger" @click="showAddGift()" size="small">{{-->
<!--                $t('删除')-->
<!--              }}</el-button>-->
            </div>
          </div>
          <el-table :data="giftProbability" :border="true">
            <el-table-column prop="date" :label="$t('成长值')" width="200">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <el-input
                    type="number"
                    v-model="scope.row.limit"
                    style="width: 150px"
                    size="mini"
                  >
                    <template slot="prepend">>=</template>
                  </el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in giftList" :label="item.gift_name">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.probability[index].rate"
                  style="width: 140px"
                  size="mini"
                  type="number"
                  max="100"
                >
                  <template slot="append">%</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color: red"
                  @click="deleteProbability(scope.$index)"
                  v-if="giftProbability.length > 1"
                >{{ $t('删除') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="base-submit" v-if="~~infoType === 2">
      <el-button>{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="saveInfo" v-loading="loadingData.saveInfo">{{ $t('保存') }}</el-button>
    </div>
    <add-gift v-model="visibleData.addGift" :gift-info="activeGift" @submit="addGift"></add-gift>
    <choose-user
      v-model="visibleData.chooseUser"
      :title="$t('选择客户')"
      :chooseUser="baseForm.choose_user"
      @submit="chooseUser"
    ></choose-user>
  </div>
</template>

<script>
import AddGift from './components/addGift.vue'
import chooseUser from '@/components/chooseUser/index.vue'
import dialog from "../../../components/dialog";
export default {
  name: 'addLuckyDraw',
  components: {
    AddGift,
    chooseUser
  },
  data() {
    return {
      infoType: '1',
      baseForm: {
        name: '',
        activity_image: '',
        description: '',
        time: [],
        draw_time: [],
        publish_time: [],
        max_num: '',
        day_max_num: '',
        max_prize_num: '',
        choose_user: {}
      },
      giftList: [{ gift_name: '奖品1', gift_type: 2, gift_type_text: '自定义', sort: 1 }],
      giftProbability: [
        {
          limit: '',
          probability: [{ rate: '' }]
        }
      ],
      visibleData: {
        addGift: false,
        chooseUser: false
      },
      loadingData: {
        getLuckyDrawInfo: false,
        saveInfo: false
      },
      activeGift: null,
      pickerOptions: {
        disabledDate: time => {
          if (this.baseForm.time) {
            let start = this.baseForm.time[0]
            let end = this.baseForm.time[1]
            return (
              time.getTime() < new Date(start).getTime() || time.getTime() > new Date(end).getTime()
            )
          }
        }
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getLuckyDrawInfo(this.$route.params.id)
    }
  },
  methods: {
    getLuckyDrawInfo(id) {
      if (!id || id == 0) return false
      this.loadingData.getLuckyDrawInfo = true
      this.$request.getLuckyDrawInfo(id).then(res => {
        this.loadingData.getLuckyDrawInfo = false
        if (res.ret != 1) {
          this.$message.error(res.msg)
          return false
        }
        this.baseForm = {
          id: res.data.id,
          name: res.data.name,
          activity_image: res.data.activity_image,
          description: res.data.description,
          time: [res.data.start_time, res.data.end_time],
          draw_time: [res.data.draw_start_time, res.data.draw_end_time],
          publish_time: [res.data.draw_publish_start_time, res.data.draw_publish_end_time],
          max_num: res.data.max_num,
          day_max_num: res.data.day_max_num,
          max_prize_num: res.data.max_prize_num,
          choose_user: res.data.choose_user
        }
        this.giftList = res.data.gift_list
        this.giftProbability = this.getProbability(res.data.gift_list)
      })
    },
    showAddGift(gift = null, index = 0) {
      if (gift) gift.index = index
      this.activeGift = gift
      this.visibleData.addGift = true
    },
    addGift(giftInfo) {
      if (giftInfo.index || giftInfo.index === 0) {
        this.giftList.splice(giftInfo.index, 1, giftInfo)
      } else {
        this.giftList.push(giftInfo)
        this.giftProbability.forEach(item => {
          item.probability.push({ rate: '' })
        })
        this.updateSort()
      }
    },
    delGift(index) {
      this.giftList.splice(index, 1)
      this.giftProbability.forEach((item, key) => {
        this.giftProbability[key].probability.splice(index, 1)
      })
    },
    setDefaultGift(row, value) {
      this.$set(row, 'is_default', value)
    },
    addProbability() {
      let probability = []
      this.giftList.forEach(() => {
        probability.push({ rate: '' })
      })
      this.giftProbability.push({
        limit: '',
        probability
      })
    },
    updateSort() {
      this.giftList.forEach((item, index) => {
        this.giftList[index].sort = index + 1
      })
    },
    saveInfo() {
      let params = {
        name: this.baseForm.name,
        activity_image: this.baseForm.activity_image,
        description: this.baseForm.description,
        max_num: this.baseForm.max_num,
        day_max_num: this.baseForm.day_max_num,
        max_prize_num: this.baseForm.max_prize_num,
        choose_user: this.baseForm.choose_user,
        start_time: this.baseForm.time && this.baseForm.time[0],
        end_time: this.baseForm.time && this.baseForm.time[1],
        draw_start_time: this.baseForm.draw_time && this.baseForm.draw_time[0],
        draw_end_time: this.baseForm.draw_time && this.baseForm.draw_time[1],
        draw_publish_start_time: this.baseForm.publish_time && this.baseForm.publish_time[0],
        draw_publish_end_time: this.baseForm.publish_time && this.baseForm.publish_time[1]
      }
      if (this.baseForm.id) params.id = this.baseForm.id
      // 检查概率
      if (!this.checkProbability(this.giftProbability)) {
        return false
      }
      params.gift_list = this.transfer(this.giftList, this.giftProbability)
      this.loadingData.saveInfo = true
      this.$request.saveLuckyDraw(params).then(res => {
        this.loadingData.saveInfo = false
        if (res.ret === 0) {
          this.$message.error(res.msg)
          return false
        }
        this.$message.success('保存成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      })
    },

    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.baseForm.activity_image = res.data[0].path
        }
      })
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg() {
      this.baseForm.activity_image = ''
    },

    transfer(giftList, giftProbability) {
      giftList.forEach((item, index) => {
        let probability = []
        giftProbability.forEach(pro => {
          probability.push({ limit: pro.limit, rate: pro.probability[index].rate })
        })
        giftList[index].lucky_draw_probability = probability
      })
      return giftList
    },
    getProbability(giftList) {
      if (giftList.length > 0) {
        let getProbability = []
        giftList[0].lucky_draw_probability.forEach(item => {
          getProbability.push({ limit: item.limit, probability: [] })
        })
        giftList.forEach((gift, index) => {
          gift.lucky_draw_probability.forEach(item => {
            getProbability.forEach((v, k) => {
              if (v.limit === item.limit) {
                getProbability[k].probability.push({ rate: item.rate })
              }
            })
          })
        })
        return getProbability
      }
      return [
        {
          limit: '',
          probability: [{ rate: '' }]
        }
      ]
    },
    checkProbability(giftProbability) {
      try {
        giftProbability.forEach((pro, index) => {
          if (!pro.limit) throw `奖品概率第${index + 1}行成长值为必填项`
          let sum = 0
          pro.probability.forEach(item => {
            sum += parseFloat(item.rate)
          })
          if (sum !== 100) throw `奖品概率第${index + 1}行总概率必须为100%`
        })
        return true
      } catch (err) {
        this.$message.error(err)
        return false
      }
    },
    deleteProbability(index) {
      this.giftProbability.splice(index, 1)
    },
    showChooseUser() {
      this.visibleData.chooseUser = true
    },
    chooseUser(data) {
      this.baseForm.choose_user = data
    }
  },
  computed: {
    getSelectUser() {
      console.log(this.baseForm.choose_user)
      let str = ''
      if (this.baseForm.choose_user.userGroupList) {
        str += ' 用户组：' + this.baseForm.choose_user.userGroupList.join(', ')
      }
      if (this.baseForm.choose_user.tagList) {
        str += ' 标签：' + this.baseForm.choose_user.tagList.join(', ')
      }
      if (this.baseForm.choose_user.levelList) {
        str += ' 等级：' + this.baseForm.choose_user.levelList.join(', ')
      }
      if (this.baseForm.choose_user.customerList) {
        str += ' 用户：'
        this.baseForm.choose_user.customerList.forEach(item => {
          str += item.id + ', '
        })
      }
      return str
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  .addLuckyDrawContainer {
    background-color: white;
    padding: 20px;
    margin-bottom: 70px;
    .tabs {
      margin-bottom: 10px;
    }

    .base-info {
      .img-item {
        display: inline-block;
        border: 1px dashed #d9d9d9;
        width: 148px;
        height: 148px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 6px;
        text-align: center;
        position: relative;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          .model-box,
          .operate-box {
            opacity: 1;
            transition: all 0.5s ease-in;
          }
        }
      }
    }
    .gift-info {
      .gift-probability {
        margin-top: 30px;
      }
      .gift-title {
        font-weight: 600;
        margin-bottom: 15px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .base-submit {
    width: calc(100vw - 160px);
    display: flex;
    bottom: 0;
    position: fixed;
    justify-content: center;
    background-color: white;
    right: 0;
    padding: 15px 0;
  }
}
</style>
