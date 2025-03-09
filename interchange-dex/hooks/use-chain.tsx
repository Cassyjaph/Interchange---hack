"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Chain {
  id: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  icon: string
  emoji: string
}

interface ChainContextType {
  currentChain: Chain | null
  chains: Chain[]
  switchChain: (chainId: number) => void
}

// Updated to Cosmos ecosystem chains
const chains: Chain[] = [
  {
    id: 1,
    name: "Cosmos Hub",
    symbol: "ATOM",
    rpcUrl: "https://rpc.cosmos.network",
    blockExplorer: "https://www.mintscan.io/cosmos",
    icon: "/placeholder.svg?height=24&width=24",
    emoji: "⚛️",
  },
  {
    id: 2,
    name: "Osmosis",
    symbol: "OSMO",
    rpcUrl: "https://rpc.osmosis.zone",
    blockExplorer: "https://www.mintscan.io/osmosis",
    icon: "/placeholder.svg?height=24&width=24",
    emoji: "🧪",
  },
  {
    id: 3,
    name: "Juno",
    symbol: "JUNO",
    rpcUrl: "https://rpc.juno.omniflix.co",
    blockExplorer: "https://www.mintscan.io/juno",
    icon: "/placeholder.svg?height=24&width=24",
    emoji: "🪐",
  },
  {
    id: 4,
    name: "Secret Network",
    symbol: "SCRT",
    rpcUrl: "https://rpc.secret.network",
    blockExplorer: "https://www.mintscan.io/secret",
    icon: "/placeholder.svg?height=24&width=24",
    emoji: "🤫",
  },
  {
    id: 5,
    name: "Akash",
    symbol: "AKT",
    rpcUrl: "https://rpc.akash.network",
    blockExplorer: "https://www.mintscan.io/akash",
    icon: "/placeholder.svg?height=24&width=24",
    emoji: "☁️",
  },
  {
    id: 6,
    name: "Stargaze",
    symbol: "STARS",
    rpcUrl: "https://rpc.stargaze.zone",
    blockExplorer: "https://www.mintscan.io/stargaze",
    icon: "/placeholder.svg?height=24&width=24",
    emoji: "✨",
  },
]

const ChainContext = createContext<ChainContextType>({
  currentChain: null,
  chains: [],
  switchChain: () => {},
})

export function ChainProvider({ children }: { children: ReactNode }) {
  const [currentChain, setCurrentChain] = useState<Chain | null>(null)

  // Set default chain on mount
  useEffect(() => {
    const savedChainId = localStorage.getItem("chainId")
    const chainId = savedChainId ? Number.parseInt(savedChainId) : 1 // Default to Cosmos Hub

    const chain = chains.find((c) => c.id === chainId) || chains[0]
    setCurrentChain(chain)
  }, [])

  const switchChain = (chainId: number) => {
    const chain = chains.find((c) => c.id === chainId)
    if (chain) {
      setCurrentChain(chain)
      localStorage.setItem("chainId", chainId.toString())
    }
  }

  return <ChainContext.Provider value={{ currentChain, chains, switchChain }}>{children}</ChainContext.Provider>
}

export const useChain = () => useContext(ChainContext)

