"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"

export default function WalletConnect() {
  const { connect, isConnected, address } = useWallet()
  const [isOpen, setIsOpen] = useState(false)

  // Updated for Cosmos wallets
  const wallets = [
    {
      id: "keplr",
      name: "Keplr Wallet",
      icon: "/placeholder.svg?height=40&width=40",
      description: "Connect to your Keplr Wallet",
      emoji: "🔑",
    },
    {
      id: "leap",
      name: "Leap Wallet",
      icon: "/placeholder.svg?height=40&width=40",
      description: "Connect to your Leap Wallet",
      emoji: "🦘",
    },
    {
      id: "cosmostation",
      name: "Cosmostation",
      icon: "/placeholder.svg?height=40&width=40",
      description: "Connect to your Cosmostation Wallet",
      emoji: "🌌",
    },
  ]

  const handleConnect = (walletId: string) => {
    connect("cosmoshub-4")
    setIsOpen(false)
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          {isConnected ? formatAddress(address || "") : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {wallets.map((wallet) => (
            <motion.button
              key={wallet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-4 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors"
              onClick={() => handleConnect(wallet.id)}
            >
              <div className="flex items-center justify-center text-2xl w-10 h-10 rounded-full mr-4">
                {wallet.emoji}
              </div>
              <div className="text-left">
                <h3 className="font-medium">{wallet.name}</h3>
                <p className="text-sm text-zinc-300">{wallet.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

