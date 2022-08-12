<template>
 <div class = "common-table">
    <el-table :data="tableData" height="830px" stripe>  <!--stripe：是否为斑马纹table-->
        <el-table-column
            show-overflow-tooltip
            v-for="item in tableLabel" 
            :key="item.prop"
            :label="item.label"
            :width="item.width ? item.width : 125"
        > <!--用tooltip的方式来显示放不下的文案-->

        <template slot-scope="scope"> <!--插槽，拿到父组件传递的数据，放到插槽中-->
            <span style="margin-left: 10px">{{ scope.row[item.prop] }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
            <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        class="pager"
        layout="sizes,prev,pager,next"
        :total="localConfig.total"
        :current-page.sync="localConfig.page"
        @current-change="changePage"
        :page-size="11"
    ></el-pagination>
 </div>
</template>

<script>
export default {
    name:"CommonTable",
    props: {
        tableData:Array,
        tableLabel:Array,
        config:Object  //page, total
    },

    data() {
        return {
            localConfig:this.config,
        }
    },
    methods:{
        handleEdit(row){
            this.$emit('edit',row) /**向父组件抛出数据 */
            this.$EventBus.$emit('fleshForm',row)/**兄弟组件通信 */
        },
        handleDelete(row){
            this.$emit('delete',row) //参数1:父组件中定义的事件名称，参数2：子组件的传递数据
        },
        changePage(page){
            //console.log("这里提交的参数为"+page);//参数为点击的页数
            this.$emit('changePage',page)
        }
    },
    
    
}
</script>

<style lang="less" scoped>
    .common-table {
        height:calc(100%-60px);
        background-color:#fff;
        position:relative;
        .pager {
            position:absolute;
            bottom:0;
            right:20px;
        }
    }
</style>