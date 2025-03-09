"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { SigningStargateClient } from "@cosmjs/stargate"
import { Registry } from "@cosmjs/proto-signing"

// Add Keplr type definitions
declare global {
  interface Window {
    keplr: {
      enable: (chainId: string) => Promise<void>
      experimentalSuggestChain: (config: ChainInfo) => Promise<void>
      getOfflineSigner: (chainId: string) => any // You can use a more specific type here if needed
    }
  }
}

// Chain configuration interface
interface ChainConfig {
  chainId: string
  chainName: string
  rpc: string
  rest: string
  stakeCurrency: string
  bech32Prefix: string
  feeCurrencies: string[]
}

// Keplr chain info interface
interface ChainInfo {
  chainId: string
  chainName: string
  rpc: string
  rest: string
  stakeCurrency: {
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
  }
  bip44: {
    coinType: number
  }
  bech32Config: {
    bech32PrefixAccAddr: string
    bech32PrefixAccPub: string
    bech32PrefixValAddr: string
    bech32PrefixValPub: string
    bech32PrefixConsAddr: string
    bech32PrefixConsPub: string
  }
  currencies: Array<{
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
  }>
  feeCurrencies: Array<{
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
  }>
  coinType: number
  gasPriceStep: {
    low: number
    average: number
    high: number
  }
}

const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  "cosmoshub-4": {
    chainId: "cosmoshub-4",
    chainName: "Cosmos Hub",
    rpc: "https://cosmos-rpc.polkachu.com",
    rest: "https://rest.cosmos.directory/cosmoshub",
    stakeCurrency: "uatom",
    bech32Prefix: "cosmos",
    feeCurrencies: ["uatom"],
  },
  "osmosis-1": {
    chainId: "osmosis-1",
    chainName: "Osmosis",
    rpc: "https://osmosis-rpc.polkachu.com",
    rest: "https://rest.cosmos.directory/osmosis",
    stakeCurrency: "uosmo",
    bech32Prefix: "osmo",
    feeCurrencies: ["uosmo"],
  },
}

interface WalletContextType {
  connect: (chainId: string) => Promise<void>
  disconnect: () => void
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: string | null
  client: SigningStargateClient | null
}

const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
  client: null,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [client, setClient] = useState<SigningStargateClient | null>(null)

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress")
    const savedChainId = localStorage.getItem("chainId")
    if (savedAddress && savedChainId) {
      setIsConnected(true)
      setAddress(savedAddress)
      setChainId(savedChainId)
    }
  }, [])

  const connect = async (selectedChainId: string) => {
    try {
      if (!window.keplr) {
        throw new Error("Keplr wallet not installed")
      }

      const chainConfig = CHAIN_CONFIGS[selectedChainId]
      if (!chainConfig) {
        throw new Error("Unsupported chain ID")
      }

      await window.keplr.experimentalSuggestChain({
        chainId: chainConfig.chainId,
        chainName: chainConfig.chainName,
        rpc: chainConfig.rpc,
        rest: chainConfig.rest,
        stakeCurrency: {
          coinDenom: chainConfig.stakeCurrency.toUpperCase(),
          coinMinimalDenom: chainConfig.stakeCurrency,
          coinDecimals: 6,
        },
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: chainConfig.bech32Prefix,
          bech32PrefixAccPub: `${chainConfig.bech32Prefix}pub`,
          bech32PrefixValAddr: `${chainConfig.bech32Prefix}valoper`,
          bech32PrefixValPub: `${chainConfig.bech32Prefix}valoperpub`,
          bech32PrefixConsAddr: `${chainConfig.bech32Prefix}valcons`,
          bech32PrefixConsPub: `${chainConfig.bech32Prefix}valconspub`,
        },
        currencies: chainConfig.feeCurrencies.map(denom => ({
          coinDenom: denom.toUpperCase(),
          coinMinimalDenom: denom,
          coinDecimals: 6,
        })),
        feeCurrencies: chainConfig.feeCurrencies.map(denom => ({
          coinDenom: denom.toUpperCase(),
          coinMinimalDenom: denom,
          coinDecimals: 6,
        })),
        coinType: 118,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      })

      await window.keplr.enable(chainConfig.chainId)
      const offlineSigner = window.keplr.getOfflineSigner(chainConfig.chainId)
      const signingClient = await SigningStargateClient.connectWithSigner(
        chainConfig.rpc,
        offlineSigner
      )
      const accounts = await offlineSigner.getAccounts()
      const walletAddress = accounts[0].address
      const balanceResponse = await signingClient.getBalance(
        walletAddress,
        chainConfig.stakeCurrency
      )
      const balanceValue = (
        Number(balanceResponse.amount) / 1000000
      ).toFixed(6)

      setIsConnected(true)
      setAddress(walletAddress)
      setBalance(`${balanceValue} ${chainConfig.stakeCurrency.toUpperCase()}`)
      setChainId(chainConfig.chainId)
      setClient(signingClient)

      localStorage.setItem("walletAddress", walletAddress)
      localStorage.setItem("chainId", chainConfig.chainId)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(null)
    setChainId(null)
    setClient(null)
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("chainId")
  }

  return (
    <WalletContext.Provider
      value={{ connect, disconnect, isConnected, address, balance, chainId, client }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)