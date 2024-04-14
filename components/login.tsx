'use client'
import {usePrivy} from '@privy-io/react-auth';
import {useWallets} from '@privy-io/react-auth';
import { Database } from "@tableland/sdk";
import { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation'
import { deployContract } from '@/lib/deploy'
import { createStream, getStreamUrl,getPlayback } from '@/lib/livepeer';
import { FaCopy } from 'react-icons/fa';
export default function LoginButton() {

  
  const {ready, authenticated, login,user,logout} = usePrivy();
  const disableLogin = !ready || (ready && authenticated);
  const disablelogout = ready
  const {wallets} = useWallets();
  const [broadcast, setBroadcast] = useState('');
  const [title, setTitle] = useState('');
  // const [contract, setContract] = useState('');
  const [table, setTableName] = useState('');
  const [streamId, setStreamId] = useState('');
  const [metadata, setMetadata] = useState('');
  const [price, setPrice] = useState('');

  const router = useRouter()


  // const deploy=async()=>{
  //   const wallet = wallets[0];
  //   const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
  //   if (!embeddedWallet) {
  //     console.error('Embedded wallet not found');
  //     return;
  //   }
  //   embeddedWallet.switchChain(84532)
  //     const providers = await embeddedWallet.getEthersProvider();
  //     const signer = providers.getSigner();
  //   let contract=  await deployContract(signer, 'haivng', price);
  //   setContract(contract.address);
  //   console.log(contract.address,contract)
  // }
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(broadcast);
      alert('Content copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy: ', error);
      alert('Failed to copy content to clipboard');
    }
  };
  const handleSubmit = async (event:any) => {
    event.preventDefault();
    const wallet = wallets[0];
    const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');
    if (!embeddedWallet) {
      console.error('Embedded wallet not found');
      return;
    }
    embeddedWallet.switchChain(11155111)
    try {
      const providers = await embeddedWallet.getEthersProvider();
      const signer = providers.getSigner();

      const streamData = await createStream({ name:streamId});
      const streamUrl = getStreamUrl(streamData.streamKey);
      const playbackId = getPlayback(streamData.playbackId);
      console.log('boradcast ',streamUrl, 'watch ',playbackId)
      setBroadcast(streamUrl)

      setTimeout(async () => {
        const prefix = "livframe";
        const db = new Database({ signer});
      const { meta: create } = await db
        .prepare(`CREATE TABLE ${prefix} (id integer primary key,creator text,address text,title text, streamId text,metadata text,price integer);`)
        .run();
        await create.txn?.wait();
        let tableName = create.txn?.names[0]
        console.log(tableName);
      const { meta: insert } = await db
        .prepare(`INSERT INTO ${tableName} (creator,address,title, streamId, metadata, price) VALUES (?, ?, ?, ?, ?, ?)`)
        .bind(`${user?.id.split(":").at(2)}`,`0x7f2377647cff7f30ec8fd3af8353c8a0ab1a91c0`,title ,playbackId, metadata, price)
        // ${user?.wallet?.address}
        .run();
      await insert.txn?.wait();
      console.log(insert.txn?.names)
      console.log('Data inserted successfully');
  let p=user?.id.split(":").at(2)
  router.push(`/watch/${tableName}-${user?.id.split(":").at(2)}`)
}, 5000);

    } 
    catch (error) {
      console.error('singl error  ', error);
    }
  };

  return (
    <div>
    {ready && !authenticated && (
      <button className='m-2 p-3 bg-blue-500 inline-block  hover:bg-violet-800 text-white font-bold py-2 px-4 rounded-lg shadow-md'disabled={disableLogin} onClick={login}>
      Log in
    </button>

    )}




    {ready && authenticated && (
        <div>
          <button className='m-2 p-3 bg-red-600 inline-block  hover:bg-orange-800 text-white font-bold py-2 px-4 rounded-lg shadow-md' disabled={disablelogout} onClick={logout}>LOGOUT</button>
   {user?.wallet?.address}
      <li>Google: {user?.google ? user?.google.email : 'None'}</li>

{broadcast && 
               <div>Your Stream: {broadcast}
               
               <button onClick={copyToClipboard}>
               <FaCopy />
             </button>
             </div>
               }
    

      <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium text-gray-700">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="streamId" className="block font-medium text-gray-700">Stream ID</label>
          <input type="text" id="streamId" value={streamId} onChange={(e) => setStreamId(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="metadata" className="block font-medium text-gray-700">Metadata</label>
          <input type="text" id="metadata" value={metadata} onChange={(e) => setMetadata(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="price" className="block font-medium text-gray-700">Price</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 p-2 w-full border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">Submit</button>
      </form>
    </div>
   </div>
    )}
  </div>
  );
}