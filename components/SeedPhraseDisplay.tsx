"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair} from "@solana/web3.js"

const mnemonic = generateMnemonic();
const seedPhrase = mnemonic.split(' ');

const SeedPhraseDisplay = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [accountLen, setAccountLen] = useState(0);

  const handleCopyToClipboard = () => {
    const seedPhraseText = seedPhrase.join(' ');
    navigator.clipboard.writeText(seedPhraseText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy seed phrase: ', err));
  };

  const handleAddWallet = () => {
    const seed = mnemonicToSeedSync(mnemonic);
    setAccountLen(accountLen + 1);
    console.log("account Number:",accountLen);
    const path = `m/44'/501'/${accountLen}`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    console.log()
  };

  return (
    <>
      <div className="max-w-5xl w-4/5 mx-auto p-8 bg-black text-white rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Your Seed Phrase
        </h2>
        <p className="text-sm text-center mb-4">
          Please write down or securely save these words. This is the only way to recover your wallet.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {seedPhrase.map((word: string, index: number) => (
            <div
              key={index}
              className="bg-gray-500/25 text-center py-2 rounded-md shadow-sm">
              <span className="font-mono text-sm">{index + 1}. {word}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleCopyToClipboard}
            className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-200 transition">
            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
      <div className="flex justify-evenly">
        <span className="text-3xl p-5">Solana Wallets</span>
        <div className="">
          <Button variant="outline" className="p-5 mt-4" onClick={handleAddWallet}>Add Wallet</Button>
          <Button variant="outline" className="p-5 mt-4 ml-4">Remove Wallet</Button>
        </div>
      </div>
    </>
  );
};


export default SeedPhraseDisplay;