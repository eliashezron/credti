// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RECLAIMADDRESS = 0xe79A453bD088F4A58656b315a7C1f8Ea3473CCf1;
const USDCADDRESS = 1893456000;
const INTERESTRATE: bigint = 450n;

const CREDTIModule = buildModule("CREDTIModule", (m) => {
  const reclaimAddress = m.getParameter("reclaimAddress", RECLAIMADDRESS);
  const usdcAddress = m.getParameter("usdcAddress", USDCADDRESS);
  const interestRate = m.getParameter("interestRate", INTERESTRATE);

  const contract = m.contract("Lock", [reclaimAddress,usdcAddress,interestRate]);

  return { contract };
});

export default CREDTIModule;
