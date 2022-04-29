// config file to set up erb3 with the Metamask provider. 
// That will connect us directly to the ethereum network, in this case Rinkeby, which should be set in Test mode.

import Web3 from "web3";
     
// this assumens that Metamask chrome extension is installed.
//  it will propmpt metamask access, you will have to accepts it.
window.ethereum.request({ method: "eth_requestAccounts" });
 
const web3 = new Web3(window.ethereum);
 
export default web3;