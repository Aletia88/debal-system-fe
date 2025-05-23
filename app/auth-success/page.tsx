'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const token = router.query.token;

    // Handle case where token is an array by taking the first element
    const authToken = Array.isArray(token) ? token[0] : token;

    if (authToken) {
      localStorage.setItem('token', authToken); // Or use cookies
      router.push('/'); // Redirect to protected page
    } else {
      router.push('/login'); // In case token is missing
    }
  }, [router.isReady, router.query.token]);

  return <p>Logging you in...</p>;
}