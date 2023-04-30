import { useWalletModal,useWallet } from "@solana/wallet-adapter-react-ui";

function MyComponent() {
    const { wallet, connect, disconnect } = useWallet();
    useWalletModal
  
    const handleConnect = () => {
      connect();
    };
  
    const handleDisconnect = () => {
      disconnect();
    };
  
    return (
      <div>
        {wallet ? (
          <button onClick={handleDisconnect}>Disconnect</button>
        ) : (
          <button onClick={handleConnect}>Connect to Phantom</button>
        )}
      </div>
    );
  }