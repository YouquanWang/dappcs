let erc20Abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "totalSupply",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
App = {
  web3Provider: null,
  contract: {},
  usdtAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // 请求用户账号授权
        await window.ethereum.enable();
      } catch (error) {
        // 用户拒绝了访问
        console.error("User denied account access")
      }
    }
    // 老版 MetaMask
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
   // 如果没有注入的web3实例，回退到使用 Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    }
    web3 = new Web3(App.web3Provider);
  
    $("#cur-address").html(web3.eth.coinbase)
    return App.initContract();
  },

  initContract: function() {
    App.contract = web3.eth.contract(erc20Abi).at(App.usdtAddress)
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferEth', App.transferEth);
    $(document).on('click', '#transferUsdt', App.transferUsdt);
  },
  transferEth: function(event){
    event.preventDefault()
    let amount = $('#amount').val()
    amount = new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toFixed()
    let address =  $('#address').val()
    web3.eth.sendTransaction({from: web3.eth.coinbase, to: address, value: amount}, (err, data)=>{})
  },
  transferUsdt: function(event){
    event.preventDefault()
    let amount = $('#usdtAmount').val()
    amount = new BigNumber(amount).multipliedBy(Math.pow(10, 6)).toFixed()
    let address =  $('#usdtAddress').val()
    let code = App.contract.transfer.getData(address, amount)
    web3.eth.sendTransaction({from: web3.eth.coinbase, to: App.usdtAddress, data: code, gas: '60000'}, (err, data)=>{})
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
