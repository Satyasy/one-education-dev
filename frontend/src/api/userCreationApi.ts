import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithCsrf from './baseQuerywithCsrf'

export interface Role {
  id: number
  name: string
  guard_name: string
}

export interface Permission {
  id: number
  name: string
  guard_name: string
}

export interface CreateUserFormData {
  roles: Role[]
  permissions: Permission[]
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  roles?: string[]
  permissions?: string[]
}

export interface CreatedUser {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  roles: Role[]
  permissions: {
    all_permissions: Array<Permission & { source: string }>
    permission_names: string[]
    permissions_via_roles: Permission[]
    direct_permissions: Permission[]
  }
  employee: any
  student: any
  approval_hierarchy: {
    verifiers: any[]
    approvers: any[]
  }
  finance_verification_hierarchy: {
    finance_verifiers: any[]
  }
  finance_approval_hierarchy: {
    finance_approvers: any[]
  }
}

export const userCreationApi = createApi({
  reducerPath: 'userCreationApi',
  baseQuery: baseQueryWithCsrf,
  tagTypes: ['UserFormData', 'User'],
  endpoints: (builder) => ({
    // Get form data for user creation
    getUserCreateFormData: builder.query<{
      message: string
      data: CreateUserFormData
    }, void>({
      query: () => ({
        url: '/users/create/form-data',
        method: 'GET',
      }),
      providesTags: ['UserFormData'],
    }),

    // Create new user with roles and permissions
    createUser: builder.mutation<{
      message: string
      data: CreatedUser
    }, CreateUserRequest>({
      query: (userData: CreateUserRequest) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUserCreateFormDataQuery,
  useCreateUserMutation,
} = userCreationApi
