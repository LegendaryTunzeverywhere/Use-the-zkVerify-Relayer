import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'https://relayer-api.horizenlabs.io/api/v1';

const proof = JSON.parse(fs.readFileSync("./proof.json")); // Following the Risc Zero tutorial
const vkey = JSON.parse(fs.readFileSync("./vkey.json")); // Importing the registered vkhash

async function main() {
    const params = {
        "proofType": "risc0",
        "vkRegistered": true, // Set to true since you're using a registered vkHash
        "chainId": 11155111,
        "proofOptions": {
            "version": "V1_2"
        },
        "proofData": {
            "proof": proof.proof,
            "publicSignals": proof.pub_inputs,
            "vk": vkey.vkey // Use the registered vkHash
        }
    };

    const requestResponse = await axios.post(`${API_URL}/submit-proof/${process.env.API_KEY}`, params);
    console.log(requestResponse.data);

    if (requestResponse.data.optimisticVerify != "success") {
        console.error("Proof verification failed, check proof artifacts");
        return;
    }

    while (true) {
        const jobStatusResponse = await axios.get(`${API_URL}/job-status/${process.env.API_KEY}/${requestResponse.data.jobId}`);
        if (jobStatusResponse.data.status === "Aggregated") {
            console.log("Job aggregation successful");
            console.log(jobStatusResponse.data);
            fs.writeFileSync("aggregation.json", JSON.stringify({ ...jobStatusResponse.data.aggregationDetails, aggregationId: jobStatusResponse.data.aggregationId }));
            break;
        } else {
            console.log("Job status: ", jobStatusResponse.data.status);
            console.log("Waiting for job to complete...");
            await new Promise(resolve => setTimeout(resolve, 20000));
        }
    }
}

main();
