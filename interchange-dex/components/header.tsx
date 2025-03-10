"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { useChain } from "@/hooks/use-chain"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Header() {
  const { connect, disconnect, isConnected, address } = useWallet()
  const { currentChain, chains, switchChain } = useChain()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-black/90 backdrop-blur-md border-b border-zinc-700" : "bg-transparent",
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Interchange
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-zinc-200 hover:text-white transition-colors">
              Swap
            </Link>
            <Link href="/" className="text-zinc-200 hover:text-white transition-colors">
              Pools
            </Link>
            <Link href="/" className="text-zinc-200 hover:text-white transition-colors">
              Bridge
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {currentChain && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                    <span className="mr-2 text-lg">{currentChain.emoji}</span>
                    {currentChain.name}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                  {chains.map((chain) => (
                    <DropdownMenuItem
                      key={chain.id}
                      onClick={() => switchChain(chain.id)}
                      className={cn("cursor-pointer", chain.id === currentChain.id ? "bg-zinc-800" : "")}
                    >
                      <span className="mr-2 text-lg">{chain.emoji}</span>
                      {chain.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    {formatAddress(address || "")}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem onClick={disconnect} className="cursor-pointer">
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => connect("cosmoshub-4")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-zinc-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-zinc-700"
          >
            <div className="container max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="text-zinc-200 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Swap
              </Link>
              <Link
                href="/pools"
                className="text-zinc-200 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pools
              </Link>
              <Link
                href="/bridge"
                className="text-zinc-200 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bridge
              </Link>

              <div className="pt-2 border-t border-zinc-800 flex flex-col space-y-4">
                {currentChain && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                      >
                        <div className="flex items-center">
                          <span className="mr-2 text-lg">{currentChain.emoji}</span>
                          {currentChain.name}
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      {chains.map((chain) => (
                        <DropdownMenuItem
                          key={chain.id}
                          onClick={() => switchChain(chain.id)}
                          className={cn("cursor-pointer", chain.id === currentChain.id ? "bg-zinc-800" : "")}
                        >
                          <span className="mr-2 text-lg">{chain.emoji}</span>
                          {chain.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {isConnected ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          {formatAddress(address || "")}
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem onClick={disconnect} className="cursor-pointer">
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    onClick={() => connect("cosmoshub-4")}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

