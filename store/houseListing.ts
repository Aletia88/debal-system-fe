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
  
export const HouseApi = createApi({
    reducerPath: "HouseApi",
    tagTypes: ["profiles", "Returns"],
    baseQuery: baseQuery,

    endpoints: (builder) => ({

      createListing: builder.mutation({
        query: (formData: FormData) => ({
          url: "/list",
          method: "POST",
          body:  formData 
        }),
      }),
      getList: builder.query({
        query: () => `/list`,
        // providesTags: ["Message"]
      }),
      getHouseListing: builder.query({
        query: (id) => `/list/${id}`,
      }),
      // createListing: builder.mutation({
      //   query: (formData) => ({
      //     url: '/list',
      //     method: 'POST',
      //     body: formData,
      //   }),
   
    }),
});
    
export const {
  useCreateListingMutation,
  useGetListQuery,
useGetHouseListingQuery,

}= HouseApi