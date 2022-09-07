<template>
    <el-form ref = "form" label-width = "100px" :model = "form" :inline = "inline"> <!-- model表单数据对象  inline行内表单模式 -->
      <el-form-item v-for = "item in formLabel" :key = "item.label" :label = "item.label">
        <el-input
            v-if = "item.type === 'input'"
            :placeholder = "'请输入' + item.label"
            v-model = "localForm[item.model]"  
        ></el-input>  <!--form[]为在对象内取值,比如form[age] ,而这里是form[object]-->  
        <!-- v-model报错：注意：在 JavaScript 中对象和数组是通过引用传入的,
         所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身将会影响到父组件的状态 -->
        <el-switch v-if = "item.type === 'switch'" v-model = "localForm[item.model]" ></el-switch> <!--有无:区别 有代表=后面是变量，没有就代表是字符串或常量-->
        <el-date-picker
            v-if = "item.type === 'date'"
            type = "date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="localForm[item.model]" 
        ></el-date-picker>
        <el-select
            v-if = "item.type === 'select'"
            placeholder="请选择"
            v-model="localForm[item.model]" 
        >
            <el-option
                v-for = "item in item.opts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
      </el-form-item>

    <!-- 按钮获取table行数据并赋值给子组件，子组件渲染 -->
    <!-- <el-form-item>
      <el-button type="primary" @click="showFormData()" >获取该行数据</el-button>
    </el-form-item> -->
      <!-- slot插槽 跟父组件配合使用 -->
      <el-form-item><slot></slot></el-form-item>
    </el-form>
</template>

<script>
    export default {
        name:"CommonForm",
        props: { //用于和父组件通信,值由父组件传递进来,可以直接在template中使用,注意子组件不能更改父组件的值
                    formLabel: Array,
                    form: Object,
                    inline: Boolean,
                    primaryButton:Boolean //用于表单界面初始化按钮样式
                },
        data() {
            return{
                localForm: this.form,//因为报错Unexpected mutation of "form" prop  vue/no-mutating-props所以采用变量存储
            }
        },

        //metheds中定义一个方法
        methods: {
            showFormData(){
                this.localForm = this.form
                this.$message({
                    type: "success",
                    message: "数据获取完成"
                })
                
            },
        },
        beforeCreate(){
                this.$EventBus.$on('fleshForm',(row)=>{
                this.localForm = row
            }
            )
        }
        // updated() {  //当页面的数据被更新完成时触发
        //      if(this.primaryButton)
        //      {
        //      let fleshButton = document.getElementById("fleshButton")
        //      fleshButton.style = "background-color:#7093DB"
        //      fleshButton.innerHTML = "请手动刷新数据"
        //      }
        // }
    
    }
</script>