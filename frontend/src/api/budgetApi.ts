import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";
import { BudgetDetail, BudgetRequest, BudgetResponse } from "../types/budget";

// Types for check existing budget
export interface CheckExistingBudgetRequest {
	unit_id: number;
	budget_year_id: number;
	quarterly: number;
}

export interface CheckExistingBudgetResponse {
	message: string;
	exists: boolean;
	data: any | null;
}

const baseUrl = import.meta.env.VITE_SERVER_URL || "";

export const budgetApi = createApi({
    reducerPath: "budgetApi",
    baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
    tagTypes: ["Budget"],
    endpoints: (builder) => ({
        checkExistingBudget: builder.mutation<CheckExistingBudgetResponse, CheckExistingBudgetRequest>({
            query: (data) => ({
                url: "/budgets/check-existing",
                method: "POST",
                body: data,
            }),
        }),
        getBudgets: builder.query<BudgetResponse, { page?: number, per_page?: number, search?: string, status?: string, unit_id?: number }>({
            query: ({ page = 1, per_page = 10, search = '', status = '', unit_id }) => ({ 
                url: "/budgets", 
                method: "GET",
                params: { page, per_page, search, status, unit_id },
            }),
            providesTags: ["Budget"],
        }),
        getBudgetById: builder.query<BudgetDetail, number>({
            query: (id) => ({
                url: `/budgets/${id}/items`,
                method: "GET",
            }),
            transformResponse: (response: { data: BudgetDetail }) => response.data,
            providesTags: ["Budget"],
        }),
        addBudget: builder.mutation<BudgetResponse, BudgetRequest>({
            query: (budget) => ({
                url: "/budgets",
                method: "POST",
                body: budget,
            }),
            invalidatesTags: ["Budget"],
        }),
        updateBudget: builder.mutation<BudgetResponse, { id: number } & BudgetRequest>({
            query: ({ id, ...budget }) => ({
                url: `/budgets/${id}`,
                method: "PUT",
                body: budget,
            }),
            invalidatesTags: ["Budget"],
        }),
        deleteBudget: builder.mutation<BudgetResponse, number>({
            query: (id) => ({
                url: `/budgets/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Budget"],
        }),
    }),
})

export const { useCheckExistingBudgetMutation, useGetBudgetsQuery, useGetBudgetByIdQuery, useAddBudgetMutation, useUpdateBudgetMutation, useDeleteBudgetMutation } = budgetApi;