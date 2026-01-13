const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StudentCareer", function () {
  let studentCareer : any; // Istanza del contratto
  // Ruoli dei firmatari
  let superAdmin : any, admin : any, institution : any, student : any, outsider : any;

  // Setup prima di ogni test
  beforeEach(async function () {  
    [superAdmin, admin, institution, student, outsider] =
      await ethers.getSigners(); // Ottieni i firmatari

    const StudentCareer = await ethers.getContractFactory(
      "StudentCareer",
      superAdmin
    );
    studentCareer = await StudentCareer.deploy();
    await studentCareer.waitForDeployment();
  });

  it("Deployer è un superAdmin", async function () {
    expect(await studentCareer.superAdmin()).to.equal(
      superAdmin.address
    );
  });

  it("SuperAdmin può aggiungere un admin", async function () {
    await studentCareer.addAdmin(admin.address);
    expect(await studentCareer.admins(admin.address)).to.equal(true);
  });

  it("Gli admin possono aggiungere istituzioni", async function () {
    await studentCareer.addAdmin(admin.address);
    await studentCareer.connect(admin).addInstitution(institution.address);
    expect(await studentCareer.isInstitution(institution.address)).to.equal(true);
  });

  it("Le istituzioni possono rilasciare i certificati", async function () {
    await studentCareer.addAdmin(admin.address);
    await studentCareer.connect(admin).addInstitution(institution.address);

    // Crea un hash per il certificato
    const hash = ethers.keccak256(ethers.toUtf8Bytes("certificate"));

    await studentCareer
      .connect(institution)
      .addCertificate(student.address, "Blockchain 101", hash);

    // Verifica che il certificato sia stato aggiunto correttamente
    const certs = await studentCareer.getCertificates(student.address);

    expect(certs.length).to.equal(1);
    expect(certs[0].courseName).to.equal("Blockchain 101");
    expect(certs[0].documentHash).to.equal(hash);
  });

  it("Non admin non possono aggiungere istituzioni", async function () {
    await expect(
      studentCareer.connect(outsider).addInstitution(outsider.address)
    ).to.be.revertedWith("Solo admin"); 
  });

  it("Emetti l'evento CertificateIssued", async function () {
    await studentCareer.addAdmin(admin.address);
    await studentCareer.connect(admin).addInstitution(institution.address);

    const hash = ethers.keccak256(ethers.toUtf8Bytes("cert"));

    await expect(
      studentCareer
        .connect(institution)
        .addCertificate(student.address, "Solidity", hash)
    )
      .to.emit(studentCareer, "CertificateIssued")
      .withArgs(institution.address, student.address, "Solidity", hash);
  });
});
