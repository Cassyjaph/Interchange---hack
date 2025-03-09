import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 py-6 bg-black">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                Interchange
              </span>
            </div>
            <p className="text-zinc-300 text-sm">
              A multichain decentralized exchange for swapping tokens across different Cosmos ecosystem blockchains.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-3 text-white">Protocol</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-zinc-300 hover:text-white text-sm transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-zinc-300 hover:text-white text-sm transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/governance" className="text-zinc-300 hover:text-white text-sm transition-colors">
                    Governance
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/analytics" className="text-zinc-300 hover:text-white text-sm transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-zinc-300 hover:text-white text-sm transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-zinc-300 hover:text-white text-sm transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-white">Community</h3>
            <div className="flex space-x-4">
              <Link href="https://github.com/Cassyjaph/Interchange---hack/" className="text-zinc-300 hover:text-white transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://twitter.com" className="text-zinc-300 hover:text-white transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-300 text-sm">© {new Date().getFullYear()} Interchange. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-zinc-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-zinc-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

