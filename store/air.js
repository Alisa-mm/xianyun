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
        state.history.unshift(data)
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

