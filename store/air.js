export const state=()=>{
    //历史查询数组  
    return {
        history:[]
    }
}

export const mutations={
    // 把传入的搜索表单的数据存进history中 
    setHistory(state,data){
        state.history.push(data)
    }
}