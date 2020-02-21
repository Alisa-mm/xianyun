export const state=()=>{
    return {
        //放一个数组存储保存到草稿的数据
        draft:[]
    }
}

export const mutations={
    // 更改state中draft的值
    setDraft(state,data) {
        state.draft.unshift(data)
    },
    // 删除草稿
    delDraftData(state, index) {
        state.draft.splice(index, 1)
      }
}