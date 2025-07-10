import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'https://relayer-api.horizenlabs.io/api/v1';

// Load proof and registered verification key hash
const proof = JSON.parse(fs.readFileSync('./proof.json'));
const vkey = JSON.parse(fs.readFileSync('./vkey.json')); // { vkey: "..." }

async function main() {
    // Prepare params for proof submission
    const params = {
        proofType: "risc0",
        vkRegistered: true, // Use the registered verification key hash
        chainId: 11155111, // ETH Sepolia; change if needed
        proofOptions: {
            version: "V1_2"
        },
        proofData: {
            proof: proof.proof,
            publicSignals: proof.pub_inputs,
            vk: vkey.hash // Use the registered vkHash
        }
    };

    try {
        // Submit proof
        const requestResponse = await axios.post(
            `${API_URL}/submit-proof/${process.env.API_KEY}`,
            params
        );
        console.log(requestResponse.data);

        if (requestResponse.data.optimisticVerify !== "success") {
            console.error("Proof verification failed, check proof artifacts");
            return;
        }

        // Poll for aggregation status
        while (true) {
            const jobStatusResponse = await axios.get(
                `${API_URL}/job-status/${process.env.API_KEY}/${requestResponse.data.jobId}`
            );
            if (jobStatusResponse.data.status === "Aggregated") {
                console.log("Job aggregated successfully");
                const aggregationResult = {
                    jobId: jobStatusResponse.data.jobId,
                    status: jobStatusResponse.data.status,
                    statusId: jobStatusResponse.data.statusId,
                    proofType: jobStatusResponse.data.proofType,
                    chainId: jobStatusResponse.data.chainId,
                    createdAt: jobStatusResponse.data.createdAt,
                    updatedAt: jobStatusResponse.data.updatedAt,
                    txHash: jobStatusResponse.data.txHash,
                    blockHash: jobStatusResponse.data.blockHash,
                    aggregationId: jobStatusResponse.data.aggregationId,
                    statement: jobStatusResponse.data.statement,
                    aggregationDetails: jobStatusResponse.data.aggregationDetails
                };
                console.log(JSON.stringify(aggregationResult, null, 2));
                fs.writeFileSync(
                    "aggregation.json",
                    JSON.stringify(
                        {
                            ...jobStatusResponse.data.aggregationDetails,
                            aggregationId: jobStatusResponse.data.aggregationId
                        },
                        null,
                        2
                    )
                );
                break;
            } else {
                console.log("Job status:", jobStatusResponse.data.status);
                console.log("Waiting for job to aggregate...");
                await new Promise(resolve => setTimeout(resolve, 20000)); // Wait 20 seconds
            }
        }
    } catch (err) {
        console.error("Error during proof submission or aggregation:", err.response ? err.response.data : err.message);
    }
}

main();
