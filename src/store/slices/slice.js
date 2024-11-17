import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    loginuser: null,
    loadinguser: true,
  };
  const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        initial(state){
            state.loadinguser = false
        },
        login(state,action){
            state.loginuser = action.payload
    },
    logout(state){
        state.loginuser = null
    },
}
  })
  export const {login,logout,initial} = authSlice.actions
  export default authSlice.reducer;