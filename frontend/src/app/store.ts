import { configureStore } from "@reduxjs/toolkit";
import userTableReducer from "../slice/userTableSlice";
import panjarTableReducer from "../slice/panjarTableSlice";
import budgetTableReducer from "../slice/budgetTableSlice";
import unitTableReducer from "../slice/unitTableSlice";
import {unitApi} from "../api/unitApi";
import { userApi } from "../api/userApi";
import { panjarApi } from "../api/panjarApi";
import { budgetApi } from "../api/budgetApi";
import { budgetYearApi } from "../api/budgetYearApi";
import { budgetItemApi } from "../api/budgetItemApi";
import { panjarItemApi } from "../api/panjarItemApi";
import { panjarRealizationItemApi } from "../api/panjarRealizationItemApi";

export const store = configureStore({
    reducer: {
        userTable: userTableReducer,
        panjarTable: panjarTableReducer,
        budgetTable: budgetTableReducer,
        unitTable: unitTableReducer,
        [userApi.reducerPath]: userApi.reducer,
        [panjarApi.reducerPath]: panjarApi.reducer,
        [budgetApi.reducerPath]: budgetApi.reducer,
        [budgetYearApi.reducerPath]: budgetYearApi.reducer,
        [budgetItemApi.reducerPath]: budgetItemApi.reducer,
        [panjarItemApi.reducerPath]: panjarItemApi.reducer,
        [unitApi.reducerPath]: unitApi.reducer,
        [panjarRealizationItemApi.reducerPath]: panjarRealizationItemApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, panjarApi.middleware, budgetApi.middleware, budgetYearApi.middleware, budgetItemApi.middleware, panjarItemApi.middleware, panjarRealizationItemApi.middleware, unitApi.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
