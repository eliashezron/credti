"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWeb3 } from "@/contexts/useWeb3";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ReclaimProofRequest, Proof } from '@reclaimprotocol/js-sdk';
import QRCode from 'react-qr-code';
import VerifyProof from "./verify_proof";

export default function Home() {
    const {
        address,
        getUserAddress,
        sendCUSD,
        mintMinipayNFT,
        getNFTs,
        signTransaction,
    } = useWeb3();

    const [cUSDLoading, setCUSDLoading] = useState(false);
    const [nftLoading, setNFTLoading] = useState(false);
    const [signingLoading, setSigningLoading] = useState(false);
    const [userOwnedNFTs, setUserOwnedNFTs] = useState<string[]>([]);
    const [tx, setTx] = useState<any>(undefined);
    const [amountToSend, setAmountToSend] = useState<string>("0.1");
    const [messageSigned, setMessageSigned] = useState<boolean>(false); // State to track if a message was signed

      // State to store the verification request URL
  const [requestUrl, setRequestUrl] = useState('');
const [proofs, setProofs] = useState<(string | Proof)[]>([]);
const [ready, setReady] = useState<boolean>(false);
 
  const getVerificationReq = async () => {
    // Your credentials from the Reclaim Developer Portal
    // Replace these with your actual credentials
        const APP_ID = "0xF701579A0f29FaCE02a42d594Ef4FD98A8bb4E12"; // This is an example App Id Replace it with your App Id.
        const APP_SECRET =
        "0x6104a13f6082c8101f82f3bb6fd5e0293512f3872c8473955c9c891a9d8817be"; // This is an example App Secret Replace it with your App Secret.
        const PROVIDER_ID = "0d0fdbbd-2a29-4fcf-aa20-2ec77c363fa5"; 
    // Initialize the Reclaim SDK with your credentials
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
 
    // Generate the verification request URL
    const requestUrl = await reclaimProofRequest.getRequestUrl();
    console.log('Request URL:', requestUrl);
    setRequestUrl(requestUrl);
 
    // Start listening for proof submissions
    await reclaimProofRequest.startSession({
      // Called when the user successfully completes the verification
      onSuccess: (proofs) => {
        if (proofs) {
          if (typeof proofs === 'string') {
            // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
            console.log('SDK Message:', proofs);
            setReady(true);
            setProofs([proofs]);
          } else if (typeof proofs !== 'string') {
            // When using the default callback url, we get a proof object in the response
            console.log('Verification success', proofs?.claimData.context);
            setProofs([proofs]);
          }
        }
        // Add your success logic here, such as:
        // - Updating UI to show verification successs
        // - Storing verification status
        // - Redirecting to another page
      },
      // Called if there's an error during verification
      onError: (error) => {
        console.error('Verification failed', error);
 
        // Add your error handling logic here, such as:
        // - Showing error message to user
        // - Resetting verification state
        // - Offering retry options
      },
    });
  };


    useEffect(() => {
        getUserAddress();
    }, []);

    useEffect(() => {
        const getData = async () => {
            const tokenURIs = await getNFTs();
            setUserOwnedNFTs(tokenURIs);
        };
        if (address) {
            getData();
        }
    }, [address]);

    async function sendingCUSD() {
        if (address) {
            setSigningLoading(true);
            try {
                const tx = await sendCUSD(address, amountToSend);
                setTx(tx);
            } catch (error) {
                console.log(error);
            } finally {
                setSigningLoading(false);
            }
        }
    }

    async function signMessage() {
        setCUSDLoading(true);
        try {
            await signTransaction();
            setMessageSigned(true);
        } catch (error) {
            console.log(error);
        } finally {
            setCUSDLoading(false);
        }
    }


    async function mintNFT() {
        setNFTLoading(true);
        try {
            const tx = await mintMinipayNFT();
            const tokenURIs = await getNFTs();
            setUserOwnedNFTs(tokenURIs);
            setTx(tx);
        } catch (error) {
            console.log(error);
        } finally {
            setNFTLoading(false);
        }
    }



    return (
        <div className="flex flex-col justify-center items-center">
            {!address && (
                <div className="h1">Please install Metamask and connect.</div>
            )}
            {address && (
                <div className="h1">
                    There you go...
                </div>
            )}

        
            {address && (
                <>
                    <div className="h2 text-center">
                        Your address:{" "}
                        <span className="font-bold text-sm">{address}</span>
                    </div>
                    <div className="w-full px-3 mt-6">
                    <Button onClick={getVerificationReq} title="Generate ZK proof of funds"> Generate ZK proof of funds </Button>
                        {/* Display QR code when URL is available */}
                        {requestUrl && (
                            <div style={{ margin: '20px 0' }}>
                            <QRCode value={requestUrl} />
                            </div>
                        )}
                        {proofs && (
                            <div>
                            <h2>Proof generated!</h2>
                            <pre>{JSON.stringify(proofs, null, 2)}</pre>
                            </div>
                        )}
                    </div>

                    <div className="w-full px-3 mt-6">
                    <Button onClick={getVerificationReq} title="Verify and Borrow"> Verify and borrow</Button>
                        {proofs && (
                            <div>
                            <h2>Proof generated!</h2>
                            {ready && <VerifyProof proof={proofs[0]}></VerifyProof>}
                            </div>
                        )}
                    </div>

                    {tx && (
                        <p className="font-bold mt-4">
                            Tx Completed:{" "}
                            <a
                                href={`https://alfajores.celoscan.io/tx/${tx.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {tx.transactionHash.substring(0, 6)}...{tx.transactionHash.substring(tx.transactionHash.length - 6)}
                            </a>
                        </p>
                    )}

                    <div className="w-full px-3 mt-7">
                        <Input
                            type="number"
                            value={amountToSend}
                            onChange={(e) => setAmountToSend(e.target.value)}
                            placeholder="Enter amount to send"
                            className="border rounded-md px-3 py-2 w-full mb-3"
                        ></Input>
                        <Button
                            loading={signingLoading}
                            onClick={sendingCUSD}
                            title={`Send ${amountToSend} cUSD to your own address`}
                            widthFull
                        />
                    </div>

                    {messageSigned && (
                        <div className="mt-5 text-green-600 font-bold">
                            Message signed successfully!
                        </div>
                    )}

                    <div className="w-full px-3 mt-5">
                        <Button
                            loading={nftLoading}
                            onClick={mintNFT}
                            title="Mint Minipay NFT"
                            widthFull
                        />
                    </div>

                    {userOwnedNFTs.length > 0 ? (
                        <div className="flex flex-col items-center justify-center w-full mt-7">
                            <p className="font-bold">My NFTs</p>
                            <div className="w-full grid grid-cols-2 gap-3 mt-3 px-2">
                                {userOwnedNFTs.map((tokenURI, index) => (
                                    <div
                                        key={index}
                                        className="p-2 border-[3px] border-colors-secondary rounded-xl"
                                    >
                                        <Image
                                            alt="MINIPAY NFT"
                                            src={tokenURI}
                                            className="w-[160px] h-[200px] object-cover"
                                            width={160}
                                            height={200}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-5">You do not have any NFTs yet</div>
                    )}

                </>
            )}
        </div>
    );
}
