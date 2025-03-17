"use client"

import { useState, useEffect } from "react"
import { ArrowDown, Settings, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import TokenSelector from "@/components/token-selector"
import { useWallet } from "@/hooks/use-wallet"
import { useChain } from "@/hooks/use-chain"
import { useTokens } from "@/hooks/use-tokens"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function SwapInterface() {
  const { isConnected } = useWallet()
  const { currentChain, chains, switchChain } = useChain()
  const { tokens, getTokenPrice, getTokensByChain } = useTokens()

  const [fromChain, setFromChain] = useState<any>(null)
  const [toChain, setToChain] = useState<any>(null)
  const [fromToken, setFromToken] = useState<any>(null)
  const [toToken, setToToken] = useState<any>(null)
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")
  const [isFromTokenModalOpen, setIsFromTokenModalOpen] = useState(false)
  const [isToTokenModalOpen, setIsToTokenModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [swapRate, setSwapRate] = useState<string | null>(null)
  const [priceImpact, setPriceImpact] = useState<string>("0.00")
  const [bridgeFee, setBridgeFee] = useState<string>("0.00")
  const [fromTokens, setFromTokens] = useState<any[]>([])
  const [toTokens, setToTokens] = useState<any[]>([])
  const [isUserEditingToField, setIsUserEditingToField] = useState(false)

  // Set default chains when component mounts
  useEffect(() => {
    if (chains.length > 0) {
      if (!fromChain) {
        setFromChain(chains[0])
      }
      if (!toChain) {
        setToChain(chains.length > 1 ? chains[1] : chains[0])
      }
    }
  }, [chains, fromChain, toChain])

  // Update tokens when chains change
  useEffect(() => {
    if (fromChain) {
      const chainTokens = getTokensByChain(fromChain.id)
      setFromTokens(chainTokens)

      // Reset from token if it doesn't exist on the new chain
      if (fromToken && !chainTokens.some((t) => t.symbol === fromToken.symbol)) {
        setFromToken(chainTokens.length > 0 ? chainTokens[0] : null)
      } else if (!fromToken && chainTokens.length > 0) {
        setFromToken(chainTokens[0])
      }
    }
  }, [fromChain, getTokensByChain, fromToken])

  useEffect(() => {
    if (toChain) {
      const chainTokens = getTokensByChain(toChain.id)
      setToTokens(chainTokens)

      // Reset to token if it doesn't exist on the new chain
      if (toToken && !chainTokens.some((t) => t.symbol === toToken.symbol)) {
        setToToken(chainTokens.length > 0 ? chainTokens[0] : null)
      } else if (!toToken && chainTokens.length > 0) {
        setToToken(chainTokens[0])
      }
    }
  }, [toChain, getTokensByChain, toToken])

  // Calculate swap rate when tokens change
  useEffect(() => {
    if (fromToken && toToken) {
      const fromPrice = getTokenPrice(fromToken.symbol)
      const toPrice = getTokenPrice(toToken.symbol)

      if (fromPrice && toPrice) {
        const rate = (fromPrice / toPrice).toFixed(6)
        setSwapRate(`1 ${fromToken.symbol} = ${rate} ${toToken.symbol}`)
      }

      // Set bridge fee if cross-chain swap
      if (fromChain && toChain && fromChain.id !== toChain.id) {
        // Simulate a bridge fee (0.1% to 0.3%)
        const fee = (Math.random() * 0.2 + 0.1).toFixed(2)
        setBridgeFee(fee)
      } else {
        setBridgeFee("0.00")
      }
    }
  }, [fromToken, toToken, fromChain, toChain, getTokenPrice])

  // Calculate to amount when from amount changes
  useEffect(() => {
    // Skip calculation if the user is currently editing the "to" field
    if (fromToken && toToken && fromAmount && !isUserEditingToField) {
      setIsLoading(true)

      // Simulate API call delay
      const timer = setTimeout(() => {
        const fromPrice = getTokenPrice(fromToken.symbol)
        const toPrice = getTokenPrice(toToken.symbol)

        if (fromPrice && toPrice) {
          // Apply bridge fee if cross-chain
          const bridgeFeeMultiplier = fromChain.id !== toChain.id ? 1 - Number.parseFloat(bridgeFee) / 100 : 1

          const calculatedAmount = (
            (Number.parseFloat(fromAmount) * fromPrice * bridgeFeeMultiplier) /
            toPrice
          ).toFixed(6)

          setToAmount(calculatedAmount)

          // Simulate price impact
          const impact = (Math.random() * 0.5).toFixed(2)
          setPriceImpact(impact)
        }

        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    } else if (!fromAmount) {
      setToAmount("")
    }
  }, [fromAmount, fromToken, toToken, fromChain, toChain, bridgeFee, getTokenPrice, isUserEditingToField])

  const handleSwapTokens = () => {
    // Swap chains
    const tempChain = fromChain
    setFromChain(toChain)
    setToChain(tempChain)

    // Swap tokens
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)

    // Swap amounts
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = async () => {
    if (!isConnected || !fromToken || !toToken || !fromAmount || !toAmount) return

    setIsLoading(true)

    // Simulate transaction
    setTimeout(() => {
      setIsLoading(false)
      setFromAmount("")
      setToAmount("")

      // Show success notification (would be implemented with a toast)
      alert(
        `Swap successful: ${fromAmount} ${fromToken.symbol} (${fromChain.name}) to ${toAmount} ${toToken.symbol} (${toChain.name})`,
      )
    }, 2000)
  }

  const isSwapDisabled = !isConnected || !fromToken || !toToken || !fromAmount || !toAmount || isLoading

  const calculateFromAmount = (amount: string) => {
    if (fromToken && toToken && amount) {
      setIsLoading(true)

      // Simulate API call delay
      const timer = setTimeout(() => {
        const fromPrice = getTokenPrice(fromToken.symbol)
        const toPrice = getTokenPrice(toToken.symbol)

        if (fromPrice && toPrice) {
          // Apply bridge fee if cross-chain (in reverse)
          const bridgeFeeMultiplier = fromChain.id !== toChain.id ? 1 + Number.parseFloat(bridgeFee) / 100 : 1

          const calculatedAmount = ((Number.parseFloat(amount) * toPrice) / (fromPrice * bridgeFeeMultiplier)).toFixed(
            6,
          )

          setFromAmount(calculatedAmount)

          // Simulate price impact
          const impact = (Math.random() * 0.5).toFixed(2)
          setPriceImpact(impact)
        }

        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }

  return (
    <>
      <Card className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Swap</h2>
          <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white">
            <Settings size={18} />
          </Button>
        </div>

        {/* From Chain & Token */}
        <div className="bg-zinc-800 rounded-xl p-4 mb-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-300">From</span>
            {fromToken && (
              <span className="text-sm text-zinc-300">
                Balance: {fromToken.balance} {fromToken.symbol}
              </span>
            )}
          </div>

          <div className="flex items-center mb-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => {
                setIsUserEditingToField(false)
                setFromAmount(e.target.value)
              }}
              placeholder="0.0"
              className="bg-transparent text-2xl font-medium focus:outline-none w-full"
            />

            <Button
              variant="ghost"
              className="ml-2 h-10 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl"
              onClick={() => setIsFromTokenModalOpen(true)}
            >
              {fromToken ? (
                <div className="flex items-center">
                  <span className="text-xl mr-2">{fromToken.emoji}</span>
                  <span>{fromToken.symbol}</span>
                  <ArrowDown className="ml-2 h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Select token</span>
                  <ArrowDown className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </div>

          {/* From Chain Selector */}
          <div className="flex items-center justify-end">
            <span className="text-xs text-zinc-400 mr-2">Network:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 py-1 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-sm"
                >
                  <span className="mr-1 text-base">{fromChain?.emoji}</span>
                  {fromChain?.name}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                {chains.map((chain) => (
                  <DropdownMenuItem
                    key={chain.id}
                    onClick={() => setFromChain(chain)}
                    className={cn("cursor-pointer", chain.id === fromChain?.id ? "bg-zinc-800" : "")}
                  >
                    <span className="mr-2 text-base">{chain.emoji}</span>
                    {chain.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-3 z-10 relative">
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-800 border border-zinc-700 rounded-full p-2 text-zinc-400 hover:text-white"
            onClick={handleSwapTokens}
          >
            <ArrowDown size={16} />
          </motion.button>
        </div>

        {/* To Chain & Token */}
        <div className="bg-zinc-800 rounded-xl p-4 mt-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-300">To</span>
            {toToken && (
              <span className="text-sm text-zinc-300">
                Balance: {toToken.balance} {toToken.symbol}
              </span>
            )}
          </div>

          <div className="flex items-center mb-3">
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <input
                type="number"
                value={toAmount}
                onChange={(e) => {
                  setIsUserEditingToField(true)
                  setToAmount(e.target.value)
                  calculateFromAmount(e.target.value)
                }}
                placeholder="0.0"
                className="bg-transparent text-2xl font-medium focus:outline-none w-full"
              />
            )}

            <Button
              variant="ghost"
              className="ml-2 h-10 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl"
              onClick={() => setIsToTokenModalOpen(true)}
            >
              {toToken ? (
                <div className="flex items-center">
                  <span className="text-xl mr-2">{toToken.emoji}</span>
                  <span>{toToken.symbol}</span>
                  <ArrowDown className="ml-2 h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Select token</span>
                  <ArrowDown className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </div>

          {/* To Chain Selector */}
          <div className="flex items-center justify-end">
            <span className="text-xs text-zinc-400 mr-2">Network:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 py-1 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-sm"
                >
                  <span className="mr-1 text-base">{toChain?.emoji}</span>
                  {toChain?.name}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                {chains.map((chain) => (
                  <DropdownMenuItem
                    key={chain.id}
                    onClick={() => setToChain(chain)}
                    className={cn("cursor-pointer", chain.id === toChain?.id ? "bg-zinc-800" : "")}
                  >
                    <span className="mr-2 text-base">{chain.emoji}</span>
                    {chain.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Cross-chain indicator */}
        {fromChain && toChain && fromChain.id !== toChain.id && (
          <div className="mt-4 p-2 bg-blue-900/30 border border-blue-800/50 rounded-lg flex items-center">
            <span className="text-sm text-blue-300 flex items-center">
              <Info size={14} className="mr-2" />
              Cross-chain swap: {fromChain.name} → {toChain.name}
            </span>
          </div>
        )}

        {/* Swap details */}
        {fromToken && toToken && fromAmount && toAmount && (
          <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-300">Rate</span>
              <div className="flex items-center">
                <span>{swapRate}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-zinc-300">
                  <RefreshCw size={12} />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 text-sm">
              <div className="flex items-center">
                <span className="text-zinc-300">Price Impact</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-zinc-300">
                        <Info size={12} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        The difference between the market price and estimated price due to trade size.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className={cn(Number.parseFloat(priceImpact) > 0.3 ? "text-amber-400" : "text-green-400")}>
                {priceImpact}%
              </span>
            </div>

            {/* Bridge fee for cross-chain swaps */}
            {fromChain && toChain && fromChain.id !== toChain.id && (
              <div className="flex justify-between items-center mt-2 text-sm">
                <div className="flex items-center">
                  <span className="text-zinc-300">Bridge Fee</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-zinc-300">
                          <Info size={12} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Fee for bridging assets between different blockchains.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-zinc-300">{bridgeFee}%</span>
              </div>
            )}
          </div>
        )}

        {/* Swap button */}
        <Button
          className={cn(
            "w-full mt-4 h-12 text-base font-medium",
            isConnected
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              : "bg-gradient-to-r from-purple-600 to-blue-600",
          )}
          disabled={isSwapDisabled}
          onClick={isConnected ? handleSwap : () => {}}
        >
          {!isConnected ? (
            "Connect Wallet"
          ) : !fromToken || !toToken ? (
            "Select Tokens"
          ) : !fromAmount || !toAmount ? (
            "Enter Amount"
          ) : isLoading ? (
            <div className="flex items-center">
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Swapping...
            </div>
          ) : fromChain.id !== toChain.id ? (
            "Swap Across Chains"
          ) : (
            "Swap"
          )}
        </Button>
      </Card>

      <AnimatePresence>
        {isFromTokenModalOpen && (
          <TokenSelector
            isOpen={isFromTokenModalOpen}
            onClose={() => setIsFromTokenModalOpen(false)}
            onSelect={(token) => {
              setFromToken(token)
              setIsFromTokenModalOpen(false)
            }}
            selectedToken={fromToken}
            otherToken={toToken}
            chainId={fromChain?.id}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isToTokenModalOpen && (
          <TokenSelector
            isOpen={isToTokenModalOpen}
            onClose={() => setIsToTokenModalOpen(false)}
            onSelect={(token) => {
              setToToken(token)
              setIsToTokenModalOpen(false)
            }}
            selectedToken={toToken}
            otherToken={fromToken}
            chainId={toChain?.id}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Import ChevronDown
import { ChevronDown } from "lucide-react"

