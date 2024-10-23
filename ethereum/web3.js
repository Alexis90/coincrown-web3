import { Web3 } from 'web3';

require('dotenv').config({ path: '../.env' })

const { INFURA_ENDPOINT } = process.env;

let web3;

// in the browser and metamask is running.
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
} else {
  // on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(INFURA_ENDPOINT);
  web3 = new Web3(provider);
}

export default web3;
