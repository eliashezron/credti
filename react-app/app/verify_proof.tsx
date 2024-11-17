import { useState, useEffect } from "react";
import { writeContract } from "@wagmi/core";
import abi from "./abi.json";
import { config } from "../providers/AppProvider";
import { transformForOnchain } from "@reclaimprotocol/js-sdk";

interface VerifyProofProps {
    proof: any;
}
interface Proof {
    
}
const AMOUNT: bigint = 45000000n;

export default function VerifyProof(props: VerifyProofProps) {
    const [proof, setProof] = useState<Proof>({} as Proof);
    const [verified, setVerified] = useState<boolean>(false);

    useEffect(() => {
        const newProof = transformForOnchain(props.proof);
        setProof(newProof);
    }, [props.proof]);

    return (
        <div>
            <button
                className="button"
                onClick={async () => {
                    console.log(proof);
                    const hash = await writeContract(config, {
                        abi: abi,
                        address: "0xa3cff78Bf8cc33a30FFEA09cced15270654971E5",
                        functionName: "lend_uncollateralized_loans",
                        chainId: 44787,
                        args: [AMOUNT,AMOUNT,proof],
                    });
                    if (hash) {
                        setVerified(true);
                    }
                }}
            >
                Verify Proof
            </button>
            {verified && <p> Proof verified </p>}
            <style jsx={true}>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .button {
                    border: solid 1px #ccc;
                    margin: 0 0 20px;
                    border-radius: 3px;
                }
            `}</style>
        </div>
    );
}
