import React from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

export interface IDecodedERC20TX {
  method: string;
  types: [];
  inputs : [];
  names : [];
}

interface IProps
{
  decodedTX : IDecodedERC20TX;
  tx : any;
}

const DecodedERC20TxView: React.FC<IProps> = (props) => {
  const history = useHistory();
  const darkMode = useDarkMode();
  const { decodedTX , tx } = props;
  let grey = darkMode.value ? 'grey' : 'lightgrey'; 
  let decodedInput = decodedTX;

  if(decodedInput){
    return (
      <div style={{ backgroundColor: grey}}>
        <Box fontWeight="fontWeightBold" style={{ marginLeft: "10px" }}>{decodedTX.method}</Box>
        {
          decodedInput.names.map((b: any, key: number) => {
            if(decodedInput.types && decodedInput.types[key]&& decodedInput.types[key] === 'address'){
              return <Box style={{ marginLeft: "20px"}}>{decodedInput.names[key] + ' : '} 
                <Link
                  component={({ className, children }: { children: any, className: string }) => (
                    <RouterLink className={className} to={`/address/0x${decodedInput.inputs[key]}`} >
                      {children}
                    </RouterLink>
                  )}>
                  {'0x' + decodedInput.inputs[key]}
                </Link>
              </Box>
            }
            else{
              return <Box style={{ marginLeft: "20px"}}>{decodedInput.names[key] + ' : ' + decodedInput.inputs[key] + ' '}</Box>
            }
          })
        }
      </div>
    );
  }
  else{
    return (<div style={{ backgroundColor: grey}}></div>);
  }
};

export default DecodedERC20TxView;
