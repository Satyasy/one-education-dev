import apiClient from "./axiosConfig";
import { AxiosRequestConfig, AxiosError } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string
      method?: AxiosRequestConfig['method']
      body?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    unknown
  > =>
    async ({ url, method, body, params }) => {
    try {
      let config: AxiosRequestConfig = {
        url: baseUrl + url,
        method,
        data: body,
        params,
      };

      // If body is FormData, create a new request without the default headers
      if (body instanceof FormData) {
        // Use a fresh axios instance without the default Content-Type header
        const axios = (await import('axios')).default;
        const formDataClient = axios.create({
          baseURL: apiClient.defaults.baseURL,
          withCredentials: true,
          withXSRFToken: true,
          headers: {
            Accept: "application/json",
            // Don't set Content-Type - let browser handle it
          },
        });

        console.log('Using FormData-specific axios client');
        const result = await formDataClient({
          url: url, // Don't add baseUrl again since it's in the client
          method,
          data: body,
          params,
        });
        return { data: result.data };
      }

      // For non-FormData requests, use the regular client
      const result = await apiClient(config);
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }



