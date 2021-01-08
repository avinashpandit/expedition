import Link from "@material-ui/core/Link";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip } from "@material-ui/core";

import LinearProgressWithLabel from "../StatCharts/LinearProgressWithLabel";
import * as React from "react";
import { hexToDate, hexToNumber, hexToString } from "@etclabscore/eserialize";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled, { keyframes, css } from "styled-components";

const rightPaddingFix = {
  paddingRight: "24px",
};

var blinker = keyframes`
  0% {background:#0000be; opacity: 1; color:#000000;}
  100% {opacity: 50;}
`;

const blinkerRule = css`
    ${blinker} 0.7s linear;
`;
// Colorize left border derived from author credit account.
const BlinkingTableRow = styled(TableRow)`
    borderLeft: 1em solid; 
    animation: ${blinkerRule};
`;


function BlockList({ blocks }: any) {
  const { t } = useTranslation();
  if (!blocks) {
    return null;
  }
  const sortedBlocks = blocks.sort((a: { number: number }, b: { number: number }) => {
    return b.number - a.number;
  });


  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Table  size="small">
        <TableHead>
          <TableRow>
            <TableCell><Typography>{t("Validator")}</Typography></TableCell>
            <TableCell><Typography>{t("Block Number")}</Typography></TableCell>
            <TableCell><Typography>{t("Timestamp")}</Typography></TableCell>
            <TableCell><Typography>{t("Txn Count")}</Typography></TableCell>
            <TableCell><Typography>{t("Gas Usage")}</Typography></TableCell>
            <TableCell><Typography>{t("Hash")}</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBlocks.map((b: any, index: number) => {
            const filledPercent = hexToNumber(b.gasUsed) / 1000000;

            // Shorten hash views by concatenating first and last 4 chars.
            const blockHashShort = b.hash.substring(2, 6) + '—' + b.hash.substring(b.hash.length - 5, b.hash.length - 1);
            const authorHashShort = b.miner.substring(2, 6) + '—' + b.miner.substring(b.miner.length - 5, b.miner.length - 1);

            // Tally transactions which create contracts vs transactions with addresses.
            var txTypes = {
              create: 0,
              transact: 0,
            };

            for (var i = 0; i < b.transactions.length; i++) {
              if (b.transactions[i].to !== null) {
                txTypes.transact++;
              } else {
                txTypes.create++;
              }
            }

            // Calculate difference of block timestamp from that of parent.
            const timeDifferenceFromParent = (index === sortedBlocks.length - 1) ? 0 : hexToNumber(b.timestamp) - hexToNumber(sortedBlocks[index + 1].timestamp);

            return (
              <BlinkingTableRow key={b.number} >
                <TableCell style={rightPaddingFix}>
                  <Typography>
                    <Link
                      component={({ className, children }: { children: any, className: string }) => (
                        <RouterLink className={className} to={`/address/${b.miner}`} >
                          {children}
                        </RouterLink>
                      )}>
                      {authorHashShort}
                    </Link>
                    &nbsp;<sup>{hexToString(b.extraData).substring(0, 20)}</sup>
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/block/${b.hash}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {parseInt(b.number, 16)}
                  </Link>
                </TableCell>
                <TableCell style={rightPaddingFix}>
                  <Typography>{t("Timestamp Date", { date: hexToDate(b.timestamp) })}&nbsp;<sub>({timeDifferenceFromParent > 0 ? `+${timeDifferenceFromParent}` : `-${timeDifferenceFromParent}`}s)</sub></Typography>
                </TableCell>
                <TableCell style={rightPaddingFix} >
                  <Tooltip title={t("Create Transactions", {count: txTypes.create}) as string} placement="top">
                    <Typography variant="caption" color="textSecondary">{txTypes.create === 0 ? "" : txTypes.create}</Typography>
                  </Tooltip>
                  <Typography>{txTypes.transact}</Typography>
                </TableCell>
                <TableCell style={rightPaddingFix}>
                  <LinearProgressWithLabel value={filledPercent} variant="determinate" />
                </TableCell>
                <TableCell style={rightPaddingFix}>
                  <Link
                    component={({ className, children }: { children: any, className: string }) => (
                      <RouterLink className={className} to={`/block/${b.hash}`} >
                        {children}
                      </RouterLink>
                    )}>
                    {blockHashShort}
                  </Link>
                </TableCell>
              </BlinkingTableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>

  );
}

export default BlockList;
