<template>
    <div class="login">
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form">
        <h3 class="title">注册</h3>
        <el-form-item prop="username">
            <el-input
              type="text"
              placeholder="用户名"
              v-model="registerForm.username">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="registerForm.password">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
          <el-progress v-show="registerForm.passwordPercentShow" :percentage="registerForm.passwordPercent" :format="passwordPercentFormat"/>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input
            type="password"
            placeholder="确认密码"
            v-model="registerForm.password2">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="medium"
                     style="width:100%;"
                     @click.native.prevent="handleRegister">
              <span>注册</span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link href="/login" type="primary">已有账号？立即登录</el-link>
        </el-form-item>
      </el-form>
      <!--  底部  -->
      <div class="el-login-footer">
        <span>Copyright © 2020 Gentle Health All Rights Reserved.</span>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      const validatePassword = (rule, value, callback) => {
           if(value === ''){
              callback(new Error('请输入密码！'))
              this.registerForm.passwordPercentShow = false;
           } else {
             this.registerForm.passwordPercentShow = true;

              //6-20位包含字符、数字和特殊字符
              var ls = 0;
              if(this.registerForm.password.match(/([a-z])+/))
              {
                 ls++;
              }
              if(this.registerForm.password.match(/([0-9])+/))
              {
                 ls++;
              }
              if(this.registerForm.password.match(/([A-Z])+/))
              {
                 ls++;
              }
              if(this.registerForm.password.match(/([\W])+/) && !this.registerForm.password.match(/(![\u4E00-\u9FA5])+/))
              {
                ls++;
              }
              if(this.registerForm.password.length < 6 || this.registerForm.password.length > 20){
                callback(new Error("密码要求6-20位字符！"));
                ls = 0;
              }
              if(this.registerForm.password.match(/(![\u4E00-\u9FA5])+/)){
                callback(new Error("不能包含中文字符！"));
                ls = 0
              }

             switch (ls) {
               case 0:
                     this.registerForm.passwordPercent = 0;
                     callback(new Error('数字、小写字母、大写字母以及特殊字符中四选三'));
                     break;
               case 1:
                     this.registerForm.passwordPercent = 33;
                     callback(new Error('数字、小写字母、大写字母以及特殊字符中四选三'));
                     break;
               case 2:
                     this.registerForm.passwordPercent = 66;
                     callback(new Error('数字、小写字母 、大写字母以及特殊字符中四选三'));
                     break;
               case 3:
               case 4:
                     this.registerForm.passwordPercent = 100;
                     break;
               default:
                     this.registerForm.passwordPercent = 0;
                     break;
             }
           }
           callback();
      };

      const validatePassword2 = (rule, value, callback) => {
           if(value === '')
           {
               callback(new Error("请输入确认密码！"))
           }
           if(value !== this.registerForm.password)
           {
              callback(new Error("两次输入密码不一致！"))
           } else {
             callback()
           }
       };

       return {
         registerForm: {
             username:"",
             password:"",
             password2:"",
             passwordPercent:0,
             passwordPercentShow:false,
         },
         registerRules: {
             username: [{required:true,trigger:"blur",message:"用户名不能为空！"}],
             password: [{required:true,validator:validatePassword, trigger:['blur', 'change']}],
             password2: [{required:true,validator:validatePassword2, trigger:['blur', 'change']}],
         }
       }
    },
    methods: {
      handleRegister()
      {
          this.$refs.registerForm.validate(valid => {
            if(valid)
            {
                this.$store.dispatch("Register", this.registerForm).then(() => {
                      this.msgSuccess("注册成功");
                }).catch( error => {
                   this.msgError(error)
                })
            }
          });
      },
      passwordPercentFormat(percentage)
      {
        return percentage === 100? "符合":"不符合";
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/image/login-background.jpg");
    background-size: cover;
  }
  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }
  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #707070;
    font-family: Arial;
    font-size: 13px;
    letter-spacing: 1px;
  }
</style>
