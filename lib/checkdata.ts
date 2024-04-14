import axios from "axios";
export async function checkApi(
   tableName:string,
    tokenAddress: string
  ) {
    try {
        const apiUrl = `https://testnets.tableland.network/api/v1/query?statement=select%20%2A%20from%20${tableName}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        const filteredData = data.filter((item: {  address: string;
            contract: string;
            creator: string;
            id: number;
            metadata: string;
            price?: number; 
            streamId?: string;
            title: string; })=> item.contract === tokenAddress);
        return filteredData;
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        return null;
      }
    }
    
// const axios = require("axios");

// async function checkApi(tableName, tokenAddress) {
//   try {
//     const apiUrl = `https://testnets.tableland.network/api/v1/query?statement=select%20%2A%20from%20${tableName}`;
//     const response = await axios.get(apiUrl);
//     const data = response.data;
//     const filteredData = data.filter((item) => item.contract === tokenAddress);
//     return filteredData;
//   } catch (error) {
//     console.error("There was a problem with the fetch operation:", error);
//     return null;
//   }
// }

// module.exports = checkApi;
