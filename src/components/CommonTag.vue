<template>
  <div class = "tabs"> 
    <el-tag
    v-for = "(tag,index) in tags"
    :key = "tag.name"
    :closable = "tag.name !== 'home' "
    :effect = " $route.name === tag.name ? 'dark' : 'plain'"
    @click = "changeMenu(tag)"
    @close = "handleClose(tag,index)"
    size = "small"
    > 
    {{ tag.label }}
    </el-tag>
  </div>
</template>

<style lang="less" scoped> /*css预处理器语言:scss,sass,less 
 scoped代表作用域，表示当前样式只作用于当前vue页面,而app.vue中不用设置scoped*/
    .tabs {
        padding:10px;
        .el-tag {
        margin-right:10px;
        cursor:pointer; //鼠标悬浮，常用有default和pointer
        }
    }
</style>

<script>
import { mapState , mapMutations} from 'vuex'
    export default {
        name:'CommonTag',
        data() {
            return {

            }
        },
        computed: {
             ...mapState({
                tags: state => state.tab.tabArr
             })
        },
        methods: {
            ...mapMutations({
                close: 'closeTag'
            }),

            changeMenu(item){
                this.$router.push({name: item.name})
            },

            handleClose(tag,index){
                const finalIndex = this.tags.length - 1
                this.close(tag)
                if(tag.name !== this.$route.name){
                    return
                    }
                    if(index === finalIndex){
                        this.$router.push({
                            name: this.tags[index-1].name
                        })
                    }else{
                        this.$router.push({
                            name: this.tags[index].name //此处为index原因:closeTag函数调用后少了一个对象
                        })
                    }

            }
        }

    }
</script>