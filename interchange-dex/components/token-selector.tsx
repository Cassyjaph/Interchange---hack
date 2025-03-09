"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTokens } from "@/hooks/use-tokens"
import { useChain } from "@/hooks/use-chain"
import { cn } from "@/lib/utils"

interface TokenSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (token: any) => void
  selectedToken: any
  otherToken: any
  chainId?: number
}

export default function TokenSelector({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
  otherToken,
  chainId,
}: TokenSelectorProps) {
  const { getTokensByChain } = useTokens()
  const { chains } = useChain()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTokens, setFilteredTokens] = useState<any[]>([])
  const [availableTokens, setAvailableTokens] = useState<any[]>([])

  // Get the chain name for display
  const chainName = chains.find((c) => c.id === chainId)?.name || "Unknown Chain"

  // Initialize tokens based on chainId
  useEffect(() => {
    if (chainId) {
      const tokens = getTokensByChain(chainId)
      setFilteredTokens(tokens)

      // Filter out the token that's already selected in the other input
      const available = tokens.filter((token) => !otherToken || token.symbol !== otherToken.symbol)
      setAvailableTokens(available)
    }
  }, [chainId, getTokensByChain, otherToken])

  // Filter tokens based on search query
  useEffect(() => {
    if (chainId) {
      const tokens = getTokensByChain(chainId)

      if (searchQuery) {
        const filtered = tokens.filter(
          (token) =>
            token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setFilteredTokens(filtered)
      } else {
        setFilteredTokens(tokens)
      }

      // Filter out the token that's already selected in the other input
      const available = filteredTokens.filter((token) => !otherToken || token.symbol !== otherToken.symbol)
      setAvailableTokens(available)
    }
  }, [searchQuery, chainId, getTokensByChain, otherToken, filteredTokens])

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="font-medium text-lg">
            Select a token
            {chainId && <span className="text-sm text-zinc-400 ml-2">on {chainName}</span>}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={18} />
          </Button>
        </div>

        <div className="p-4 border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
            <Input
              placeholder="Search by name or symbol"
              className="pl-9 bg-zinc-800 border-zinc-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[50vh]">
          {availableTokens.length === 0 ? (
            <div className="p-4 text-center text-zinc-400">No tokens found</div>
          ) : (
            availableTokens.map((token) => (
              <button
                key={token.symbol}
                className={cn(
                  "w-full p-3 flex items-center hover:bg-zinc-800 transition-colors",
                  selectedToken?.symbol === token.symbol ? "bg-zinc-800" : "",
                )}
                onClick={() => onSelect(token)}
              >
                <span className="text-2xl mr-3 flex items-center justify-center w-8 h-8">{token.emoji}</span>
                <div className="text-left">
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-zinc-300">{token.name}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="font-medium">{token.balance}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

