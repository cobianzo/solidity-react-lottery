import React from "react";
import "./App.css";
// import web3 from "./web3"; // our web3 lib with the Metamask provider connecting to Rinkeby network.
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  /* States */
  const [contractData, setContractData] = React.useState({
    manager: "",
    players: [],
    playersBalances: [],
    balance: "0",
    entryValue: "0.011", // in eth
    defaultAccount: "",
  });
  const [allowAddPlayer, setAllowAddPlayer] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [lastWinnerAddress, setLastWinnerAddress] = React.useState("");

  // HELPERS
  function getBalanceInWeis() {
    return web3.utils.fromWei(contractData.balance, "ether");
  }
  async function updateBalances() {
    console.log(
      "calculating new balances. Previous",
      contractData.playersBalances
    );
    const playersBalances = await Promise.all(
      contractData.players.map(async (player, index) => {
        const balance = await await web3.eth.getBalance(player);
        console.log("calulated for " + index + ": " + balance + " weis");
        return balance;
      })
    );
    setContractData({ ...contractData, playersBalances });
    return playersBalances; // [ 0 : 0.000434314323, 1: 2.000434314323  ... ]
  }

  /** On READY  */
  const fetchData = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await lottery.methods.getBalance().call();
    const accounts = await web3.eth.getAccounts();

    let playersBal = [];
    players.forEach(async (plAddress, index) => {
      const balweis = await web3.eth.getBalance(plAddress);
      // console.log(`player ${plAddress} has ${balweis} weis`);
      playersBal[index] = balweis;
    });
    setContractData({
      ...contractData,
      manager,
      players,
      balance,
      defaultAccount: accounts[0],
      playersBalances: playersBal,
    });
  };
  React.useEffect(() => {
    console.log("Ready:", web3.eth);
    fetchData();
  }, []);

  /** Handle events  */
  const handleEnterPlayer = async function (e) {
    e.preventDefault();
    if (!allowAddPlayer) return;
    // if (!web3.isAddress(contractData.defaultAccount)) {
    //   alert("The default account is not valid");
    //   return;
    // }

    setLastWinnerAddress("");
    setIsLoading(true);
    await lottery.methods.enter().send({
      from: contractData.defaultAccount,
      value: web3.utils.toWei(contractData.entryValue, "ether"),
    });
    setIsLoading(false);
    fetchData();
  };

  // FINISH GAME
  const handlePickAWinner = async function (e) {
    e.preventDefault();
    if (contractData.players.length === 0) {
      alert("There are no participants!");
      return;
    }
    setIsLoading(true);
    console.log("balances before: ", contractData.playersBalances);
    const oldBalances = contractData.playersBalances;
    await lottery.methods.pickWinner().send({
      from: contractData.defaultAccount,
    });
    setIsLoading(false);

    const newBalances = updateBalances();

    const winnerAddress = "";
    oldBalances.forEach((weis, playerIndex) => {
      if (typeof newBalances[playerIndex] === "undefined") {
        return;
      }
      if (weis < newBalances[playerIndex]) {
        // this is the winner
        setLastWinnerAddress(contractData.players[playerIndex]);
      }
    });

    fetchData(); // this sets players to 0.
    console.log("balances after: ", contractData.playersBalances);
  };
  /** -- */
  return (
    <div className="App">
      {isLoading && (
        <div className="is-loading">
          <div className="is-loading__inner">Loading...</div>
        </div>
      )}
      <header className="App-header">
        <h1>Contract Lottery</h1>
        <small>{lottery.options.address} </small>
        <p>This contract is managed by {contractData?.manager} !</p>
        <p>There are {contractData.players.length} participants</p>
        <p>Playing for a total of {getBalanceInWeis()} eth</p>
        {allowAddPlayer && (
          <section>
            <p>Wanna try your luck?</p>
            <form onSubmit={handleEnterPlayer}>
              <button>Join the lottery</button>
              <input
                type="number"
                step="0.001"
                min="0.011"
                value={contractData.entryValue}
                max="100000000"
                onChange={(e) =>
                  setContractData({
                    ...contractData,
                    entryValue: e.target.value,
                  })
                }
              />
              <span style={{ marginLeft: "10px" }}>ETH</span>
            </form>
            <p> sending from {contractData.defaultAccount} </p>
          </section>
        )}
      </header>
      <main>
        {contractData.playersBalances.map((balanceWeis, index) => (
          <p key={`player-${index}`}>
            Player {index} :<span>{balanceWeis}</span>
          </p>
        ))}

        {contractData.players.length && (
          <form onSubmit={handlePickAWinner}>
            <button type="submit">Pick a winner</button>
          </form>
        )}
        {lastWinnerAddress && <h2>The winner is: {lastWinnerAddress} </h2>}
      </main>
    </div>
  );
}

export default App;
