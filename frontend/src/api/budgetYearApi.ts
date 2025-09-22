import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axiosBaseQuery'
import { BudgetYear } from '../types/budget'

const baseUrl = import.meta.env.VITE_SERVER_URL || ''

export interface BudgetYearResponse {
	data: BudgetYear[]
	meta?: {
		total: number
		total_pages: number
	}
}

export const budgetYearApi = createApi({
	reducerPath: 'budgetYearApi',
	baseQuery: axiosBaseQuery({ baseUrl: baseUrl }),
	tagTypes: ['BudgetYear'],
	endpoints: (builder) => ({
		getBudgetYears: builder.query<BudgetYearResponse, void>({
			query: () => ({
				url: '/budget-years',
				method: 'GET',
			}),
			providesTags: ['BudgetYear'],
		}),
		getActiveBudgetYear: builder.query<{ data: BudgetYear }, void>({
			query: () => ({
				url: '/budget-years/active',
				method: 'GET',
			}),
			providesTags: ['BudgetYear'],
		}),
	}),
})

export const { useGetBudgetYearsQuery, useGetActiveBudgetYearQuery } = budgetYearApi
