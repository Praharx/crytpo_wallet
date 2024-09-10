"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair} from "@solana/web3.js";
import bs58 from "bs58";

const mnemonic = ["divorce","enact","chapter","recipe","air","stumble","churn","body","flat","mask","gorilla","faculty"];
const seedPhrase = mnemonic;

const SeedPhraseDisplay = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [accountLen, setAccountLen] = useState(0);
  const [wallets, setWallets] = useState<{publicKey:string,privateKey: string}[]>([]);

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
    const seed = mnemonicToSeedSync(mnemonic.join(" "));
    const path = `m/44'/501'/${accountLen}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const secretkey = bs58.encode(Keypair.fromSecretKey(secret).secretKey);
    setAccountLen(accountLen + 1);
    console.log("account Number:",accountLen);
    let publick = (Keypair.fromSecretKey(secret).publicKey.toBase58());
    setWallets([...wallets,
      {
        publicKey: publick,
        privateKey: secretkey
      }
    ]);
    console.log(wallets);
  };

  const handleDeleteWallet = (index:number) => {
    const updatedWallets = wallets.filter((_,i)=>i !== index);
    setWallets(updatedWallets);
    setAccountLen(accountLen - 1);
  }

  const handleDeleteAll = () => {
    setWallets([]);
    setAccountLen(0);
  }

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
        <div className="mb-4">
          <Button variant="outline" className="p-5 mt-4" onClick={handleAddWallet}>Add Wallet</Button>
          <Button variant="outline" className="p-5 mt-4 ml-4" onClick={handleDeleteAll}>Remove Wallets</Button>
        </div>
      </div>
      {
       wallets.map((i, index)=>(
          <WalletInfo key={index} walletNumber={index + 1} publicKey={i.publicKey} privateKey={i.privateKey} onDelete={() => handleDeleteWallet(index)}/>
       ))
       
       }
    </>
  );
};

const WalletInfo = ({ walletNumber, publicKey, privateKey , onDelete}:{walletNumber: number, publicKey: string, privateKey: string, onDelete: () => void}) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path>
    </svg>
  );

  return (
    <div className="p-4 rounded-md shadow-md bg-zinc-800/55 text-white w-3/4 mx-auto mb-4">
      <div className="flex justify-between">
      <h1 className="text-xl font-semibold mb-4">Wallet {walletNumber}</h1>
      <button
              onClick={onDelete}
              className="text-red-500 mr-3"
              title="Delete Wallet"
            >
              🗑️
            </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Public Key</label>
        <input
          type="text"
          value={publicKey}
          readOnly
          className="w-full p-2 rounded-md bg-zinc-800 border border-transparent focus:border-gray-600 focus:bg-gray-700 focus:ring-0 text-white"
        />
      </div>
      <div className="relative mb-4">
        <label className="block text-sm font-medium mb-1">Private Key</label>
        <input
          type={showPrivateKey ? 'text' : 'password'}
          value={privateKey}
          readOnly
          className="w-full p-2 rounded-md bg-zinc-800 border border-transparent focus:border-gray-600 focus:bg-gray-700 focus:ring-0 text-white pr-10"
        />
        <button
          type="button"
          onClick={togglePrivateKeyVisibility}
          className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center text-gray-400 hover:text-white"
        >
          {showPrivateKey ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};


export default SeedPhraseDisplay;