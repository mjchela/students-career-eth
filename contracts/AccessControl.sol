// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Verifichiamo che il chiamante della funzione (msg.sender) sia effettivamente
// un amministratore o meno
contract AccessControl {
    address public superAdmin;
    // Ad ogni indirizzo è associato un valore booleano (vero o falso)
    // a seconda se è un admin o un instituzione
    mapping(address => bool) public admins;
    mapping(address => bool) public institutions;

    constructor() {
        superAdmin = msg.sender;
        admins[msg.sender] = true;
    }

    modifier onlySuperAdmin() {
        // Se la condizione è falsa, la transazione fallisce
        require(msg.sender == superAdmin, "Solo super admin");
        _; // Esegue la restante parte della funzione
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Solo admin");
        _; 
    }

    // Solo i "SuperAdmin" possono aggiungere un admin
    function addAdmin(address _admin) public onlySuperAdmin {
        admins[_admin] = true; // Marca quell'indirizzo come admin
    }

    // Only admins che add institutions
    function addInstitution(address _institution) public onlyAdmin {
        institutions[_institution] = true; // Marca quell'indirizzo come istituzione
    }

    // Controlla se un indirzzo fa parte di un istituzione
    function isInstitution(address _institution) public view returns (bool) {
        return institutions[_institution];
    }
}