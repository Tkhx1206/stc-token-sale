const saleContractAddress = "0x2DbeAcd8dAE656ade58962F7b19814bAAfA582E4";

const saleAbi = [
  {
    "inputs": [],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_rate",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawUnsoldTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider, signer, saleContract;

document.getElementById("connectWallet").onclick = async () => {
  console.log("Connect Wallet button clicked!");

  if (window.ethereum) {
    console.log("MetaMask detected");

    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new window.ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = `Connected: ${address}`;

    saleContract = new window.ethers.Contract(saleContractAddress, saleAbi, signer);

    try {
      const rate = await saleContract.rate();
      document.getElementById("rateDisplay").innerText = rate.toString();
      console.log("Rate fetched:", rate.toString());
    } catch (err) {
      console.error("Error fetching rate:", err);
      document.getElementById("rateDisplay").innerText = "Error fetching rate";
    }
  } else {
    alert("Install MetaMask to use this site!");
  }
};

document.getElementById("buyToken").onclick = async () => {
  const ethAmount = document.getElementById("ethAmount").value;
  if (!ethAmount || isNaN(ethAmount)) return;

  try {
    const tx = await signer.sendTransaction({
      to: saleContractAddress,
      value: window.ethers.utils.parseEther(ethAmount)
    });
    document.getElementById("status").innerText = "Transaction sent: " + tx.hash;
    await tx.wait();
    document.getElementById("status").innerText = "Purchase complete!";
  } catch (err) {
    console.error("Error during purchase:", err);
    document.getElementById("status").innerText = "Transaction failed.";
  }
};
