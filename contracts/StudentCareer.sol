// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";
import "./Certificate.sol";

contract StudentCareer is AccessControl {

    // Dato un indirizzo di uno studente, ritorniamo un array di certificati
    mapping(address => Certificate[]) public careers;

    event CertificateIssued(address indexed institution, address indexed student,
     string courseName, bytes32 documentHash);

    modifier onlyInstitution() {
        require(institutions[msg.sender], "Solo un'istituzione puo' emettere certificati");
        _;
    }

    function addCertificate(
        address student, 
        string memory courseName,
        bytes32 documentHash
    ) public onlyInstitution {
        careers[student].push(
            Certificate(courseName, block.timestamp, documentHash)
        );

        // Dopo aver emesso un evento, chi osserva la blockchain può leggere questi 
        // dati senza dover interrogare direttamente le variabili del contratto.
        emit CertificateIssued(msg.sender, student, courseName, documentHash);
    }

    function getCertificates(address student) public view returns (Certificate[] memory) {
        return careers[student];
    }
}