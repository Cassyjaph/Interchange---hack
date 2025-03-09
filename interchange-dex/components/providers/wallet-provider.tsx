"use client"

import { WalletProvider as WalletContextProvider } from "@/hooks/use-wallet"
import type { ReactNode } from "react"

export default function WalletProvider({ children }: { children: ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>
}

