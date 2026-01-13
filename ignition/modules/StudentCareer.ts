import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StudentCareerModule", (m) => {
  // Deploy StudentCareer
  const studentCareer = m.contract("StudentCareer");

  return { studentCareer };
});
