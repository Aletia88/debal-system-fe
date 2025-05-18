import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    return headers;
  }
});

export const ChatApi = createApi({
  reducerPath: "ChatApi",
  tagTypes: ["Chat", "Conversation", "Message"],
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // Create a new conversation
    createConversation: builder.mutation({
      query: (participantId) => ({
        url: "/chat",
        method: "POST",
        body: { participantId }
      }),
      invalidatesTags: ["Conversation"]
    }),

    // Get conversation messages
    getConversationMessages: builder.query({
      query: (conversationId) => `/chat/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "Message", id: conversationId }
      ]
    }),

    // Send a message
    sendMessage: builder.mutation({
      query: ({ conversationId, content }) => ({
        url: `/chat/${conversationId}/send-message`,
        method: "POST",
        body:  content 
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Message", id: conversationId }
      ]
    }),

    // Mark messages as read
    markMessagesAsRead: builder.mutation({
      query: (messageIds) => ({
        url: "/chat/messages/read",
        method: "POST",
        body: { messageIds }
      }),
      invalidatesTags: ["Message"]
    }),

    // Get user conversations list
    getConversations: builder.query({
      query: () => "/chat/users/conversations",
      providesTags: ["Conversation"]
    }),
    getUsers: builder.query({
      query: () => "/admin/allusers",
      providesTags: ["Conversation"]
    })
  })
});

export const {
  useCreateConversationMutation,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useGetConversationsQuery,
  useGetUsersQuery
} = ChatApi;