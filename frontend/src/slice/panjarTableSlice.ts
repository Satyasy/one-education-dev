import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page: 1,
    per_page: 10,
    search: "",
    status: ""
}

const panjarTableSlice = createSlice({
    name: "panjarTable",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setPerPage: (state, action) => {
            state.per_page = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        reset: (state) => {
            Object.assign(state, initialState);
        },
    },
})

export const { setPage, setPerPage, setSearch, setStatus, reset } = panjarTableSlice.actions;
export default panjarTableSlice.reducer; 