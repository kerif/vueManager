<template>
  <div class="goodsAllocation">
    <div class="overview">
      <div class="headline">{{$t('仓位概览')}}</div>
      <div>
        <el-select v-model="value" :placeholder="$t('请选择')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="shelfs">
      <div class="shelf" v-for="(item,index) in goodsAllocationList" :key="index" @click="detail">
        <div class="shelf-tag">A货区{{ index+1 }}</div>
        <div class="left-side"></div>
        <div v-for="(i,index) in item" :key="index">
          <div class="layer" v-for="(te,ind) in i.row" :key="ind">
            <div class="layer-contianer">
              <div :class="indexs==2?'boxs has':'boxs'" v-for="(te,indexs) in i.list" :key="indexs">
                <span v-if="indexs==2">20</span>
              </div>
            </div>
            <div class="layer-label">
              <div class="label-code" v-for="(te,indexs) in i.list" :key="indexs"><label>A-01-0{{ indexs+1 }}</label></div>
            </div>
          </div>
        </div>
        <div class="right-side"></div>
      </div>
      <div class="shelf" style="background-color: #DCDCDC;">
          <div class="goodsArea">A货区5</div>
          <div class="area">
            <div class="inner" v-for="(item,index) in 5" :key="index">
              <div class="left">A-04-0{{ index+1 }}</div>
              <div class="right">40</div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsAllocationList: [[{ row: 3, list: 4 }], [{ row: 4, list: 5 }], [{ row: 2, list: 3 }], [{ row: 3, list: 5 }]],
      value: '',
      options:[{
          value: '选项1',
          label: '黄金糕'
      }]
    }
  },
  methods:{
    detail(){
      this.$router.push({
        name:'placeDetail'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.goodsAllocation {
  background-color: white;
  .overview{
    padding: 25px;
    display: flex;
    justify-content: space-between;
    .headline{
      font-weight: 800;
    }
  }
  .shelfs {
    height: calc(100vh - 270px);
    overflow-x: hidden;
    display: flex;
    flex-grow: 3;
    flex-wrap: wrap;
  }
  .goodsArea{
    text-align: center;
    padding: 20px 0px;
  }
  .area{
    display: flex;
    flex-wrap: wrap;
  }
  .inner{
    width: 15%;
    margin: 10px;
    border: 8px solid #1480fe;
    height: 30px;
    display: flex;
    line-height: 30px;
    .left{
      width: 70%;
      background-color: aliceblue;
      height: 100%;
      font-size: 14px;
      text-align: right;
    }
    .right{
      width: 30%;
      background-color: #b59565;
      height: 100%;
      font-size: 14px;
      text-align: center;
    }
  }
  .shelf {
    width: 99%;
    flex-basis: calc(33.33% - 20px);
    cursor: pointer;
    margin-bottom: 40px;
    margin-left: 20px;
    /*            background-color: #7F7F7F;*/
    height: 500px;
    position: relative;
  }
  .left-side {
    width: 20px;
    height: 100%;
    position: absolute;
    left: 0px;
    background-color: #1480fe;
    z-index: 99;
  }
  .right-side {
    width: 20px;
    height: 100%;
    position: absolute;
    right: 0px;
    top: 0px;
    background-color: #1480fe;
  }
  .layer {
    width: 100%;
    height: 100px;
    border-bottom: 20px #1480fe solid;
  }
  .layer-contianer {
    display: flex;
    position: relative;
    bottom: -2px;
    padding: 0px 20px;
    z-index: 88;
  }
  .boxs {
    border-top: 5px solid #ffffff;
    border-left: 5px solid #ffffff;
    border-right: 5px solid #ffffff;
    height: 90px;
    flex: 1;
    margin: 0 !important;
  }
  .has {
    /*            border-top:5px solid #B59565;*/
    /*            border-left:5px solid #B59565;*/
    border-right: 5px solid #d7d7d7 !important;
    background-color: #b59565 !important;
    text-align: center !important;
    font-size: 20px;
    line-height: 90px;
    font-weight: bolder;
  }
  .layer-label {
    clear: both;
    display: flex;
    z-index: 77;
  }
  .shelf-tag {
    background-color: #d7d7d7;
    width: 100px;
    height: 30px;
    position: absolute;
    z-index: 99;
    left: 20px;
    text-align: center;
    padding-top: 10px;
  }
  .label-code {
    width: 100%;
    font-size: 10px;
    text-align: center;
    color: white;
    font-weight: bold;
    border-top: 3px solid #d7d7d7;
    padding: 3px;
  }
  .label-code label {
    background-color: white;
    padding: 0px 5px;
    color: black;
  }
}
</style>