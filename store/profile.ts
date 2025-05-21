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
        getRecommendation: builder.query({
            query: () => "/matches/recommendations",
            providesTags: ["profiles"],
        }),
        getProfileById: builder.query({
            query: (id) =>`/profiles/user/${id}`,
            providesTags: ["profiles"],
        }),
        getProviderProfile: builder.query({
            query: () =>`/providers/profile/`,
            providesTags: ["profiles"],
        }),
        getProviderProfileById: builder.query({
            query: (id) =>`/providers/profile/${id}`,
            providesTags: ["profiles"],
        }),
        getProfileByRecommendation: builder.query({
            query: () =>`/profiles/recommendations`,
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
        updateProviderInfo: builder.mutation({
            query: (data) => ({
                url: "/providers/register",
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
          setProfilePhoto: builder.mutation<void, string>({
            query: (filename) => ({
              url: `/profiles/profile/photo/set-profile/${filename}`,
              method: "PATCH",
              
            }),
            invalidatesTags: ["profiles"],
          }),
          RemoveProfilePhoto: builder.mutation<void, string>({
            query: (filename) => ({
              url: `profiles/profile/photo/${filename}`,
              method: "DELETE",
              
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
    useUpdateProfilePhotoMutation,
    useSetProfilePhotoMutation,
    useRemoveProfilePhotoMutation,
    useGetProfileByIdQuery,
    useGetProfileByRecommendationQuery,
    useGetProviderProfileByIdQuery,
    useGetProviderProfileQuery,
    useUpdateProviderInfoMutation,
    useGetRecommendationQuery
} = ProfileApi;