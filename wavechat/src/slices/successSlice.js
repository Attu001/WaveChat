import { createSlice } from "@reduxjs/toolkit";

const successSlice = createSlice({
    name:"success",
    initialState:{
        message:"",
    },
    reducers:{
        setSuccess:(state,action)=>{
            state.message=action.payload;
        },
        clearSuccess:(state)=>{
            state.message="";
        },
    },
});
export const {setSuccess,clearSuccess}= successSlice.actions;
export default successSlice.reducer;

    