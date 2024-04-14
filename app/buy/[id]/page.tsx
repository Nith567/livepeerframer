'use client'
import { purchaseContract } from "@/lib/deploy"
import {usePrivy,useWallets} from '@privy-io/react-auth';
export default function Home({ params }: { params: { id: string } }) {
    const id = params.id.split('-')
    const tableName= id[0]
    const contractAddress = id[1]
    const {connectWallet} = usePrivy();
    const {wallets} = useWallets();
    const {connectOrCreateWallet} = usePrivy();
if(window.ethereum){

//     const priceWei = ethers.utils.parseEther(String(apiData.price)).toString();
  
//     console.log( priceWei, apiData.price)
//     const buyed= await purchaseContract(signer,apiData.contract,priceWei);
//     console.log("buyed , ",buyed)
  

// }
}
return (
    <>
<button onClick={connectWallet}>Connect wallet</button>;

 <button
        disabled={!wallets[0]}
        onClick={() => { wallets[0].loginOrLink() }}>
        Login with wallet
    </button>
<button onClick={connectOrCreateWallet}>Connect wallet with create</button>;

    </>
)
}