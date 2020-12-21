import React, { useState, Dispatch } from "react";
import { createStore } from "reusable";

import rawContracts from '../deployed-ERC20-contracts.json'

export default createStore(() => {
    return useGlobalStore();
  });
  
function useGlobalStore(): any {
  const [rawContractsData , setRawContractsData] = useState(rawContracts);
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
  return contractMap;
}