"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useChain } from "@/hooks/use-chain"

interface Token {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logo: string
  balance: string
  emoji: string
}

interface TokenContextType {
  tokens: Token[]
  getTokenPrice: (symbol: string) => number | null
  getTokensByChain: (chainId: number) => Token[]
}

const TokenContext = createContext<TokenContextType>({
  tokens: [],
  getTokenPrice: () => null,
  getTokensByChain: () => [],
})

// Mock token data updated for Cosmos ecosystem with emojis
const mockTokens: Token[] = [
  {
    chainId: 1,
    address: "cosmos1...",
    name: "Cosmos",
    symbol: "ATOM",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "10.5",
    emoji: "⚛️",
  },
  {
    chainId: 1,
    address: "cosmos1...",
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "100.00",
    emoji: "💵",
  },
  {
    chainId: 1,
    address: "cosmos1...",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "250.00",
    emoji: "💲",
  },
  {
    chainId: 2,
    address: "osmo1...",
    name: "Osmosis",
    symbol: "OSMO",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "75.25",
    emoji: "🧪",
  },
  {
    chainId: 2,
    address: "osmo1...",
    name: "Cosmos",
    symbol: "ATOM",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "5.5",
    emoji: "⚛️",
  },
  {
    chainId: 2,
    address: "osmo1...",
    name: "Axelar",
    symbol: "AXL",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "120.00",
    emoji: "🔄",
  },
  {
    chainId: 3,
    address: "juno1...",
    name: "Juno",
    symbol: "JUNO",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "30.00",
    emoji: "🪐",
  },
  {
    chainId: 3,
    address: "juno1...",
    name: "Neta",
    symbol: "NETA",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "0.5",
    emoji: "🌠",
  },
  {
    chainId: 4,
    address: "secret1...",
    name: "Secret",
    symbol: "SCRT",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "45.00",
    emoji: "🤫",
  },
  {
    chainId: 5,
    address: "akash1...",
    name: "Akash",
    symbol: "AKT",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "100.00",
    emoji: "☁️",
  },
  {
    chainId: 6,
    address: "stars1...",
    name: "Stargaze",
    symbol: "STARS",
    decimals: 6,
    logo: "/placeholder.svg?height=40&width=40",
    balance: "1000.00",
    emoji: "✨",
  },
]

// Mock token prices
const mockPrices: Record<string, number> = {
  ATOM: 8.5,
  OSMO: 0.38,
  JUNO: 0.25,
  SCRT: 0.3,
  AKT: 1.2,
  STARS: 0.01,
  USDT: 1,
  USDC: 1,
  AXL: 0.5,
  NETA: 20.0,
}

export function TokensProvider({ children }: { children: ReactNode }) {
  const { currentChain } = useChain()
  const [tokens, setTokens] = useState<Token[]>([])

  // Update tokens when chain changes
  useEffect(() => {
    if (currentChain) {
      // Filter tokens for current chain
      const chainTokens = mockTokens.filter((token) => token.chainId === currentChain.id)
      setTokens(chainTokens)
    }
  }, [currentChain])

  const getTokenPrice = (symbol: string): number | null => {
    return mockPrices[symbol] || null
  }

  const getTokensByChain = (chainId: number): Token[] => {
    return mockTokens.filter((token) => token.chainId === chainId)
  }

  return <TokenContext.Provider value={{ tokens, getTokenPrice, getTokensByChain }}>{children}</TokenContext.Provider>
}

export const useTokens = () => useContext(TokenContext)

