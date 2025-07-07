# Proof Submission

This project provides a set of scripts to interact with the zkVerify network. It allows you to first register a verification key (VK) from a Risc Zero proof and then use that registered VK to submit proofs for verification and aggregation. The scripts handle the communication with the Horizen Labs Relayer API, including polling for job completion status.

## YouTube Videos

* [Video 1: Title of the first video](https://www.youtube.com/watch?v=your_video_id_1)
* [Video 2: Title of the second video](https://www.youtube.com/watch?v=your_video_id_2)

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/download)
* [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/legendarytunzeverywhere/proof-submission.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env` file and add your seed phrase and API_KEY
   ```
   SEED_PHRASE= "your seed phrase goes here
   ```

## Usage

To run the project, use the following command:

```sh
node index.js
```

## Important Notes

The following files and directories are not tracked by Git and will be created when you run the project or fetch them yourself:

* `node_modules`
* `.env`
* `vkey.json`
* `proof.json`
* `package-lock.json`

These files are ignored because they contain sensitive information, are specific to your local environment, or can be generated from the existing files.
