/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from 'frog'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/hubs'
import { erc20Abi, parseUnits } from 'viem';
import { ethers } from 'ethers';
import axios from 'axios';
import { checkApi } from '@/lib/checkdata';


const app = new Frog({
  basePath: '/api',
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string}),
  verify:'silent'
})

const usdcContractAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; 

app.frame('/play/:ids', async (c) => {
  const id = c.req.param('ids');
  const ids = id.split('-');
  const tableName = ids[0];
  const creatorAddress = ids[1];
  const filteredData = await checkApi(tableName, creatorAddress);
  let owner = filteredData[0].address;
  return c.res({
    action: `/finish/${filteredData[0].streamId}`,
    image: (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
          fontSize: 80,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 80,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {filteredData[0].title}{' '}
          {' '}
          {filteredData[0].metadata}
        </p>
        {filteredData && (
          <p
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
              backgroundClip: 'text',
              color: 'transparent',
              fontSize: 80,
              fontWeight: 700,
              margin: 0,
              marginTop: 20,
            }}
          >
            ${filteredData[0].price}
          </p>
        )}
      </div>
    ),
    intents: [
      <Button.Transaction key="transaction" target={`/send-etherss/${owner}/${filteredData[0].price}`}>Send ${filteredData[0].price}</Button.Transaction>
    ]
  });
})
app.transaction('/send-etherss/:owner/:price', async(c) => {
const owner  = c.req.param('owner');
const price  = c.req.param('price');
console.log('owners , ' , owner,price);
  return c.contract({
    // @ts-ignore
    abi:erc20Abi,
    chainId: 'eip155:8453',
    //@ts-ignore
    functionName: 'transfer',
    args: [
      //@ts-ignore
      owner,
      parseUnits(price, 6)
    ],
    to: usdcContractAddress,
  })
})

app.frame('/finish/:streamId', (c) => {
  const streamId  = c.req.param('streamId');
  console.log('lol' ,streamId)
  const { transactionId} = c
  return c.res({
    image: (
      <div
        style={{
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: 80,
          fontWeight: 700,
          margin: 0,
          marginTop: 20,
          background:
          'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
        }}
      >
          Transaction ID: {transactionId?.slice(0,3)}...{transactionId?.slice(-4)} 
      </div>
    ),
    action:`/watch/${streamId}`,
    intents:[<Button key='video' value="transactionId">Watch </Button>]
  })
})

app.frame('/watch/:streamId',async (c)=>{
  const streamId = c.req.param('streamId');
  return c.res({
    image: (
      <div 
        style={{
          color: 'white',
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          height: '100%',
          fontSize: 90,
        }}
      >
      Watch it out now!
      </div>
      ),
      intents: [
        <Button.Link key='video' href={`https://lvpr.tv?v=${streamId}`}>Watch</Button.Link>
      ]
  })
}

)
export const GET = handle(app)
export const POST = handle(app)
