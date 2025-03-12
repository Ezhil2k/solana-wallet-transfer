// // Import required dependencies
// const web3 = require('@solana/web3.js');
// const fs = require('fs');
// const splToken = require('@solana/spl-token');

// // Function to get SOL balance
// async function getSOLBalance(address) {
//     try {
//         // Connect to the Solana network
//         const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        
//         // Parse the address
//         const publicKey = new web3.PublicKey(address);
        
//         // Get the balance
//         const balance = await connection.getBalance(publicKey);
        
//         // Convert from lamports to SOL
//         const solBalance = balance / web3.LAMPORTS_PER_SOL;
        
//         console.log(`SOL Balance for ${address}: ${solBalance} SOL`);
//         return solBalance;
//     } catch (error) {
//         console.error('Error getting SOL balance:', error);
//         throw error;
//     }
// }

// // Function to get SPL token balance
// async function getSPLTokenBalance(tokenMintAddress, walletAddress) {
//     try {
//         // Connect to the Solana network
//         const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        
//         // Parse the addresses
//         const mintPublicKey = new web3.PublicKey(tokenMintAddress);
//         const walletPublicKey = new web3.PublicKey(walletAddress);
        
//         // Get token account info
//         try {
//             const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
//                 walletPublicKey,
//                 { mint: mintPublicKey }
//             );
            
//             // Get token decimals
//             const tokenInfo = await splToken.getMint(connection, mintPublicKey);
//             const decimals = tokenInfo.decimals;
            
//             // Sum up the balances from all accounts (usually there's just one)
//             let totalBalance = 0;
            
//             if (tokenAccounts.value.length > 0) {
//                 for (const account of tokenAccounts.value) {
//                     const parsedInfo = account.account.data.parsed.info;
//                     const tokenAmount = parsedInfo.tokenAmount;
//                     totalBalance += parseInt(tokenAmount.amount) / Math.pow(10, decimals);
//                 }
//                 console.log(`Token Balance for ${walletAddress}: ${totalBalance} ${tokenMintAddress}`);
//                 return totalBalance;
//             } else {
//                 console.log(`No token account found for ${walletAddress} with token ${tokenMintAddress}`);
//                 return 0;
//             }
//         } catch (error) {
//             // If no token account exists
//             console.log(`No token account found for ${walletAddress} with token ${tokenMintAddress}`);
//             return 0;
//         }
//     } catch (error) {
//         console.error('Error getting SPL token balance:', error);
//         throw error;
//     }
// }

// // This script transfers SOL from one wallet to another on Solana blockchain
// async function transferSOL(amount, toAddress) {
//     try {
//         // Connect to the Solana network (mainnet-beta, testnet, or devnet)
//         const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        
//         // Load sender's keypair from a file (your wallet)
//         // IMPORTANT: In production, use more secure key management!
//         const secretKeyString = fs.readFileSync('/home/ezhil/.config/solana/id.json', 'utf8');
//         const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
//         const fromWallet = web3.Keypair.fromSecretKey(secretKey);
        
//         // Parse the destination address
//         const toWallet = new web3.PublicKey(toAddress);
        
//         // Get balances before transfer
//         console.log("--- Balances Before SOL Transfer ---");
//         await getSOLBalance(fromWallet.publicKey.toString());
//         await getSOLBalance(toAddress);
        
//         // Create a transfer instruction
//         const transaction = new web3.Transaction().add(
//             web3.SystemProgram.transfer({
//                 fromPubkey: fromWallet.publicKey,
//                 toPubkey: toWallet,
//                 lamports: amount * web3.LAMPORTS_PER_SOL, // Convert SOL to lamports
//             })
//         );
        
//         // Get recent blockhash
//         transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
//         transaction.feePayer = fromWallet.publicKey;
        
//         // Sign and send the transaction
//         console.log('Sending transaction...');
//         const signature = await web3.sendAndConfirmTransaction(
//             connection,
//             transaction,
//             [fromWallet]
//         );
        
//         console.log('Transaction completed successfully!');
//         console.log('Signature:', signature);
//         console.log(`Transferred ${amount} SOL to ${toAddress}`);
        
//         // Get balances after transfer
//         console.log("--- Balances After SOL Transfer ---");
//         await getSOLBalance(fromWallet.publicKey.toString());
//         await getSOLBalance(toAddress);
        
//         return signature;
//     } catch (error) {
//         console.error('Error transferring SOL:', error);
//         throw error;
//     }
// }

// // New function to transfer SPL tokens
// async function transferSPLToken(tokenMintAddress, amount, toAddress) {
//     try {
//         // Connect to the Solana network
//         const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        
//         // Load sender's keypair
//         const secretKeyString = fs.readFileSync('/home/ezhil/.config/solana/id.json', 'utf8');
//         const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
//         const fromWallet = web3.Keypair.fromSecretKey(secretKey);
        
//         // Get the token mint
//         const mintPublicKey = new web3.PublicKey(tokenMintAddress);
        
//         // Get balances before transfer
//         console.log("--- Balances Before Token Transfer ---");
//         await getSPLTokenBalance(tokenMintAddress, fromWallet.publicKey.toString());
//         await getSPLTokenBalance(tokenMintAddress, toAddress);
        
//         // Get the sender's token account
//         const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
//             connection,
//             fromWallet,
//             mintPublicKey,
//             fromWallet.publicKey
//         );
        
//         // Get the recipient's public key
//         const toPublicKey = new web3.PublicKey(toAddress);
        
//         // Get or create the recipient's token account
//         const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
//             connection,
//             fromWallet,
//             mintPublicKey,
//             toPublicKey
//         );
        
//         // Get token decimals to calculate the transfer amount
//         const tokenInfo = await splToken.getMint(
//             connection,
//             mintPublicKey
//         );
//         const adjustedAmount = amount * Math.pow(10, tokenInfo.decimals);
        
//         console.log(`Sending ${amount} tokens from ${fromTokenAccount.address.toString()} to ${toTokenAccount.address.toString()}...`);
        
//         // Create and send the transfer transaction
//         const transferTransaction = await splToken.createTransferInstruction(
//             fromTokenAccount.address,         // Source account
//             toTokenAccount.address,           // Destination account
//             fromWallet.publicKey,             // Owner of source account
//             BigInt(Math.round(adjustedAmount)) // Amount to transfer (adjusted for decimals)
//         );
        
//         const transaction = new web3.Transaction().add(transferTransaction);
//         transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
//         transaction.feePayer = fromWallet.publicKey;
        
//         const signature = await web3.sendAndConfirmTransaction(
//             connection,
//             transaction,
//             [fromWallet]
//         );
        
//         console.log('SPL Token transfer completed successfully!');
//         console.log('Signature:', signature);
//         console.log(`Transferred ${amount} tokens to ${toAddress}`);
        
//         // Get balances after transfer
//         console.log("--- Balances After Token Transfer ---");
//         await getSPLTokenBalance(tokenMintAddress, fromWallet.publicKey.toString());
//         await getSPLTokenBalance(tokenMintAddress, toAddress);
        
//         return signature;
//     } catch (error) {
//         console.error('Error transferring SPL token:', error);
//         throw error;
//     }
// }

// // Example usage for SOL transfer
// const recipientAddress = 'XikzB5EZtvhNshrMp4xw2BxhkYxgvLCJ74npwsLLJMK';
// const solAmount = 0.1;

// // Example usage for SPL Token transfer
// const tokenMintAddress = 'BmDW8NfsZLpdv6MooLQPD2s5LGdurHs3kcjRXTcBWB1N'; // Replace with your token's mint address
// const tokenAmount = 10; // Amount of tokens to transfer
// const tokenRecipientAddress = recipientAddress; // Using same recipient, can be different

// // Function to check all balances
// async function checkAllBalances() {
//     try {
//         // Load sender's keypair to get the public key
//         const secretKeyString = fs.readFileSync('/home/ezhil/.config/solana/id.json', 'utf8');
//         const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
//         const fromWallet = web3.Keypair.fromSecretKey(secretKey);
//         const senderAddress = fromWallet.publicKey.toString();
        
//         console.log("=== Checking All Balances ===");
//         console.log("Sender:", senderAddress);
//         console.log("Recipient:", recipientAddress);
        
//         // Check SOL balances
//         console.log("\n--- SOL Balances ---");
//         await getSOLBalance(senderAddress);
//         await getSOLBalance(recipientAddress);
        
//         // Check token balances
//         console.log("\n--- Token Balances ---");
//         await getSPLTokenBalance(tokenMintAddress, senderAddress);
//         await getSPLTokenBalance(tokenMintAddress, recipientAddress);
        
//         console.log("=== Balance Check Complete ===\n");
//     } catch (error) {
//         console.error('Error checking balances:', error);
//     }
// }

// // Comment/uncomment the functions you want to execute

// // Execute the SOL transfer

// transferSOL(solAmount, recipientAddress)
//     .then(signature => {
//         console.log('SOL Transaction complete!');
//     })
//     .catch(err => {
//         console.error('Failed to complete SOL transaction:', err);
//     });


// // Execute the SPL Token transfer

// transferSPLToken(tokenMintAddress, tokenAmount, tokenRecipientAddress)
//     .then(signature => {
//         console.log('Token Transaction complete!');
//     })
//     .catch(err => {
//         console.error('Failed to complete token transaction:', err);
//     });


// // // Check all balances
// // checkAllBalances()
// //     .then(() => console.log('Balance check complete'))
// //     .catch(err => console.error('Failed to check balances:', err));


// Import required dependencies
const web3 = require('@solana/web3.js');
const fs = require('fs');
const splToken = require('@solana/spl-token');

// Function to get SOL balance
async function getSOLBalance(address) {
    try {
        // Connect to the Solana network
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        
        // Parse the address
        const publicKey = new web3.PublicKey(address);
        
        // Get the balance
        const balance = await connection.getBalance(publicKey);
        
        // Convert from lamports to SOL
        const solBalance = balance / web3.LAMPORTS_PER_SOL;
        
        console.log(`SOL Balance for ${address}: ${solBalance} SOL`);
        return solBalance;
    } catch (error) {
        console.error('Error getting SOL balance:', error);
        throw error;
    }
}

// Function to get SPL token balance
async function getSPLTokenBalance(tokenMintAddress, walletAddress) {
    try {
        // Connect to the Solana network
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        
        // Parse the addresses
        const mintPublicKey = new web3.PublicKey(tokenMintAddress);
        const walletPublicKey = new web3.PublicKey(walletAddress);
        
        // Get token account info
        try {
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                walletPublicKey,
                { mint: mintPublicKey }
            );
            
            // Get token decimals
            const tokenInfo = await splToken.getMint(connection, mintPublicKey);
            const decimals = tokenInfo.decimals;
            
            // Sum up the balances from all accounts (usually there's just one)
            let totalBalance = 0;
            
            if (tokenAccounts.value.length > 0) {
                for (const account of tokenAccounts.value) {
                    const parsedInfo = account.account.data.parsed.info;
                    const tokenAmount = parsedInfo.tokenAmount;
                    totalBalance += parseInt(tokenAmount.amount) / Math.pow(10, decimals);
                }
                console.log(`Token Balance for ${walletAddress}: ${totalBalance} ${tokenMintAddress}`);
                return totalBalance;
            } else {
                console.log(`No token account found for ${walletAddress} with token ${tokenMintAddress}`);
                return 0;
            }
        } catch (error) {
            // If no token account exists
            console.log(`No token account found for ${walletAddress} with token ${tokenMintAddress}`);
            return 0;
        }
    } catch (error) {
        console.error('Error getting SPL token balance:', error);
        throw error;
    }
}

// This script transfers SOL from one wallet to another on Solana blockchain
async function transferSOL(amount, toAddress) {
    try {
        // Connect to the Solana network (mainnet-beta, testnet, or devnet)
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        
        // Load sender's keypair from a file (your wallet)
        // IMPORTANT: In production, use more secure key management!
        const secretKeyString = fs.readFileSync('/home/ezhil/.config/solana/id.json', 'utf8');
        const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
        const fromWallet = web3.Keypair.fromSecretKey(secretKey);
        
        // Parse the destination address
        const toWallet = new web3.PublicKey(toAddress);
        
        // Create a transfer instruction
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: fromWallet.publicKey,
                toPubkey: toWallet,
                lamports: amount * web3.LAMPORTS_PER_SOL, // Convert SOL to lamports
            })
        );
        
        // Get recent blockhash
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = fromWallet.publicKey;
        
        // Sign and send the transaction
        console.log('Sending SOL transaction...');
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet]
        );
        
        console.log('SOL Transaction completed successfully!');
        console.log('Signature:', signature);
        console.log(`Transferred ${amount} SOL to ${toAddress}`);
        
        return signature;
    } catch (error) {
        console.error('Error transferring SOL:', error);
        throw error;
    }
}

// New function to transfer SPL tokens
async function transferSPLToken(tokenMintAddress, amount, toAddress) {
    try {
        // Connect to the Solana network
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        
        // Load sender's keypair
        const secretKeyString = fs.readFileSync('/home/ezhil/.config/solana/id.json', 'utf8');
        const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
        const fromWallet = web3.Keypair.fromSecretKey(secretKey);
        
        // Get the token mint
        const mintPublicKey = new web3.PublicKey(tokenMintAddress);
        
        // Get the sender's token account
        const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mintPublicKey,
            fromWallet.publicKey
        );
        
        // Get the recipient's public key
        const toPublicKey = new web3.PublicKey(toAddress);
        
        // Get or create the recipient's token account
        const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mintPublicKey,
            toPublicKey
        );
        
        // Get token decimals to calculate the transfer amount
        const tokenInfo = await splToken.getMint(
            connection,
            mintPublicKey
        );
        const adjustedAmount = amount * Math.pow(10, tokenInfo.decimals);
        
        console.log(`Sending ${amount} tokens from ${fromTokenAccount.address.toString()} to ${toTokenAccount.address.toString()}...`);
        
        // Create and send the transfer transaction
        const transferTransaction = await splToken.createTransferInstruction(
            fromTokenAccount.address,         // Source account
            toTokenAccount.address,           // Destination account
            fromWallet.publicKey,             // Owner of source account
            BigInt(Math.round(adjustedAmount)) // Amount to transfer (adjusted for decimals)
        );
        
        const transaction = new web3.Transaction().add(transferTransaction);
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = fromWallet.publicKey;
        
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet]
        );
        
        console.log('SPL Token transfer completed successfully!');
        console.log('Signature:', signature);
        console.log(`Transferred ${amount} tokens to ${toAddress}`);
        
        return signature;
    } catch (error) {
        console.error('Error transferring SPL token:', error);
        throw error;
    }
}

// Example usage for SOL transfer
const recipientAddress = 'XikzB5EZtvhNshrMp4xw2BxhkYxgvLCJ74npwsLLJMK';
const solAmount = 0.1;

// Example usage for SPL Token transfer
const tokenMintAddress = 'BmDW8NfsZLpdv6MooLQPD2s5LGdurHs3kcjRXTcBWB1N'; // Replace with your token's mint address
const tokenAmount = 10; // Amount of tokens to transfer
const tokenRecipientAddress = recipientAddress; // Using same recipient, can be different

// Function to check all balances
async function checkAllBalances() {
    try {
        // Load sender's keypair to get the public key
        const secretKeyString = fs.readFileSync('/home/ezhil/.config/solana/id.json', 'utf8');
        const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
        const fromWallet = web3.Keypair.fromSecretKey(secretKey);
        const senderAddress = fromWallet.publicKey.toString();
        
        console.log("=== Checking All Balances ===");
        console.log("Sender:", senderAddress);
        console.log("Recipient:", recipientAddress);
        
        // Check SOL balances
        console.log("\n--- SOL Balances ---");
        await getSOLBalance(senderAddress);
        await getSOLBalance(recipientAddress);
        
        // Check token balances
        console.log("\n--- Token Balances ---");
        await getSPLTokenBalance(tokenMintAddress, senderAddress);
        await getSPLTokenBalance(tokenMintAddress, recipientAddress);
        
        console.log("=== Balance Check Complete ===\n");
    } catch (error) {
        console.error('Error checking balances:', error);
    }
}

// Execute the SOL transfer
transferSOL(solAmount, recipientAddress)
    .then(signature => {
        console.log('SOL Transaction complete!');
        
        // Execute the SPL Token transfer after SOL transfer completes
        return transferSPLToken(tokenMintAddress, tokenAmount, tokenRecipientAddress);
    })
    .then(signature => {
        console.log('Token Transaction complete!');
        
        // Check balances after both transfers are complete
        return checkAllBalances();
    })
    .catch(err => {
        console.error('Failed to complete transactions:', err);
    });