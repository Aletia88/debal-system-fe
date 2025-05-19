"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { usePathname } from "next/navigation";
import { Notifications } from "@mantine/notifications";
import { NavbarDemo } from "@/app/components/header";
import ProtectedRoute from "@/utils/authentication";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isSignUpPage = pathname === '/signup';
  const isChatPage = pathname === '/chat';

  return (
    <SessionProvider>
      <Provider store={store}>
        <ProtectedRoute>
          <Notifications />
          {!isLoginPage && !isSignUpPage && !isChatPage && <NavbarDemo />}
          <div>
            {children}
          </div>
        </ProtectedRoute>
      </Provider>
    </SessionProvider>
  );
}