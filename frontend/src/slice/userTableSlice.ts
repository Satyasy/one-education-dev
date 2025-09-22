import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page:1,
    per_page:10,
    search:"",
    role:""
}

const userTableSlice = createSlice({
    name:"userTable",
    initialState,
    reducers:{
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setPerPage: (state, action) => {
            state.per_page = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        reset: (state) => {
            Object.assign(state, initialState);
        },
    },
})

export const { setPage, setPerPage, setSearch, setRole, reset } = userTableSlice.actions;
export default userTableSlice.reducer;
