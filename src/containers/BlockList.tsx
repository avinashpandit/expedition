import { CircularProgress, Grid, IconButton , Typography} from "@material-ui/core";
import useCoreGethStore from "../stores/useCoreGethStore";
import * as React from "react";
import BlockList from "../components/BlockList";
import TxList from "../components/TxList";
import getBlocks from "../helpers";
import { ArrowForwardIos, ArrowBackIos } from "@material-ui/icons";
import EthereumJSONRPC, { Block as IBlock , Transaction as ITransaction} from "@etclabscore/ethereum-json-rpc";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

interface IProps {
  from: number;
  to: number;
  disablePrev: boolean;
  disableNext: boolean;
  style?: any;
  onNext?: any;
  onPrev?: any;
}

export default function BlockListContainer(props: IProps) {
  const { from, to, style } = props;
  const [erpc]: [EthereumJSONRPC, any] = useCoreGethStore();
  const [blocks, setBlocks] = React.useState<IBlock[]>();
  const [transactions, setTransactions] = React.useState<ITransaction[]>([]);
  
  React.useEffect(() => {
    if (!erpc) { return; }
    getBlocks(from, to, erpc).then(blocks => {
      const sortedBlocks = blocks.sort((a: { number: number }, b: { number: number }) => {
        return b.number - a.number;
      });
    
      setBlocks(sortedBlocks);
      let txs : ITransaction[] = [];
      for(let block of sortedBlocks)
      {
        txs = txs.concat(block.transactions);
        if(txs.length > 100)
        {
          break;
        }
      }
      setTransactions(txs);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  if (!blocks) {
    return <CircularProgress />;
  }
  return (
    <div style={style}>
      <Grid container justify="flex-end">
        <IconButton onClick={props.onPrev} disabled={props.disablePrev}>
          <ArrowBackIos />
        </IconButton>
        <IconButton onClick={props.onNext} disabled={props.disableNext}>
          <ArrowForwardIos />
        </IconButton>
      </Grid>
      <Tabs
        value={tabValue}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
      >
        <Tab label="Blocks" />
        <Tab label="Transactions" />
      </Tabs>  
      {tabValue === 0 && 
        <BlockList blocks={blocks} key='blockList'/>
      }
      {tabValue === 1 && 
        <TxList transactions={transactions} key='txList'/>
      }
    </div>
  );
}
