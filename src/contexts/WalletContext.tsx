import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface WalletContextType {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  balance: "0",
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

function generateMockAddress(): string {
  const chars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

function generateMockBalance(): string {
  return (Math.random() * 10 + 0.1).toFixed(4);
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    // Simulate connection delay
    await new Promise((r) => setTimeout(r, 1200));
    setAddress(generateMockAddress());
    setBalance(generateMockBalance());
    setIsConnecting(false);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance("0");
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
