// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RECLAIMADDRESS = 0xF90085f5Fd1a3bEb8678623409b3811eCeC5f6A5;
const USDCADDRESS = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
const INTERESTRATE: bigint = 450n;

const CREDTIModule = buildModule("CREDTIModule", (m) => {
  const reclaimAddress = m.getParameter("reclaimAddress", RECLAIMADDRESS);
  const usdcAddress = m.getParameter("usdcAddress", USDCADDRESS);
  const interestRate = m.getParameter("interestRate", INTERESTRATE);

  const contract = m.contract("Lock", [reclaimAddress,usdcAddress,interestRate]);

  return { contract };
});

export default CREDTIModule;
