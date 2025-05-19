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
            providesTags: ["profiles"],
        }),

        // Personal Info
        updatePersonalInfo: builder.mutation({
            query: (data) => ({
                url: "/profiles/personal-info",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),

        // Neighborhood Preferences
        updateNeighborhood: builder.mutation({
            query: (data) => ({
                url: "/profiles/neighborhood",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),

        // Lifestyle
        updateLifestyle: builder.mutation({
            query: (data) => ({
                url: "/profiles/lifestyle",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),

        // Hobbies
        updateHobbies: builder.mutation({
            query: (data) => ({
                url: "/profiles/hobbies",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),

        // Financial
        updateFinancial: builder.mutation({
            query: (data) => ({
                url: "/profiles/financial",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),

        // Shared Living Preferences
        updateSharedLiving: builder.mutation({
            query: (data) => ({
                url: "/profiles/shared-living",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),

        // Pets
        updatePets: builder.mutation({
            query: (data) => ({
                url: "/profiles/pets",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),

        // Food Preferences
        updateFood: builder.mutation({
            query: (data) => ({
                url: "/profiles/food",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),

        // Work Preferences
        updateWork: builder.mutation({
            query: (data) => ({
                url: "/profiles/work",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),
        updatePrivacy: builder.mutation({
            query: (data) => ({
                url: "/profiles/privacy",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["profiles"],
        }),
        markComplete: builder.mutation({
            query: () => ({
              url: "/profiles/complete",
              method: "POST",
            }),
            invalidatesTags: ["profiles"],
          }),
          updateProfilePhoto: builder.mutation({
            query: (formData) => ({
                url: "/profiles/photo",
                method: "POST",
                body: formData,
              }),
            invalidatesTags: ["profiles"],
          }),

    }),
});
    
export const {
    useGetProfileQuery,
    useUpdatePersonalInfoMutation,
    useUpdateNeighborhoodMutation,
    useUpdateLifestyleMutation,
    useUpdateHobbiesMutation,
    useUpdateFinancialMutation,
    useUpdateSharedLivingMutation,
    useUpdatePetsMutation,
    useUpdateFoodMutation,
    useUpdateWorkMutation,
    useUpdatePrivacyMutation,
    useMarkCompleteMutation,
    useUpdateProfilePhotoMutation
} = ProfileApi;