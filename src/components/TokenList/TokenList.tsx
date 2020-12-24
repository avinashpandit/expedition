import * as React from "react";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { hexToNumber } from "@etclabscore/eserialize";
import useGlobalDataStore from "../../stores/useGlobalDataStore";
const ethers = require('ethers');
const BN = require('bignumber.js');

function TokenListItem({ name, address , balanceInUnits, balanceInCurrency }: { name: string, address: string ,balanceInUnits : number, balanceInCurrency : number}) {
  return (
    <TableRow>
      <TableCell>
          {name}
      </TableCell>

      <TableCell>
          {address}
      </TableCell>

      <TableCell>
        {balanceInUnits}
      </TableCell>

      <TableCell>{balanceInCurrency}</TableCell>
    </TableRow>
  );
}

export interface ITokenListProps {
  address: any;
}

interface ITokenBalanceProps {
  name: string;
  address: string;
  balanceInUnits : number;
  balanceInCurrency : number;
}

function TokenList(props: ITokenListProps) {
  const globalStore : any = useGlobalDataStore();
  const contractMap = globalStore['contractMap'];
  const provider = globalStore['provider'];
  const erc20AbiData = globalStore['erc20AbiData'];
  const address = props.address;

  let [balances, setBalances] = React.useState<ITokenBalanceProps[]>([]);
  React.useEffect(() => {
    if(contractMap)
    {
      for(let [contractAddress,name] of contractMap.entries()){
        const contract = new ethers.Contract(contractAddress, erc20AbiData, provider);
        contract.balanceOf(address).then((balance:any) => {
          try{
            let formattedBalance = hexToNumber(balance);
            if(formattedBalance > 0){
              console.log('formattedBalance' + formattedBalance);
              let balanceInCurrency = new BN(formattedBalance).dividedBy( new BN(10).pow(6)).toFormat(2) ;
              let data = {name : name , address : contractAddress , balanceInUnits : formattedBalance , balanceInCurrency }
              balances.push(data);
              setBalances(balances);
            }
          }
          catch(err){
            console.log('Error in getting balance');
          }
        }).catch();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  console.log(JSON.stringify(contractMap));
  return (
    <Table  size="small" >
      <TableHead>
        <TableRow>
          <TableCell>Token</TableCell>
          <TableCell>Contract Address</TableCell>
          <TableCell>Units</TableCell>
          <TableCell>Balance in Token</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {balances.map(
          (b: any, index: number) => {
            return (<TokenListItem name={b.name} address={b.address} balanceInUnits={b.balanceInUnits} balanceInCurrency={b.balanceInCurrency}/>)
          }
        )}
      </TableBody>
    </Table>
  );
}

export default TokenList;
