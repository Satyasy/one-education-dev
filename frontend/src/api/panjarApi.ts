import { createApi } from "@reduxjs/toolkit/query/react";
import { Panjar, PanjarRequest } from "../types/panjar";
import { axiosBaseQuery } from "./axiosBaseQuery";

type PanjarResponse = {
    data: Panjar[];
    meta: {
        total: number;
        total_pages: number;
    };
};

export const panjarApi = createApi({
    reducerPath: "panjarApi",
    baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:8000/api" }),
    tagTypes: ["Panjars"],
    endpoints: (builder) => ({
        getPanjars: builder.query<PanjarResponse, { page?: number, per_page?: number, search?: string, status?: string, unit_id?: number }>({
            query: ({ page = 1, per_page = 10, search = '', status = '', unit_id }) => ({ 
                url: "/panjar-requests", 
                method: "GET",
                params: { page, per_page, search, status, unit_id }
            }),
            providesTags: ["Panjars"]
        }),
        addPanjar: builder.mutation<Panjar, PanjarRequest>({
            query: (panjar) => ({
                url: "/panjar-requests",
                method: "POST",
                body: panjar
            }),
            invalidatesTags: ["Panjars"]
        }),
        getPanjarById: builder.query<Panjar, string | number>({
            query: (id) => ({
                url: `/panjar-requests/${id}`,
                method: "GET",
            }),
            providesTags: ["Panjars"]
        }),
        updatePanjar: builder.mutation<Panjar, { id: number, panjar: PanjarRequest }>({
            query: ({ id, panjar }) => ({
                url: `/panjar-requests/${id}`,
                method: "PUT",
                body: panjar
            }),
            invalidatesTags: ["Panjars"]
        }),
        deletePanjar: builder.mutation<void, number>({
            query: (id) => ({
                url: `/panjar-requests/${id}`,
                method: "DELETE",
                credentials: 'include',
            }),
            invalidatesTags: ["Panjars"]
        }),
        verifyPanjar: builder.mutation<void, number>({
            query: (id) => ({
                url: `/panjar-requests/${id}/verify`,
                method: "PATCH",
            }),
            invalidatesTags: ["Panjars"]
        }),
        approvePanjar: builder.mutation<void, number>({
            query: (id) => ({
                url: `/panjar-requests/${id}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["Panjars"]
        }),
    }),
});

export const { useGetPanjarsQuery, useGetPanjarByIdQuery, useDeletePanjarMutation, useAddPanjarMutation, useUpdatePanjarMutation, useVerifyPanjarMutation, useApprovePanjarMutation } = panjarApi;
