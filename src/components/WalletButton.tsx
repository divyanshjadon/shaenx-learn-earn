import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Copy, LogOut, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WalletButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const { address, balance, isConnected, isConnecting, connect, disconnect } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <Button
        variant="glass"
        size="sm"
        className={`gap-2 font-mono ${fullWidth ? "w-full" : ""}`}
        onClick={connect}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div ref={ref} className={`relative ${fullWidth ? "w-full" : ""}`}>
      <Button
        variant="glass"
        size="sm"
        className={`gap-2 font-mono ${fullWidth ? "w-full" : ""}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span>{shortenAddress(address!)}</span>
      </Button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${fullWidth ? "left-0 right-0" : "right-0"} top-full mt-2 z-50 min-w-[260px] glass-card p-4 space-y-3`}
          >
            {/* Balance */}
            <div className="text-center pb-3 border-b border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Balance</p>
              <p className="font-display text-2xl font-bold">{balance} <span className="text-sm text-muted-foreground">ETH</span></p>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-xs text-muted-foreground truncate">{address}</p>
              <button
                onClick={copyAddress}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Disconnect */}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 font-mono text-destructive hover:text-destructive"
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
