// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RECLIAMADDRESS = "0xe79A453bD088F4A58656b315a7C1f8Ea3473CCf1";
const USDCADDRESS = "0x009AedBDdc779C64ABb22016fD60a3C0d36f0eF3";
const INTERESTRATE: bigint = 450n;

const CREDTIModule = buildModule("CREDTIModule", (m) => {
  const reclaimAddress = m.getParameter("reclaimAddress", RECLIAMADDRESS);
  const usdcAddress = m.getParameter("usdcAddress", USDCADDRESS);
  const interestRate = m.getParameter("interestRate", INTERESTRATE);

  const contract = m.contract("CREDTI", [reclaimAddress,usdcAddress,interestRate]);

  return { contract };
});

export default CREDTIModule;
