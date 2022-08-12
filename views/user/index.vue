<!-- v-model="form[item.model]"   -->
<template>   <!--父组件,子组件为CommonForm,子组件拿到父组件的值不要修改，而是要赋值给其他变量,遵循数据的单向传递原则-->
  <div class="manage">
    <!--对话框,内嵌TableForm组件-->
    <el-dialog
      :title="operateType === 'add'? '新增用户' : '更新用户'"
      :visible.sync="isShow"
    >
    <!--CommonFrom组件的使用-->
      <common-form
        :formLabel="operateFormLabel"
        :form="operateForm"
        :inline="true"
        ref="form"
      ></common-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeForm">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
    <div class="manage-header">
      <el-button type="primary"  @click="addUser">+ 新增</el-button>
       <common-form
        :formLabel="formLabel"
        :form="searchForm"
        :inline="true"
        ref="form"
      >
       <el-button type="primary" @click="getList(searchForm.keyword)">搜索</el-button>
      </common-form>
    </div>
    <!--CommonTable组件的使用-->
    <common-table
    :tableData="tableData"
    :tableLabel="tableLabel"
    :config="config"
    @changePage="getList"
    @edit="editUser"
    @delete="delUser"
    > <!--config对应Pagination的设置 @是v-on指令的缩写，用来监听DOM事件-->
    </common-table>
  </div>
</template>

<script>
import CommonForm from '../../src/components/CommonForm.vue'
import CommonTable from '../../src/components/CommonTable.vue'

import {getUser} from  '../../api/data'

export default {
  name:'myUser',
  components: {
     CommonForm ,
     CommonTable,
  },
  data() {
    return{
      operateType:'add',
      isShow:false,
      operateFormLabel: [
        {
          model:'name',
          label:'姓名',
          type:'input'
        },
        {
          model:'age',
          label:'年龄',
          type:'input'
        },
        {
          model:'sex',
          label:'性别',
          type:'select',
          opts: [
            {
              label:'男',
              value:1
            },
            {
              label:'女',
              value:0
            }
          ]
        },
        {
          model:'birth',
          label:'出生日期',
          type:'date'
        },
        {
          model:'addr',
          label:'地址',
          type:'input'
        },
      ],
      operateForm: {
        name: '',
        addr: '',
        age: '',
        birth: '',
        sex: ''
      },
      formLabel: [
      {
        model: 'keyword',
        label: '',
        type:'input'
      }
    ],
    searchForm: {
      keyword: ''

    },
    tableData:[],
    tableLabel:[ {
      prop:"name",
      label:"姓名"
    },
    {

      prop:"age",
      label:"年龄"
    },
    {

      prop:"sexLabel",
      label:"性别"
    },
    {

      prop:"birth",
      label:"出生日期",
      width:200
    },
    {

      prop:"addr",
      label:"地址",
      width:320
    },
    ],
    config: {
      page:1,
      total:30,
      loading:false
    },

    }
  },

  methods: {
    closeForm()
    {
      this.isShow = false
      this.getList() //在点击取消时，前台数据没有去更新后台数据，此时从后台获取的tableData跟更改前的一样
    },
    confirm() {

        this.closeForm()

        if(this.operateType === 'edit'){
          this.$http.post('/user/edit',this.operateForm).then(res => {
            console.log(res)
            //this.isShow = false
            
            this.getList()
          })
        }else {
          this.$http.post('/user/add',this.operateForm).then(res =>{
            //console.log("新增返回的res为"+res);
            if(res.data.code === 200)
            {
              this.$message({
                type:"error",
                message:res.data.message
              })
            }
            else
            {
              this.$message({
                type:"success",
                message:res.data.message
              })
            }
            //this.isShow = false
            this.getList()
          })
        }
    },
    addUser() {
      this.isShow = true
      this.operateType = 'add'
       //获取表单中的数据
    },

    editUser(row){   //在子组件未传出数据给父组件时,默认形参代表原生DOM事件 PointerEvent
    //而当子组件通过this.$emit传数据给父组件时，默认形参即是父组件得到的数据
    // console.log("点击了编辑按钮");
    // console.log("此时的row id为"+row.id);
      this.operateType = "edit"
      this.isShow = true
      this.operateForm = row //row为子组件行数据[Object]
    },
    delUser(row){
      this.$confirm("此操作将永久删除此用户信息,是否继续？","提示", {  //通知
        comfirmButtonText:"确认",
        cancelButtonText:"取消",
        type: "warning"
      }).then(()=> {
        const id = row.id //由表格数据获取id不知道当前操作的是第几个数据
        this.$http.get('/user/del',{
          params: { id }
        }).then(() => {
          this.$message({
            type:"success",
            message:"删除成功"
          })
          console.log("重新获取table列表");
          this.getList()
        })
      })
    },
    getList(name = '') { 
       this.config.loading = true //加载数据前loading
        //console.log("name:"+name);
        name == ''?(this.config.page = 1):'' 
      getUser({
        page: this.config.page,
        name
      }) .then(res => {
        //console.log("返回的res为"+res.data,'res')
        this.tableData = res.data.list.map(item=>{
          item.sexLabel = item.sex ===0 ? "女" : "男" //根据list中的sex值设置sexLabel
          return item
        })
        //console.log(res.data)//再次点击获取的List为空
      this.config.total = res.data.count //写成res.count为 undefined
      this.config.loading = false
      })
    },

  },
  created() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
  .manage-header {
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  /*.manage {
    height: 100%;
  }*/
</style>