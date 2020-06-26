using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MusicServer.Services.Interfaces;
using Microsoft.Extensions.Options;
using Nethereum.Contracts;
using Nethereum.Hex.HexTypes;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Web3.Accounts;
using Nethereum.Web3;
using Nethereum.Hex.HexConvertors.Extensions;
using Nethereum.Signer;
using Nethereum.KeyStore;
using Nethereum.HdWallet;

namespace MusicServer.Services.Enforcements
{
    public class EthereumService : IEthereumService
    {
        private string ethereumAccount;
        private readonly string ethereumPassword;

        private Web3 web3;
        private readonly string abi;
        private readonly string musicAbi;
        private readonly string masterContractAddress;

        public EthereumService(IOptions<EthereumSettings> options)
        {
            ethereumAccount = options.Value.EthereumAccount;
            ethereumPassword = options.Value.EthereumPassword;
            abi = options.Value.Abi;
            musicAbi = options.Value.MusicAbi;
            masterContractAddress = options.Value.ContractAddress;

            var privateKey = "0xF8650E3F5A924DB806372FE95166DAF224808B1B0ADC54084CA37915FA6E07D8";
            var account = new Account(privateKey);
            web3 = new Web3(account, "https://ropsten.infura.io/v3/aaceb4b7c236404e9eb5416bef5292e0");

            //var privateKey = "0xf339dade22098c165d2a798f3c6895c44456ea7031ba0d841ed291dc9023e9f7";
            //var account = new Account(privateKey);
            //web3 = new Web3(account, "http://127.0.0.1:7545");

        }

        Contract IEthereumService.GetMasterContract()
        {
            if (String.IsNullOrEmpty(abi) || String.IsNullOrEmpty(masterContractAddress))
            {
                throw new ArgumentNullException();
            }
            return web3.Eth.GetContract(abi, masterContractAddress);
        }

        Function IEthereumService.GetFunction(string name)
        {
            var contract = (this as IEthereumService).GetMasterContract();
            return contract.GetFunction(name);
        }

        async Task<int> IEthereumService.CallFunction(Function function, params object[] functionInput)
        {
            var estimate = await function.EstimateGasAsync();
            try
            {
                var result = await function.CallAsync<int>(
                    ethereumAccount,
                    new HexBigInteger(300000),
                    new HexBigInteger(0),
                    functionInput);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        Task IEthereumService.SendTransaction(Function function, params object[] functionInput)
        {
            throw new NotImplementedException();
        }

        string IEthereumService.GetMasterContractAddress()
        {
            return masterContractAddress;
        }

        string IEthereumService.GetEthereumAccount()
        {
            return ethereumAccount;
        }

        Contract IEthereumService.GetContract(string abi, string address)
        {
            return web3.Eth.GetContract(abi, address);
        }

        Function IEthereumService.GetFunction(Contract contract, string name)
        {
            return contract.GetFunction(name);
        }

        string IEthereumService.GetMusicABI()
        {
            return musicAbi;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="transactionHash"></param>
        /// <see cref="https://docs.nethereum.com/en/latest/introduction/web3/"/>
        async Task<TransactionReceipt> IEthereumService.GetTransactionReceipt(string transactionHash)
        {
            var result = await web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash);
            return result;
        }

        async Task<string> IEthereumService.GetObjectContractAddress(Guid id)
        {
            var function = (this as IEthereumService).GetFunction("getAddressByID");
            try
            {
                var result = await function.CallAsync<string>(
                   (this as IEthereumService).GetEthereumAccount(),
                   new HexBigInteger(600000),
                   new HexBigInteger(0),
                   functionInput: new object[]
                   {
                       id.ToString()
                   });
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        
    }
}
