"use client"

import { ChainProvider as ChainContextProvider } from "@/hooks/use-chain"
import type { ReactNode } from "react"

export default function ChainProvider({ children }: { children: ReactNode }) {
  return <ChainContextProvider>{children}</ChainContextProvider>
}

