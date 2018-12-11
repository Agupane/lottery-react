import Web3 from 'web3';

/** We took the provider injected by metamask on the browser,
 * remember that metamask provider has an older version of our current app **/
const web3 = new Web3(window.web3.currentProvider);
export default web3;