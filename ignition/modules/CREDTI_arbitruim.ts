// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RECLAIMADDRESS = "0x4D1ee04EB5CeE02d4C123d4b67a86bDc7cA2E62A";
const USDCADDRESS = "0x45587853Ad25AAb86c252f08766A1d10b8C95b64";
const INTERESTRATE: bigint = 450n;

const CREDTIModuleAB = buildModule("CREDTIModule", (m) => {
  const reclaimAddress = m.getParameter("reclaimAddress", RECLAIMADDRESS);
  const usdcAddress = m.getParameter("usdcAddress", USDCADDRESS);
  const interestRate = m.getParameter("interestRate", INTERESTRATE);

  const contract = m.contract("CREDTI", [reclaimAddress,usdcAddress,interestRate]);

  return { contract };
});

export default CREDTIModuleAB;
