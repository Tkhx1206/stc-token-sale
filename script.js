// Replace with your real contract address and ABI
const saleContractAddress = "0xYourSTCSaleContract";
const saleAbi = [ /* paste your STCSale ABI here */ ];

let provider, signer, saleContract;

document.getElementById("connectWallet").onclick = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = `Connected: ${address}`;

    saleContract = new ethers.Contract(saleContractAddress, saleAbi, signer);

    const rate = await saleContract.rate();
    document.getElementById("rateDisplay").innerText = rate.toString();
  } else {
    alert("Install MetaMask!");
  }
};

document.getElementById("buyToken").onclick = async () => {
  const ethAmount = document.getElementById("ethAmount").value;
  if (!ethAmount || isNaN(ethAmount)) return;

  try {
    const tx = await signer.sendTransaction({
      to: saleContractAddress,
      value: ethers.utils.parseEther(ethAmount)
    });
    document.getElementById("status").innerText = "Transaction sent: " + tx.hash;
    await tx.wait();
    document.getElementById("status").innerText = "Purchase complete!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Transaction failed.";
  }
};
