import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SignUp | Debal",
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
