import localStorage from "../plugins/localStorage"

// state用于存放store/user的数据
export const state= {
    userInfo:{
        user:{}
    }
}
// 不能直接改变store里的状态state 必须通过mutation来改变状态
export const mutations={
    //setUserInfo是给userInfo赋值的
    // 第一个参数state不能更改，必须是state 第二个参数是传递进来的值名字可以随便写
    setUserInfo(state,data){
        state.userInfo=data
    },
    // 清除用户数据
    clearUserInfo(state,info){
        // if(process.browser){
        //     localStorage.removeItem('userInfo')
        // }
        state.userInfo= {}
    }

}
// action 异步操作应该放在action中
export const actions = {
    // 第一个参数是固定的store 第二个参数是调用这个login方法时传入的数据
    // 登录
   login(store,data){
   return this.$axios({
        url:"accounts/login",
        method:"POST",
        data
    }).then(res=>{
        const{data}=res
        console.log(data);
     // 调用mutations方法 把data存到store
     store.commit("setUserInfo",data)
    })
   },
   //发送验证码
   SendCaptcha(store,data){
   return this.$axios({
        url: "/captchas",
        method: "POST",
        data:{
            tel:data
        }
      })
   },
  //注册
  register(store,data){
    return this.$axios({
        url: "accounts/register",
        method: "POST",
        data
      }).then(res => {
        //   console.log(res);
        const{data}=res
        // 调用mutations方法 把data存到store
        store.commit("setUserInfo",data)
        return res
      })
  }    
}