// when we install metamask it automatically injects web3 into our page
// it has provider which has our public and private keys
// buts this web3 uses older version
// we will take provider from this web3 instance and
// attach it to our new web3 instance using latest version
import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/a5582dd7138d46de9c7490bae956eddb"
  );
  web3 = new Web3(provider);
}

export default web3;
