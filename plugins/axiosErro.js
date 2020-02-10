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
    })

}
