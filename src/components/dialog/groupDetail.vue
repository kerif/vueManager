<template>
  <el-dialog :visible.sync="show" :title="$t('拼图详细')" width="60%" @close="clear">
    <div style="padding: 10px 20px">
      <div class="flex-box">
        <div style="width: 120px; height: 100px; background-color: grey"></div>
        <div style="margin: 5px 0px">
          <span class="show-text">{{ $t('公开') }}</span>
        </div>
        <div>
          <div style="margin-bottom: 20px" class="">
            <span style="width: 200px">{{ $t('爱心拼团007111111111111111') }}</span>
            <span style="margin-left: 20px">{{ $t('拼团中') }}</span>
          </div>
          <div style="margin-bottom: 20px">{{ $t('拼团时间剩余 2天16分16秒') }}</div>
          <div style="margin-bottom: 20px">{{ $t('已有2人参与，共10kg') }}</div>
          <div style="margin-bottom: 20px">
            <span>{{ $t('团员自付') }}</span>
            <span style="margin-left: 80px">{{ $t('送货上门') }}</span>
          </div>
        </div>
        <div>
          <div>
            <el-button class="btn-main">{{ $t('提交拼团') }}</el-button>
            <el-button class="btn-light-red">{{ $t('取消拼团') }}</el-button>
            <el-button class="btn-light-green">{{ $t('修改拼团') }}</el-button>
          </div>
          <div style="margin-top: 10px">
            <el-button class="btn-deep-purple">{{ $t('延长时间') }}</el-button>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px">
        <div style="display: flex">
          <div>
            <div
              style="width: 50px; height: 50px; border-radius: 50%; border: 1px solid #000"
            ></div>
            <div class="center" style="margin-top: 10px">10001</div>
          </div>
          <div style="margin-left: 80px">
            <div>{{ $t('团长有话说') }}</div>
            <div
              style="
                border: 1px solid #000;
                padding: 20px;
                border-radius: 5px;
                margin-top: 10px;
                width: 600px;
              "
            >
              {{
                $t(
                  '说团长有话说团长有话说团长有话说团长有话说团长有话说团长有话说团长有话说团长有话说'
                )
              }}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; margin-top: 20px">
          <div style="margin-top: -80px">
            <div
              style="width: 50px; height: 50px; backgroud-color: grey; border: 1px solid #000"
            ></div>
            <div style="border-left: 1px solid #000; height: 100px" class="center"></div>
            <div
              style="width: 50px; height: 50px; backgroud-color: grey; border: 1px solid #000"
            ></div>
          </div>
          <div style="margin-left: 80px">
            <div
              class="flex-item"
              style="
                border: 1px dashed #000;
                padding: 20px;
                width: 600px;
                border-radius: 5px;
                margin-top: 20px;
              "
            >
              <div
                style="width: 50px; height: 50px; background-color: #000; margin-right: 20px"
              ></div>
              <div>
                <div style="margin-bottom: 10px">
                  {{ $t('xxxxxx海运专线') }}
                </div>
                <div style="margin-bottom: 10px">{{ $t('5-7天') }}</div>
                <div style="margin-bottom: 10px">{{ $t('普货，敏感货') }}</div>
              </div>
            </div>
            <div
              class="flex-item"
              style="
                border: 1px dashed #000;
                padding: 20px;
                width: 600px;
                border-radius: 5px;
                margin-top: 20px;
              "
            >
              <div
                style="width: 50px; height: 50px; background-color: #000; margin-right: 20px"
              ></div>
              <div>
                <div style="margin-bottom: 10px">
                  {{ $t('荷兰某某自提点A') }}
                </div>
                <div style="margin-bottom: 10px">{{ $t('0031-650207241') }}</div>
                <div style="margin-bottom: 10px">
                  {{ $t('1336ZG  Almere  Mickey Mousestraat 79') }}
                </div>
              </div>
            </div>
            <div
              class="flex-item"
              style="
                border: 1px dashed #000;
                padding: 20px;
                width: 600px;
                border-radius: 5px;
                margin-top: 20px;
              "
            >
              <div
                style="width: 50px; height: 50px; background-color: #000; margin-right: 20px"
              ></div>
              <div>
                <div style="margin-bottom: 10px">
                  {{ $t('荷兰某某自提点A') }}
                </div>
                <div style="margin-bottom: 10px">{{ $t('0031-650207241') }}</div>
                <div style="margin-bottom: 10px">
                  {{ $t('1336ZG  Almere  Mickey Mousestraat 79') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 50px">
        <div class="flex">
          <div class="flex-1 font-bold" style="font-size: 16px; color: #000">
            {{ $t('拼团成员') }}
          </div>
          <div class="flex-1">
            <el-input style="width: 70%"></el-input>
            <el-button class="btn-main" style="margin-left: 10px">{{
              $t('添加拼团成员')
            }}</el-button>
          </div>
        </div>
        <el-table :data="tableData" border style="margin-top: 20px">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="" :label="$t('身份')"></el-table-column>
          <el-table-column prop="" :label="$t('头像')"></el-table-column>
          <el-table-column prop="" :label="$t('客户ID')"></el-table-column>
          <el-table-column prop="" :label="$t('昵称')"></el-table-column>
          <el-table-column prop="" :label="$t('状态')"></el-table-column>
          <el-table-column prop="" :label="$t('提交包裹')"></el-table-column>
          <el-table-column prop="" :label="$t('提交重量')"></el-table-column>
          <el-table-column prop="" :label="$t('提交体积重量')"></el-table-column>
          <el-table-column :label="$t('操作')">
            <template>
              <el-button class="btn-light-red">{{ $t('移除拼团') }}</el-button>
              <el-button class="btn-main" @click="managePackage">{{ $t('管理包裹') }}</el-button>
              <el-button class="btn-deep-purple">{{ $t('详细') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex-item" style="justify-content: flex-end">
          <div>{{ $t('合计') }}</div>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :visible.sync="showManagePackage"
      :title="$t('管理包裹')"
      width="40%"
      @close="clearInner"
    >
      <div style="padding: 20px">
        <div class="flex">
          <div class="flex-item">
            <div
              style="
                width: 80px;
                height: 80px;
                background-color: #000;
                border: 1px solid #000;
                border-radius: 50%;
              "
            ></div>
            <div class="margin-left">
              <div style="margin-bottom: 15px">
                {{ $t('爱心拼团007') }}
              </div>
              <div>
                <span>{{ $t('胡大仙') }}</span>
                <span style="margin-left: 15px">{{ $t('001') }}</span>
              </div>
            </div>
          </div>
          <div>
            <el-button @click="addPackage">{{ $t('添加') }}</el-button>
          </div>
        </div>
        <div class="line"></div>
        <div class="show-text">
          {{ $t('已加入拼团包裹') }}
        </div>
        <el-table :data="tableData" border style="margin-top: 20px">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="" :label="$t('包裹号')"></el-table-column>
          <el-table-column prop="" :label="$t('入库时间')"></el-table-column>
          <el-table-column prop="" :label="$t('货位')"></el-table-column>
          <el-table-column prop="" :label="$t('入库重量')"></el-table-column>
          <el-table-column :label="$t('操作')">
            <template>
              <el-button class="btn-light-red">{{ $t('移除拼团') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :visible.sync="showAddPackage"
      :title="$t('添加包裹')"
      @close="clearAddPackage"
    >
      <div>*{{ $t('仅显示可添加的包裹') }}</div>
      <el-table :data="tableData" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="" :label="$t('包裹号')"></el-table-column>
        <el-table-column prop="" :label="$t('入库时间')"></el-table-column>
        <el-table-column prop="" :label="$t('货位')"></el-table-column>
        <el-table-column prop="" :label="$t('入库重量')"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button class="btn-main">{{ $t('提交') }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      showManagePackage: false,
      showAddPackage: false,
      tableData: [
        {
          id: 1
        }
      ]
    }
  },
  methods: {
    managePackage() {
      this.showManagePackage = true
    },
    addPackage() {
      this.showAddPackage = true
    },
    clearInner() {
      this.showManagePackage = false
    },
    clearAddPackage() {
      this.showAddPackage = false
    },
    clear() {
      this.show = false
    }
  }
}
</script>

<style>
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-item {
  display: flex;
  align-items: center;
}
.flex-box {
  display: flex;
  justify-content: space-between;
}
.flex-1 {
  flex: 1;
}
.show-text {
  font-weight: bold;
  font-size: 18px;
  color: #000;
}
.text-align {
  text-align: center;
}
.box-top {
  margin-top: 20px;
}
.font-bold {
  font-weight: bold;
}
.line {
  margin: 20px 0;
  border-top: 1px solid #000;
}
.margin-left {
  margin-left: 20px;
}
.center {
  text-align: center;
}
</style>
