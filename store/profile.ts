import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
  
      // Set Authorization header if token exists
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
  
      // Set content type and accept headers for proper request handling
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
  
      return headers;
    }
});
  
export const ProfileApi = createApi({
    reducerPath: "ProfileApi",
    tagTypes: ["profiles", "Returns"],
    baseQuery: baseQuery,

    endpoints: (builder) => ({

        getProfile: builder.query({
            query: () => "/profiles/me",
            // providesTags: ["profiles"],
          }),

        }),
    });
    
    export const {
useGetProfileQuery
    } = ProfileApi