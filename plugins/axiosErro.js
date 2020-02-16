// 引入element-ui中的message方法
import {Message} from "element-ui";

export default (data)=>{
    // console.log(data);
    data.$axios.onError(err=>{
        console.log(err.response);
        const {statusCode,message} = err.response.data;

        if(statusCode === 400){
            // 使用element-ui组件提示错误
            Message.error(message)
        }
        //当前请求的token有问题 401一般是token错误或者过期，403是因为接口没有传token值
        if(statusCode===401 || statusCode===403){
            // 跳转到登录页
            console.log( data);
            // 重定向到登录页
            data.redirect(200,"/user/login"),{
                returnUrl:data.route.fullPath
            }
        }
    })

}
