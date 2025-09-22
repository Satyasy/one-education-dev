import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

interface UnitSelectItem {
    value: number;
    label: string;
    code: string;
}

interface UnitSelectResponse {
    message: string;
    data: UnitSelectItem[];
}

const baseUrl = import.meta.env.VITE_SERVER_URL || "";
export const unitApi = createApi({
    reducerPath: "unitApi",
    baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
    tagTypes: ["Unit"],
    endpoints: (builder) => ({
        getUnitsSelect: builder.query<UnitSelectResponse, any>({
            query: () => ({
                url: "/units/select",
                method: "GET",
            }),
            providesTags: ["Unit"],
        }),
        getUnits: builder.query<any, { page?: number, per_page?: number, search?: string }>({
            query: ({ page = 1, per_page = 10, search = '' }) => ({
                url: "/units",
                method: "GET",
                params: { page, per_page, search },
            }),
            providesTags: ["Unit"],
        }),
        getUnitById: builder.query<any, number>({
            query: (id) => ({
                url: `/units/${id}`,
                method: "GET",
            }),
            providesTags: ["Unit"],
        }),
        addUnit: builder.mutation<any, any>({
            query: (unit) => ({
                url: "/units",
                method: "POST",
                body: unit,
            }),
            invalidatesTags: ["Unit"],
        }),
        updateUnit: builder.mutation<any, { id: number, unit: any }>({
            query: ({ id, unit }) => ({
                url: `/units/${id}`,
                method: "PUT",
                body: unit,
            }),
            invalidatesTags: ["Unit"],
        }),
        deleteUnit: builder.mutation<any, number>({
            query: (id) => ({
                url: `/units/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Unit"],
        }),
    }),
})

export const {
    useGetUnitsSelectQuery,
    useGetUnitsQuery,
    useGetUnitByIdQuery,
    useAddUnitMutation,
    useUpdateUnitMutation,
    useDeleteUnitMutation
} = unitApi;