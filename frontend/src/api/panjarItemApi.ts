import { createApi } from "@reduxjs/toolkit/query/react";
import { CreatePanjarItemRequest, UpdatePanjarItemRequest, PanjarItemRequest } from "../types/panjarItem";
import { axiosBaseQuery } from "./axiosBaseQuery";
import { PanjarItem } from "../types/panjar";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const panjarItemApi = createApi({
    reducerPath: "panjarItemApi",
    baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
    tagTypes: ["PanjarItem"],
    endpoints: (builder) => ({
        getPanjarItems: builder.query<PanjarItem[], { panjar_id: number }>({
            query: ({ panjar_id }) => ({ 
                url: `/panjar-items/${panjar_id}`, 
                method: "GET",
            }),
            transformResponse: (response: { data: PanjarItem[] }) => response.data,
            providesTags: ["PanjarItem"],
        }),
        getPanjarItemById: builder.query<PanjarItem, { panjar_item_id: number }>({
            query: ({ panjar_item_id }) => ({ 
                url: `/panjar-items/${panjar_item_id}`, 
                method: "GET",
            }),
            transformResponse: (response: { data: PanjarItem }) => response.data,
            providesTags: ["PanjarItem"],
        }),
        addPanjarItem: builder.mutation<PanjarItem, { panjar_request_id: number, data: CreatePanjarItemRequest }>({
            query: ({ panjar_request_id, data }) => ({ 
                url: `/panjar-items/${panjar_request_id}`,  
                method: "POST",
                body: data,
            }),
            transformResponse: (response: { data: PanjarItem }) => response.data,
            invalidatesTags: ["PanjarItem"],
        }),
        updatePanjarItem: builder.mutation<PanjarItem, { panjar_item_id: number, data: UpdatePanjarItemRequest }>({
            query: ({ panjar_item_id, data }) => ({ 
                url: `/panjar-items/${panjar_item_id}`, 
                method: "PATCH",
                body: data,
            }),
            transformResponse: (response: { data: PanjarItem }) => response.data,
            invalidatesTags: ["PanjarItem"],
        }),
        updateStatusPanjarItem: builder.mutation<PanjarItem, { panjar_item_id: number, data: PanjarItemRequest }>({
            query: ({ panjar_item_id, data }) => ({ 
                url: `/panjar-items/${panjar_item_id}/status`, 
                method: "PATCH",
                body: data,
            }),
            transformResponse: (response: { data: PanjarItem }) => response.data,
            invalidatesTags: ["PanjarItem"],
        }),
    }),
});

export const { useGetPanjarItemsQuery, useGetPanjarItemByIdQuery, useUpdateStatusPanjarItemMutation, useAddPanjarItemMutation, useUpdatePanjarItemMutation } = panjarItemApi;