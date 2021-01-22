import React, { useState, Dispatch } from "react";
import { createStore } from "reusable";

import rawContracts from '../deployed-ERC20-contracts.json';
import erc20Abi from '../ERC20-abi.json';
import balanceCheckerAbi from '../balances-checker-abi.json';
const ethers = require('ethers');

export default createStore(() => {
    return useGlobalStore();
  });
  
function useGlobalStore(): any {
  const [rawContractsData , setRawContractsData] = useState(rawContracts);
  const [erc20AbiData , setErc20AbiData] = useState(erc20Abi);
  const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ETH_RPC_URL, 1281);
  const balanceCheckerAddress = '0x36B34018A0cbb46Ac8124a84F04D1311Fda6d66E';
  const [balanceCheckerAbiData , setBalanceCheckerAbiData] = useState(balanceCheckerAbi);

  let contractMap = new Map<string,string>();
  for(let [name,val] of Object.entries(rawContractsData)){
    let contractVal : any = val;
    console.log('Name ' + name + 'val' + JSON.stringify(val));
    if(contractVal.address){
        contractMap.set(contractVal.address.toLowerCase(), name);
    }
  }

  React.useEffect(() => {
    const runAsync = async () => {
        setRawContractsData(rawContractsData);
    };
    runAsync();
    return () => {
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawContractsData]);
  return {contractMap , erc20AbiData , provider , balanceCheckerAddress,balanceCheckerAbiData};
}