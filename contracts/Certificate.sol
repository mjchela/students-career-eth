// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Certificate {
    string courseName;
    uint256 date;
    bytes32 documentHash; // Hash del documento perché non ha senso inserire il documento intero
}