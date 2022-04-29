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
    playersBalances: {}, // map player address to balance
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

  /** return an object maping player addresss and money in their balance
   * [ 0xfd432 : 0.000434314323, 0xee0d32: 2.000434314323  ... ]  */
  async function getBalances() {
    console.log(
      "calculating new balances. Previous",
      contractData.playersBalances,
      contractData.players
    );
    const players = await lottery.methods.getPlayers().call();
    let playersBalances = {};
    await Promise.all(
      players.map(async (player, index) => {
        const balance = await web3.eth.getBalance(player);
        console.log("calculating player: " + index, balance);
        playersBalances[player] = balance;
      })
    );
    // setContractData({ ...contractData, playersBalances });
    console.log("After calculating:", playersBalances);
    return playersBalances; // [ 0xfd432 : 0.000434314323, 0xee0d32: 2.000434314323  ... ]
  }

  const typicalErrorHandlerOnTransaction = (error, result) => {
    console.log("These are the errors: ", error, result);
    if (error?.code) {
      alert(
        "There was an error. " + (error.message ? error.message : "No msg")
      );
      setIsLoading(false);
    }
  };

  /** On READY  */
  const fetchData = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await lottery.methods.getBalance().call();
    const accounts = await web3.eth.getAccounts();
    const playersBalances = await getBalances();

    setContractData({
      ...contractData,
      manager,
      players,
      balance,
      defaultAccount: accounts[0],
      playersBalances,
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
    setIsLoading("Joining the pool. Please wait...");
    await lottery.methods.enter().send(
      {
        from: contractData.defaultAccount,
        value: web3.utils.toWei(contractData.entryValue, "ether"),
      },
      typicalErrorHandlerOnTransaction
    );
    setIsLoading(false);
    fetchData();
  };

  // FINISH GAME
  // ------------------------------------------------
  const handlePickAWinner = async function (e) {
    e.preventDefault();
    if (contractData.players.length === 0) {
      alert("There are no participants!");
      return;
    }
    setIsLoading("Finding a winner. Please wait...");
    console.log("balances before: ", contractData.playersBalances);

    // Lets Pay to the winner:
    const oldBalances = contractData.playersBalances;
    await lottery.methods.pickWinner().send(
      {
        from: contractData.defaultAccount,
      },
      typicalErrorHandlerOnTransaction
    );
    // The winner is paid.

    setIsLoading(false);

    // calculate the winner. WE still dont know who he was, we just paid him.
    await Promise.all(
      Object.keys(oldBalances).forEach(async (player, playerIndex) => {
        // get the new balance of the player:
        const balance = await web3.eth.getBalance(player);
        if (oldBalances[player] < balance) {
          // this is the winner
          console.log("we found the winner: ", player);
          setLastWinnerAddress(player);
        }
      }),

      fetchData() // this sets players to 0 (updates UI info).
    );
  };
  /** -- */
  return (
    <div className="App">
      {isLoading && (
        <div className="is-loading">
          <div className="is-loading__inner">{isLoading}</div>
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
        {contractData.players.length > 0 &&
          Object.keys(contractData.playersBalances).map((player, index) => (
            <p key={`player-${index}`}>
              Player {index} :
              <span>{contractData.playersBalances[player]}</span>
            </p>
          ))}

        {contractData.players.length > 0 && (
          <form onSubmit={handlePickAWinner}>
            <button type="submit">Pick a winner</button>
          </form>
        )}
        {lastWinnerAddress && (
          <>
            <h2>The winner is: {lastWinnerAddress} </h2>
            <a
              className="button"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setLastWinnerAddress("");
              }}
            >
              X
            </a>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
