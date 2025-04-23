import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile | Nest",
  description: "View and edit your profile information",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
