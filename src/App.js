import React from 'react';
import { Button } from "dapparatus"
import './App.css';
import BurnerProvider from 'burner-provider';
import Web3 from 'web3';

var web3 = new Web3(new BurnerProvider('http://localhost:8545'));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount(){
    this.init()
  }
  async init(){
    console.log("web3",web3)
    let accounts = await web3.eth.getAccounts()
    this.setState({
      accounts: accounts,
      privateKey: localStorage.getItem('metaPrivateKey')
    },async ()=>{
      this.setState({
        balance: await web3.eth.getBalance(this.state.accounts[0])
      })
    })
  }
  handleInput(e){
    let update = {}
    update[e.target.name] = e.target.value
    this.setState(update)
  }
  render(){
    return (
      <div className="App">
        <h1>
          Burner Provider Sandbox
        </h1>
        <div style={{color:"#666666"}}>
          <div className="thing">
            accounts:
            <pre className="pre">
              {JSON.stringify(this.state.accounts,null,2)}
            </pre>
          </div>
          <div className="thing">
            balance:
            <pre className="pre">
              {this.state.balance}
            </pre>
          </div>
          <div className="thing">
          Message: <input
              style={{verticalAlign:"middle",width:200,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
              type="text" name="message" value={this.state.message} onChange={this.handleInput.bind(this)}
          />
          <Button color={"blue"} size="2" onClick={async ()=>{
            this.setState({
              sig: await web3.eth.sign(this.state.message,this.state.accounts[0])
            })
          }}>
              Sign
            </Button>
            <div>
              {this.state.sig}
            </div>
          </div>

          <div className="thing">
          Recover with message: <input
              style={{verticalAlign:"middle",width:200,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
              type="text" name="message" value={this.state.message} onChange={this.handleInput.bind(this)}
          /> and sig: <input
              style={{verticalAlign:"middle",width:200,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
              type="text" name="sig" value={this.state.sig} onChange={this.handleInput.bind(this)}
          />
          <Button color={"blue"} size="2" onClick={async ()=>{
            this.setState({
              recoveredAccount: await web3.eth.accounts.recover(this.state.message,this.state.sig)
            })
          }}>
              Recover
            </Button>
            <div>
              {this.state.recoveredAccount}
            </div>
          </div>


          <div className="thing">
            to: <input
                style={{verticalAlign:"middle",width:200,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="to" value={this.state.to} onChange={this.handleInput.bind(this)}
            />
            value: <input
                style={{verticalAlign:"middle",width:200,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="value" value={this.state.value} onChange={this.handleInput.bind(this)}
            />
            <Button color={"blue"} size="2" onClick={async ()=>{

                var tx = {
                  to: this.state.to,
                  from: this.state.accounts[0],
                  value: this.state.value,
                  data: '0x00'
                }

                web3.eth.sendTransaction(tx).then((receipt)=>{
                  console.log("receipt",receipt)
                  this.setState({receipt:receipt})
                });
              }}>
              Send Transaction
            </Button>
            <div>
            <div style={{width:"60%",wordWrap:"break-word",color:"#cccccc",backgroundColor:"#444444",margin:"auto",fontSize:12,padding:10}}>
              {JSON.stringify(this.state.receipt)}
            </div>
            </div>
          </div>


          <div className="thing">
            RAW to: <input
                style={{verticalAlign:"middle",width:200,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="to" value={this.state.to} onChange={this.handleInput.bind(this)}
            />
            value: <input
                style={{verticalAlign:"middle",width:200,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="value" value={this.state.value} onChange={this.handleInput.bind(this)}
            />
            pk: {this.state.privateKey}
            <Button color={"blue"} size="2" onClick={async ()=>{
              var Tx = require('ethereumjs-tx');
              var privateKey = new Buffer(this.state.privateKey.replace("0x",""), 'hex')

              var rawTx = {
                nonce: await web3.eth.getTransactionCount(this.state.accounts[0]),
                gas: 4712388,
                gasPrice: 100000000000,
                to: this.state.to,
                value: this.state.value,
                data: '0x00'
              }

              var tx = new Tx(rawTx);
              tx.sign(privateKey);

              var serializedTx = tx.serialize();

              console.log("SEND SIGNED TX",rawTx,serializedTx)

              web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then((receipt)=>{
                console.log("receipt",receipt)
                this.setState({rawReceipt:receipt})
              });

            }}>
              Send Transaction
            </Button>
            <div>
              <div style={{width:"60%",wordWrap:"break-word",color:"#cccccc",backgroundColor:"#444444",margin:"auto",fontSize:12,padding:10}}>
                {JSON.stringify(this.state.rawReceipt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
