import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { hexToNumber } from "@etclabscore/eserialize";
import useGlobalDataStore from "../../stores/useGlobalDataStore";
const BN = require('bignumber.js');
const unit = require("ethjs-unit"); //tslint:disable-line
const InputDataDecoder = require('ethereum-input-data-decoder');

function TxListItem({ tx, fnDecoder , currency, showblockNumber }: { tx: any, fnDecoder : any, currency: string, showblockNumber?: boolean }) {
  const txHashShort = tx.hash.substring(2, 6) + '—' + tx.hash.substring(tx.hash.length - 5, tx.hash.length - 1);
  let decodedInput = fnDecoder.decodeData(tx.input);
  let type = '';
  let amount = unit.fromWei(tx.value, "ether");
  let toAddress = tx.to;
  let contractAddress = '';
  if(decodedInput)
  {
    if(decodedInput.method)
    {
      type = decodedInput.method;
      if(type === 'transfer' && decodedInput.names)
      {
        decodedInput.names.map((b: any, key: number) => {
          if(decodedInput.types && decodedInput.types[key] && decodedInput.types[key] === 'address' && b === '_to'){
            toAddress = '0x' + decodedInput.inputs[key];
          }
          else if(b === '_value')
          {
            //amount = decodedInput.inputs[key].dividedBy( new BN(10).pow(18)).toFormat(2) ;
            amount = unit.fromWei(decodedInput.inputs[key], "ether");
          }
        });
        contractAddress = '0x' + tx.to.substring(2, 6) + '—' + tx.to.substring(tx.to.length - 5, tx.to.length - 1);
      }
    }
  } 
  
  return (
    <TableRow>
      {showblockNumber && <TableCell align='right'>{hexToNumber(tx.blockNumber)}</TableCell>}

      <TableCell>
        <Link
          component={({ className, children }: { children: any, className: string }) => (
            <RouterLink className={className} to={`/tx/${tx.hash}`} >
              {children}
            </RouterLink>
          )}>
          {txHashShort}
        </Link>
      </TableCell>

      <TableCell>{type === 'transfer' ? 'payment' : type}</TableCell>

      <TableCell>{currency}</TableCell>

      <TableCell align='right'>{amount}</TableCell>

      <TableCell>{contractAddress}</TableCell>

      <TableCell>
        <Link
          component={({ className, children }: { children: any, className: string }) => (
            <RouterLink className={className} to={`/address/${tx.from}`} >
              {children}
            </RouterLink>
          )}>
          {tx.from}
        </Link>
      </TableCell>
      

      <TableCell>
        {tx.to !== null ?
          <Link
            component={({ className, children }: { children: any, className: string }) => (
              <RouterLink className={className} to={`/address/${toAddress}`} >
                {children}
              </RouterLink>
            )}>
            {toAddress} 
          </Link>
          : null}
      </TableCell>

      <TableCell>{hexToNumber(tx.gas)}</TableCell>
      <TableCell>{unit.fromWei(tx.gasPrice, "gwei")} Wei</TableCell>
      <TableCell>{hexToNumber(tx.transactionIndex)}</TableCell>
    </TableRow>
  );
}

export interface ITxListProps {
  transactions: any[];
  showBlockNumber?: boolean;
}

function TxList(props: ITxListProps) {
  const globalStore : any = useGlobalDataStore();
  const contractMap = globalStore['contractMap'];
  const erc20AbiData = globalStore['erc20AbiData'];
  var fnDecoder = new InputDataDecoder(erc20AbiData);

  return (
    <Table  size="small" >
      <TableHead>
        <TableRow>
          {props.showBlockNumber && <TableCell>Block Number</TableCell>}
          <TableCell>Hash</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Currency</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Contract Address</TableCell>
          <TableCell>From Account</TableCell>
          <TableCell>To Account</TableCell>
          <TableCell>Gas Used</TableCell>
          <TableCell>Gas Price</TableCell> 
          <TableCell>Index</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {props.transactions.map(
          (tx: any) => 
            <TxListItem key={tx.hash} tx={tx} fnDecoder={fnDecoder} currency={contractMap.get(tx.to)} showblockNumber={props.showBlockNumber} />,
        )}
      </TableBody>
    </Table>
  );
}

export default TxList;
