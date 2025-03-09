import { Suspense } from "react"
import SwapInterface from "@/components/swap-interface"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import Footer from "@/components/footer"
import TokensProvider from "@/components/providers/tokens-provider"
import WalletProvider from "@/components/providers/wallet-provider"
import ChainProvider from "@/components/providers/chain-provider"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <WalletProvider>
        <ChainProvider>
          <TokensProvider>
            <Header />
            <div className="flex-1 container max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
              <div className="w-full max-w-md mx-auto">
                <Tabs defaultValue="swap" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-8 p-1 bg-zinc-800 border border-zinc-700">
                    <TabsTrigger
                      value="swap"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:font-medium"
                    >
                      Swap
                    </TabsTrigger>
                    <TabsTrigger
                      value="liquidity"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:font-medium"
                    >
                      Liquidity
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="swap" className="mt-0">
                    <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
                      <SwapInterface />
                    </Suspense>
                  </TabsContent>
                  <TabsContent value="liquidity" className="mt-0">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-lg">
                      <h2 className="text-xl font-bold mb-4">Provide Liquidity</h2>
                      <p className="text-zinc-300">
                        Coming soon. Provide liquidity across multiple chains and earn fees.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <Footer />
          </TokensProvider>
        </ChainProvider>
      </WalletProvider>
    </main>
  )
}

