import * as React from "react";

import { Table, TableBody, TableCell, TableHead, TableRow , Theme} from "@material-ui/core";
import { hexToNumber } from "@etclabscore/eserialize";
import useGlobalDataStore from "../../stores/useGlobalDataStore";
import { Grid , Button } from "@material-ui/core";
import ChartCard from "../ChartCard";
import { useTranslation } from "react-i18next";
import { VictoryPie , VictoryLabel } from "victory";
import useDarkMode from "use-dark-mode";
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
      <TableCell align='right'>{balanceInCurrency}</TableCell>
    </TableRow>
  );
}

export interface ITokenListProps {
  address: any;
}

interface ITokenBalanceProps {
  name: string;
  address: string;
  balanceInCurrency : number;
}

function TokenList(props: ITokenListProps) {
  const globalStore : any = useGlobalDataStore();
  const contractMap = globalStore['contractMap'];
  const provider = globalStore['provider'];
  const erc20AbiData = globalStore['erc20AbiData'];
  const balanceCheckerAddress = globalStore['balanceCheckerAddress'];
  const balanceCheckerAbiData = globalStore['balanceCheckerAbiData'];
  
  const address = props.address;
  const darkMode = useDarkMode();
  const { t } = useTranslation();

  let [balances, setBalances] = React.useState<ITokenBalanceProps[]>([]);
  React.useEffect(() => {
    if(contractMap)
    {
      let balances : ITokenBalanceProps[] = [];
      if(balanceCheckerAddress){
        const balanceCheckerContract = new ethers.Contract(balanceCheckerAddress, balanceCheckerAbiData, provider);
        try {
          balanceCheckerContract.balances([address], Array.from(contractMap.keys())).then((values:any) => {
            let tokenIdx = 0;
            for(let [contractAddress,name] of contractMap.entries()){
                const balance = values[tokenIdx++];
                let bnBalance = new BN(balance.toString());
                if(bnBalance.toNumber() > 0){
                  let balanceInCurrency = bnBalance.dividedBy( new BN(10).pow(18)) ;
                  let data = {name : name , address : contractAddress ,  balanceInCurrency : balanceInCurrency }
                  balances.push(data);
                  setBalances(balances);
                }
            }
          });
        }
        catch (e) {
        }      
      }
      else{
        for(let [contractAddress,name] of contractMap.entries()){
          const contract = new ethers.Contract(contractAddress, erc20AbiData, provider);
          contract.balanceOf(address).then((balance:any) => {
            try{
              let bnBalance = new BN(balance.toString());
              if(bnBalance.toNumber() > 0){
                let balanceInCurrency = bnBalance.dividedBy( new BN(10).pow(18)) ;
                let data = {name : name , address : contractAddress ,  balanceInCurrency : balanceInCurrency }
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

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  console.log(JSON.stringify(contractMap));
  return (
    <Grid item container spacing={10}>
    <Grid key="hashChart" item xs={4}>
      <ChartCard title={t("Token Balances")}>
        <VictoryPie
            padAngle={1} 
            padding={{ left : 70 , right : 70 }}
            colorScale="qualitative"
            innerRadius={40}
            labelComponent={<VictoryLabel style={darkMode.value ? {'fill':'white'} : {'fill':'black'} } />}
            data={balances.map((b: any, index: number) => {
              return {x: b.name , y: b.balanceInCurrency.toNumber() , label: b.bbalanceInCurrencyal}
            })}
            />
      </ChartCard>
    </Grid>
    <Grid key="hashChart1" item xs={7}>
      <ChartCard title={t("Account Token Balances")}>
        <Table  size="small" >
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Contract Address</TableCell>
              <TableCell align='right'>Balance in Token</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {balances.map(
              (b: any, index: number) => {
                return (<TokenListItem name={b.name} address={b.address} balanceInUnits={b.balanceInUnits} balanceInCurrency={b.balanceInCurrency.toFormat(2)}/>)
              }
            )}
          </TableBody>
        </Table>
      </ChartCard>
    </Grid>
    </Grid>
  );
}

export default TokenList;
