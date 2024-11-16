// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RECLAIMADDRESS = 0x4D1ee04EB5CeE02d4C123d4b67a86bDc7cA2E62A;
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
