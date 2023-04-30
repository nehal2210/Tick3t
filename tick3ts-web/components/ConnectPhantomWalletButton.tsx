/*
* We are going to be using the useEffect hook!
*/
import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const ConnectPhantomWalletButton = () => {
    // State
    const [walletAddress, setWalletAddress] = useState(null);
    
    // Actions
    const checkIfWalletIsConnected = async () => {
        if (window?.solana?.isPhantom) {
            console.log('Phantom wallet found!');
            const response = await window.solana.connect({ onlyIfTrusted: true });
            console.log(
                'Connected with Public Key:',
                response.publicKey.toString()
                );
                
                /*
                * Set the user's publicKey in state to be used later!
                */
                setWalletAddress(response.publicKey.toString());
            } else {
                alert('Solana object not found! Get a Phantom Wallet 👻');
            }
        };
        
        const connectWallet = async () => {
            const { solana } = window;
            
            if (solana) {
                const response = await solana.connect();
                console.log('Connected with Public Key:', response.publicKey.toString());
                setWalletAddress(response.publicKey.toString());
            }
        };
        
        const renderNotConnectedContainer = () => (
            <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
            >
            Connect to Wallet
            </button>
            );
            
            // UseEffects
            useEffect(() => {
                const onLoad = async () => {
                    await checkIfWalletIsConnected();
                };
                window.addEventListener('load', onLoad);
                return () => window.removeEventListener('load', onLoad);
            }, []);
            
            return (
                <div >
                    <Button style={{backgroundColor: 'green',color: 'white',padding: '10px 20px',border: 'none',borderRadius: '4px',cursor: 'pointer'}}>
                        <div className={walletAddress ? 'authed-container' : 'container'}>
                            <div >
                                {!walletAddress && renderNotConnectedContainer()}
                            </div>
                        </div>
                    </Button>
                    
                </div>
                );
            };
            
            export default ConnectPhantomWalletButton;