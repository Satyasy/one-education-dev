import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "../types/auth";
import { CreatedUser, CreateUserRequest } from "../types/user";
import { axiosBaseQuery } from "./axiosBaseQuery";

type UserResponse = {
  data: User[];
  meta: {
    total: number;
    total_pages: number;
  };
};

const baseUrl = import.meta.env.VITE_SERVER_URL;
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, { page?: number; per_page?: number; search?: string; role?: string }>({
      query: ({ page = 1, per_page = 10, search = "", role = "" }) => ({
        url: "/users",
        method: "GET",
        params: { page, per_page, search, role },
      }),
      providesTags: ["Users"],
    }),
    getUserCreateFormData: builder.query<{ message: string; data: { roles: { id: number; name: string }[]; permissions: { id: number; name: string; description: string }[] } }, void>({
      query: () => ({
        url: "/users/create/form-data",
        method: "GET",
      }),
    }),
    createUser: builder.mutation<{ message: string; data: CreatedUser }, CreateUserRequest>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserCreateFormDataQuery, useCreateUserMutation } = userApi;
