// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RECLAIMADDRESS = "0xe79A453bD088F4A58656b315a7C1f8Ea3473CCf1";
const USDCADDRESS = "0x64cbD5763176359ef8C853E5A8071566C72d78E6";
const INTERESTRATE: bigint = 450n;

const CREDTIModuleCelo = buildModule("CREDTIModule", (m) => {
  const reclaimAddress = m.getParameter("reclaimAddress", RECLAIMADDRESS);
  const usdcAddress = m.getParameter("usdcAddress", USDCADDRESS);
  const interestRate = m.getParameter("interestRate", INTERESTRATE);

  const contract = m.contract("CREDTI", [reclaimAddress,usdcAddress,interestRate]);

  return { contract };
});

export default CREDTIModuleCelo;
