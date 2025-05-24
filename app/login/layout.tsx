import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Debal",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
