import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    page: 1,
    per_page: 10,
    search: "",
    status: ""
}

const unitTableSlice = createSlice({
    name: "unitTable",
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

export const { setPage, setPerPage, setSearch, setStatus, reset } = unitTableSlice.actions;
export default unitTableSlice.reducer;