# Solana Wallet Transfer Tool

A Node.js utility for transferring SOL and SPL tokens on the Solana blockchain. This tool supports:

- SOL token transfers
- SPL token transfers
- Balance checking for both SOL and SPL tokens

## Quick Start

### 1. Install Solana CLI Tools

Install the Solana Command Line tools:

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
```

Add Solana to your PATH:

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### 2. Create a Solana Wallet

Create a new Solana wallet:

```bash
solana-keygen new --no-passphrase
```

This will create a keypair in `~/.config/solana/id.json`

### 3. Configure Solana CLI

Set the Solana network to devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

### 4. Fund Your Wallet

Request SOL from the devnet faucet:

```bash
solana airdrop 5 --url devnet
```

This adds 5 SOL to your wallet for testing.

### 5. Clone and Run the Project

Clone the repository:

```bash
git clone https://github.com/Ezhil2k/solana-wallet-transfer.git
cd solana-wallet-transfer
```

Install dependencies:

```bash
npm install
```

Run the transfer script:

```bash
node solana_flow.js
```

That's it! The script will automatically:
- Transfer SOL to the recipient address
- Transfer SPL tokens to the recipient address
- Check balances after the transfers