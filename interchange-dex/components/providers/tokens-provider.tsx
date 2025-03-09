"use client"

import { TokensProvider as TokensContextProvider } from "@/hooks/use-tokens"
import type { ReactNode } from "react"

export default function TokensProvider({ children }: { children: ReactNode }) {
  return <TokensContextProvider>{children}</TokensContextProvider>
}

