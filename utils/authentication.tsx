"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, LoadingOverlay } from "@mantine/core";
import { useSelector } from "react-redux"; // Use Redux selector

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Get the authentication status from Redux state
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  useEffect(() => {
    // Check for loading state and authentication
    if (!loading) {
      if (!isAuthenticated && pathname !== "/" ) {
        router.push("/"); // Redirect to login if not authenticated
      }
    }
  }, [isAuthenticated, loading, pathname, router]);
  // Simulate a loading effect for user authentication check
  useEffect(() => {
    setLoading(false); // Set loading to false after checking the state
  }, []);

  if (loading) {
    return (
      <Box pos="relative">
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "pink", type: "bars" }}
        />
      </Box>
    );
  }

  // Render children if authenticated or if on login page
  return (
    <>
      {isAuthenticated || pathname === "/" 
        ? children
        : null}
    </>
  );
};

export default ProtectedRoute;
