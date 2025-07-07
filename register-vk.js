import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const proof = JSON.parse(fs.readFileSync("./proof.json"));

async function main() {
  try {
    const apiKey = process.env.API_KEY;
    const url = `https://relayer-api.horizenlabs.io/api/v1/register-vk/${apiKey}`;
    const payload = {
      proofType: "risc0", // or "groth16" if that's your proof type
      proofOptions: { version: "V1_2" }, // <-- use underscore
      vk: proof.image_id // or the actual verification key object, depending on your API
    };

    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("VK Registration response:", response.data);
    fs.writeFileSync("vkey.json", JSON.stringify({ vkey: response.data.vkey }, null, 2));
  } catch (err) {
    console.error("Error registering VK:", err.response ? err.response.data : err.message);
  }
}

main();
