import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

    state = {
        manager: '',
        players:[],
        balance: '',
        value: ''
    };

   async componentDidMount(){
       /** We do not specify the from account because is gonna be injected directly by metamask **/
       const manager = await lottery.methods.manager().call();
       const players = await lottery.methods.getPlayers().call();
       const balance = await web3.eth.getBalance(lottery.options.address);
       this.setState({
           manager: manager,
           players: players,
           balance: balance,
           message: ''
       });
   }

   onSubmit = async (event) => {
       event.preventDefault();
       const accounts = await web3.eth.getAccounts();

       this.setState({
           message: 'Waiting on transaction success...'
       });

       /** We asume that the first account is the one that wants to enter to the lottery **/
       try{
           await lottery.methods.enter().send({
               from: accounts[0],
               value: web3.utils.toWei(this.state.value, 'ether')
           });
           this.setState({
               message: 'The transaction has been successfully executed, you are now part of the lottery'
           });
       }
       catch(error){
           this.setState({ message: 'We got an error trying to execute the transaction!: '+error.message });
       }
   };

   onClick = async () =>{
     const accounts = await web3.eth.getAccounts();
         this.setState({ message: 'Waiting on transaction success...'  });
     try{
         await lottery.methods.pickWinner().send({
             from: accounts[0]
         });
      //   await lottery.methods.getLastWinner().call();
         this.setState({ message: 'A winner has been picked!'  });
     }
     catch(error){
         this.setState({ message: 'We got an error trying to execute the transaction!: '+error.message });
     }

   };

  render() {
    return (
        <div>
            <h2>Lottery Contract</h2>
            <p>
                This contract is managed by: {this.state.manager}.
                There are currently { this.state.players.length } people entered,
                competing to win { web3.utils.fromWei(this.state.balance, 'ether') } ether!
            </p>
            <hr/>

            <form onSubmit={this.onSubmit}>
                <h4>Want to try your luck?</h4>
                <div>
                    <label>Amount of ether to enter: </label>
                    <input
                        value={ this.state.value }
                        onChange={event => this.setState({ value: event.target.value })}
                    />
                </div>
                <button>Enter</button>
            </form>
            <hr/>

            <h4>Ready to pickup a winner?</h4>
            <button onClick={this.onClick}>Pick a winner!</button>

            <hr/>

            <h1>{this.state.message}</h1>
        </div>
    );
  }
}

export default App;
