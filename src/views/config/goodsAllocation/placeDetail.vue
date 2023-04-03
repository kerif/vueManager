<template>
  <div class="placeDetail">
    <div class="headline">{{$t('仓位概览')}}</div>
    <div class="information">
      <div class="detail">
        <div class="shelf">
          <div class="shelf-tag">A货区</div>
          <div class="left-side"></div>
          <div class="layer">
            <div class="layer-contianer">
              <div class="boxs"></div>
              <div class="boxs"></div>
              <div class="boxs has">20</div>
              <div class="boxs"></div>
            </div>
            <div class="layer-label">
              <div class="label-code"><label>A-01-01</label></div>
              <div class="label-code"><label>A-01-02</label></div>
              <div class="label-code"><label>A-01-03</label></div>
              <div class="label-code"><label>A-01-04</label></div>
            </div>
          </div>
          <div class="layer">
            <div class="layer-contianer">
              <div class="boxs"></div>
              <div class="boxs"></div>
              <div class="boxs has">40</div>
              <div class="boxs"></div>
            </div>
            <div class="layer-label">
              <div class="label-code"><label>A-02-01</label></div>
              <div class="label-code"><label>A-02-02</label></div>
              <div class="label-code"><label>A-02-03</label></div>
              <div class="label-code"><label>A-02-04</label></div>
            </div>
          </div>
          <div class="layer">
            <div class="layer-contianer">
              <div class="boxs"></div>
              <div class="boxs"></div>
              <div class="boxs"></div>
              <div class="boxs"></div>
            </div>
            <div class="layer-label">
              <div class="label-code"><label>A-03-01</label></div>
              <div class="label-code"><label>A-03-02</label></div>
              <div class="label-code"><label>A-03-03</label></div>
              <div class="label-code"><label>A-03-04</label></div>
            </div>
          </div>
          <div class="layer">
            <div class="layer-contianer">
              <div class="boxs"></div>
              <div class="boxs"></div>
              <div class="boxs"></div>
              <div class="boxs"></div>
            </div>
            <div class="layer-label">
              <div class="label-code"><label>A-04-01</label></div>
              <div class="label-code"><label>A-04-02</label></div>
              <div class="label-code"><label>A-04-03</label></div>
              <div class="label-code"><label>A-04-04</label></div>
            </div>
          </div>
          <div class="right-side"></div>
        </div>
      </div>
      <div class="detailList">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="date" :label="$t('货位')" width="180">
          </el-table-column>
          <el-table-column prop="name" :label="$t('包裹号')" width="150">
          </el-table-column>
          <el-table-column prop="name" :label="$t('所属用户')" width="150">
          </el-table-column>
          <el-table-column prop="name" :label="$t('上架时间')" width="150">
          </el-table-column>
          <el-table-column prop="name" :label="$t('上架人')" width="180">
          </el-table-column>
          <el-table-column prop="name" :label="$t('货物属性')" width="180">
          </el-table-column>
          <el-table-column prop="name" :label="$t('创建时间')">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
      ]
    }
  }
}
</script>
<style scoped lang="scss">
.placeDetail {
  background-color: white;
  .headline {
    padding: 25px;
    font-weight: 800;
  }
  .information {
    height: calc(100vh - 270px);
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    .detail {
      width: 45%;
      height: 600px;
    }
    .detailList {
      width: 50%;
      height: 600px;
      background-color: #F2F2F2;
      padding: 20px;
    }
  }
  .shelfs {
    display: flex;
  }
  .shelf {
    width: 99%;
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
  }
  .has {
    /*            border-top:5px solid #B59565;*/
    /*            border-left:5px solid #B59565;*/
    border-right: 5px solid #d7d7d7;
    background-color: #b59565;
    text-align: center;
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