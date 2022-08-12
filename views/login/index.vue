<template>
 <div style="height:100%">
   <canvas ref = "canvas" style="width:100%;height:100%;"></canvas>
    <el-form
    :model="form"
    ref="form"
    status-icon
    :rules = "rules"
    label-width="100px"
    class="login_container"
    >
    <h3 class="login_tittle">用户登录</h3>
      <el-form-item
      label="用户名"
      label-width="80px"
      prop="username"
      class="username"
      >
        <el-input
        type="input"
        v-model="form.username"
        autocomplete="off"
        placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item
      label="密码"
      label-width="80px"
      prop="password"
      class="password"
      >
       <el-input
        type="password"
        v-model="form.password"
        autocomplete="off"
        placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item class="login-submit">
        <el-button type="primary" @click="login" class="login_submit">登录</el-button>
      </el-form-item>
    </el-form>
 </div>
</template>

<script>
import {checkUser} from '../../api/data'
export default {
  name:'userLogin',
  data()
  {
    return{
        form: {

        },
        rules: {
            username:[{
                required:true,message:"请输入用户名",trigger:"blur"
            },
            {
                min: 3,
                message:"用户名长度不能小于3位",
                trigger:"blur"
            }],
            password:[{
                required:true,message:"请输入密码",trigger:"blur"
            },
            ]
        }
    }
  },
  methods: {
    login()
    {
      //console.log(typeof(this.form.username));
       checkUser({
        username:this.form.username,
        password:this.form.password}).then(res=>{
        if(res.data.code === 20000)
        {
          console.log("返回的data"+res.data);
          this.$router.push("home")
          this.$message({
            type:"success",
            message:"欢迎您，用户:"+res.data.username
          })
        }
        else {
         this.$message({
          type:"error",
          message:res.data.message
         })
       }
       })
        //this.$router.push("home")
    }
  },
 mounted(){
     /**绘制背景粒子特效 */
    //创建一个圆对象
    class Circle {
       
        constructor(x,y){
            this.x = x;
            this.y = y;
            this.r = Math.random()*10;
            this._mx = Math.random();
            this._my = Math.random();
        }

        //canvas画圆和直线

        drawCircle(ctx){
            ctx.beginPath()
            ctx.arc(this.x,this.y,this.r,0,360)
            ctx.closePath()
            ctx.fillStyle = 'rgb(204,204,204,0.3)'
            ctx.fill()
        }

        drawLine(ctx,_circle){ //两个圆之间画线
            let dx = this.x - _circle.x
            let dy = this.y - _circle.y
            let d = Math.sqrt(dx*dx+dy*dy)
            if(d<150){
                ctx.beginPath()
                ctx.moveTo(this.x, this.y); //起始点
                ctx.lineTo(_circle.x,_circle.y)
                ctx.closePath()
                ctx.strokeStyle = 'rgb(204,204,204,0.3)'
                ctx.stroke()
            }
        }

        //圆圈移动
        move(w,h)
        {
            this._mx = (this.x < w && this.x > 0) ? this._mx :(-this._mx)
            this._my = (this.y < h && this.y > 0) ? this._my :(-this._my)
            this.x += this._mx / 2
            this.y += this._my / 2
        }
    }

    //鼠标点画圆
    class currentCircle extends Circle {
        constructor(x,y){
            super(x,y)
        }
   
        drawCircle(ctx){
            ctx.beginPath()
            this.r = 8
            ctx.arc(this.x,this.y,this.r,0,360)//半径默认是8px
            ctx.closePath()
            ctx.fillStyle = 'rgb(204,204,204,0.3)'
            ctx.fill()
        }
    }
    
    //更新页面 请求动画帧
    //window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.mswindow.requestAnimationFrame

  let canvas = this.$refs.canvas;
  let ctx = canvas.getContext("2d");
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;
  let circles = [];
  let current_circle = new currentCircle(0, 0)

  let draw = function() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < circles.length; i++) {
      circles[i].move(w, h);
      circles[i].drawCircle(ctx);
      for (let j = i + 1; j < circles.length; j++) {
        circles[i].drawLine(ctx, circles[j])
      }
    }
    if (current_circle.x) {
      current_circle.drawCircle(ctx);
      for (var k = 1; k < circles.length; k++) {
        current_circle.drawLine(ctx, circles[k])
      }
    }
    requestAnimationFrame(draw)
  }

  let init = function(num) {
    for (var i = 0; i < num; i++) {
      circles.push(new Circle(Math.random() * w, Math.random() * h));
    }
    draw();
  }

  window.addEventListener('load', init(160)); //控制圆的数量

  window.onmousemove = function(e) {
    e = e || window.event;
    current_circle.x = e.clientX;
    current_circle.y = e.clientY;
  }

  window.onmouseout = function() {
    current_circle.x = null;
    current_circle.y = null;
  }

  }
}
</script>
<style lang="less" scoped>
    .login_container {
        /*相对位置样式
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background-color: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25 #cac6c6;*/
        border-radius:15px;
        background-clip: padding-box;
        width: 400px;
        background-color: #fff;
        border: 2px solid #cac6c6;
        box-shadow: 0 0 25 #cac6c6;
        position: absolute;
        z-index: 1;
        top:40%;
        left:40%;
    }
    .login_tittle {
        //color:#4b8ac5 ;
        margin:20px auto 48px auto;
        text-align: center;
        color: #505458;
    }
    .login_submit {
        margin:10px auto 0px auto;
    }
    .username {
      margin-right: 30px;
    }
    .password {
      margin-right: 30px;
    }
    .login_submit {
      margin-left: 70px;
    }
</style>