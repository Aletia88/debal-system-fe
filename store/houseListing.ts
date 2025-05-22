import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
  radius?: number;
}
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
    tagTypes: ["listing", "Returns"],
    baseQuery: baseQuery,

    endpoints: (builder) => ({

      createListing: builder.mutation({
        query: (formData: FormData) => ({
          url: "/list",
          method: "POST",
          body:  formData 
        }),
        invalidatesTags: ['listing'],
      }),
      createRules: builder.mutation({
        query: (formData: FormData) => ({
          url: "/house-rules",
          method: "POST",
          body:  formData 
        }),
        invalidatesTags: ['listing'],
      }),
      getList: builder.query({
        query: () => `/list`,
        providesTags: ["listing"]
      }),
      getAllList: builder.query({
        query: () => `/list/all/get`,
        providesTags: ["listing"]
      }),
      getHouseRules: builder.query({
        query: () => `/house-rules `,
        providesTags: ["listing"]
      }),
      getHouseListing: builder.query({
        query: (id) => `/list/${id}`,
        providesTags: ["listing"]
      }),
      getHouseRuleById: builder.query({
        query: (id) => `/house-rules/${id}`,
        providesTags: ["listing"]
      }),
      getFilteredListings: builder.query({
        query: (params) => {
          // Create a params object with only defined values
          const queryParams: Record<string, string> = {};
          
          if (params.minPrice !== undefined) {
            queryParams.minPrice = params.minPrice.toString();
          }
          if (params.maxPrice !== undefined) {
            queryParams.maxPrice = params.maxPrice.toString();
          }
          if (params.bedrooms !== undefined) {
            queryParams.bedrooms = params.bedrooms.toString();
          }
          if (params.location) {
            queryParams.location = params.location;
          }
          if (params.radius !== undefined) {
            queryParams.radius = params.radius.toString();
          }
  
          return {
            url: '/list/filter/lists',
            params: queryParams
          };
        },
      }),
      deleteListing: builder.mutation<void, string>({
        query: (id) => ({
          url: `list/${id}`,
          method: 'DELETE',
        }),
        // Optional: Invalidate cache for listings after deletion
        invalidatesTags: ['listing'],
      }),
      updateListing: builder.mutation({
        query: ({ id, data }) => ({
          url: `list/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['listing'],
      }),
      updateRule: builder.mutation({
        query: ({ id, data }) => ({
          url: `house-rules/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['listing'],
      }),
      uploadListingImages: builder.mutation({
        query: ({ id, images }) => ({
          url: `listings/${id}/images`,
          method: 'POST',
          body: images,
        }),
        invalidatesTags: ['listing'],
      }),
      deleteListingImage: builder.mutation({
        query: ({ id, imageId }) => ({
          url: `list/images/${id}/${imageId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['listing'],
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
useGetAllListQuery,
useGetFilteredListingsQuery,
useDeleteListingMutation,
useUpdateListingMutation,
useUploadListingImagesMutation,
useDeleteListingImageMutation,
useGetHouseRulesQuery,
useCreateRulesMutation,
useGetHouseRuleByIdQuery,
useLazyGetAllListQuery,
useUpdateRuleMutation

}= HouseApi