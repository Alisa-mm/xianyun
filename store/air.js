export const state=()=>{
    //历史查询数组  
    return {
        history:[],
        //订单的详细信息
        orderDetail:{
            //避免模板报错
            seat_infos:{}
        },
        allPrice:0
    }
}

export const mutations={
    // 把传入的搜索表单的数据存进history中 
    setHistory(state,data){
        // 把新的历史记录放在第一位（unshift是在数组前面添加 push是在数组后面）
        state.history.unshift(data);
        // 让历史记录只显示5条
        if(state.history.length>5){
            //当搜索记录大于5的时候才让数组长度等于5(不然搜索记录不足5条的时候会报错)
            state.history.length=5;
        }

    },
    //修改orderDetail的数据
    setOrderDetail(state,data){
        state.orderDetail=data
    },
     // 保存总价格
     setAllPrice(state, data){
        state.allPrice = data;
    }

}

