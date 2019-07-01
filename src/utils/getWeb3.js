import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        console.log("Found window.ethereum");
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:9545"
        );
        //const web3 = new Web3(provider);
        const web3 = new Web3(window.ethereum);
        resolve(web3);
        try {
          // Request account access if needed
          // TODO: if the user just exits here, it doesn't throw an error.
          let accounts = await window.ethereum.enable();
          console.log("Connected to window.ethereum account: " + accounts[0]);
        } catch (error) {
          // User denied account access...
          console.log(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:9545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
