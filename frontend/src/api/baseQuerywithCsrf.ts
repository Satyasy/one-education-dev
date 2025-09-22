import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQueryWithCsrf = fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    credentials: 'include', // sama dengan withCredentials: true
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    prepareHeaders: async (headers, { endpoint, type }) => {
        // Cek jika ini adalah mutation (POST, PUT, DELETE, PATCH)
        // atau endpoint tertentu yang membutuhkan CSRF
        const needsCsrf = type === 'mutation' || 
                         endpoint?.includes('delete') || 
                         endpoint?.includes('create') || 
                         endpoint?.includes('update');
        
        if (needsCsrf) {
            try {
                // Fetch CSRF cookie sebelum request utama
                await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                    method: 'GET',
                    credentials: 'include',
                });
                
                // Axios secara otomatis menambahkan X-XSRF-TOKEN dari cookie
                // Untuk fetch, kita perlu ambil token dari cookie secara manual
                const xsrfToken = getCookieValue('XSRF-TOKEN');
                if (xsrfToken) {
                    headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken));
                }
            } catch (error) {
                console.error('Failed to fetch CSRF cookie:', error);
            }
        }
        
        return headers;
    },
});

// Helper function untuk ambil cookie value
function getCookieValue(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default baseQueryWithCsrf;
