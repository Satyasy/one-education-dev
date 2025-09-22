import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";
import { BudgetItemSelect } from "../types/budgetItem";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const budgetItemApi = createApi({
    reducerPath: "budgetItemApi",
    baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
    tagTypes: ["BudgetItem"],
    endpoints: (builder) => ({
        getBudgetItems: builder.query<BudgetItemSelect[], { search?: string,  unit_id?: number }>({
            query: ({ search = '', unit_id }) => ({ 
                url: "/budget-items/select", 
                method: "GET",
                params: { search, unit_id },
            }),
            transformResponse: (response: { data: BudgetItemSelect[] }) => response.data,
            providesTags: ["BudgetItem"],
        }),
    }),
})

export const { useGetBudgetItemsQuery } = budgetItemApi;