import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";
import { PanjarRealizationItemResponse } from "../types/panjarRealizationItem";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const panjarRealizationItemApi = createApi({
    reducerPath: "panjarRealizationItemApi",
    baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
    tagTypes: ["PanjarRealizationItem"],
    endpoints: (builder) => ({
        getAllPanjarRealizationItems: builder.query<PanjarRealizationItemResponse[], {panjar_request_id: number}>({
            query: ({ panjar_request_id }) => ({ 
                url: `/panjar-realization-items/request/${panjar_request_id}`, 
                method: "GET",
            }),
            transformResponse: (response: { data: PanjarRealizationItemResponse[] }) => response.data,
            providesTags: ["PanjarRealizationItem"],
        }),
        getPanjarRealizationItemsById: builder.query<PanjarRealizationItemResponse, { panjar_realization_item_id: number }>({
            query: ({ panjar_realization_item_id }) => ({
                url: `/panjar-realization-items/${panjar_realization_item_id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: PanjarRealizationItemResponse }) => response.data,
            providesTags: ["PanjarRealizationItem"]
        }),
        getPanjarRealizationItemsByPanjarRequestId: builder.query<PanjarRealizationItemResponse[], { panjar_request_id: number, panjar_item_id: number }>({
            query: ({ panjar_request_id, panjar_item_id }) => ({ 
                url: `/panjar-realization-items/${panjar_request_id}/item/${panjar_item_id}`, 
                method: "GET",
            }),
            transformResponse: (response: { data: PanjarRealizationItemResponse[] }) => response.data,
            providesTags: ["PanjarRealizationItem"],
        }),
        addPanjarRealizationItem: builder.mutation<PanjarRealizationItemResponse, { data: FormData }>({
            query: ({ data }) => ({ 
                url: `/panjar-realization-items`, 
                method: "POST",
                body: data,
            }),
            transformResponse: (response: { data: PanjarRealizationItemResponse }) => response.data,
            invalidatesTags: ["PanjarRealizationItem"],
        }),
        updatePanjarRealizationItem: builder.mutation<PanjarRealizationItemResponse, { panjar_realization_item_id: number, data: FormData }>({
            query: ({ panjar_realization_item_id, data }) => {
                // Add _method field for Laravel to handle file uploads with PUT
                data.append('_method', 'PUT');
                return {
                    url: `/panjar-realization-items/${panjar_realization_item_id}`, 
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (response: { data: PanjarRealizationItemResponse }) => response.data,
            invalidatesTags: ["PanjarRealizationItem"],
        }),
        updateReportStatusPanjarRealizationItem: builder.mutation<PanjarRealizationItemResponse, { panjar_realization_item_id: number, report_status: string }>({
            query: ({ panjar_realization_item_id, report_status }) => ({
                url: `/panjar-realization-items/${panjar_realization_item_id}/report-status`,
                method: "PATCH",
                body: { report_status },
            }),
            transformResponse: (response: { data: PanjarRealizationItemResponse }) => response.data,
            invalidatesTags: ["PanjarRealizationItem"],
        }),
        deletePanjarRealizationItem: builder.mutation<void, { panjar_realization_item_id: number }>({
            query: ({ panjar_realization_item_id }) => ({ 
                url: `/panjar-realization-items/${panjar_realization_item_id}`, 
                method: "DELETE",
            }),
            invalidatesTags: ["PanjarRealizationItem"],
        }),
    }),
});

export const { 
    useGetAllPanjarRealizationItemsQuery,
    useGetPanjarRealizationItemsByIdQuery,
    useGetPanjarRealizationItemsByPanjarRequestIdQuery, 
    useAddPanjarRealizationItemMutation, 
    useUpdatePanjarRealizationItemMutation, 
    useUpdateReportStatusPanjarRealizationItemMutation,
    useDeletePanjarRealizationItemMutation 
} = panjarRealizationItemApi;