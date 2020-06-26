using Hangfire;
using Microsoft.Extensions.Options;
using MusicServer.Models.Database;
using MusicServer.Models.Database.Queries;
using MusicServer.Repositories.Interfaces;
using MusicServer.Services.Interfaces;
using MusicServer.UndergroundJobs.Interfaces;
using MusicServer.Utilities;
using NBitcoin;
using Nethereum.Hex.HexTypes;
using Nethereum.Util;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace MusicServer.Services.Enforcements
{
    public class MusicAssetTransferService : IMusicAssetTransferService
    {
        private readonly IMusicRepository musicRepository;
        private readonly IMusicAssetTransferRepository musicAssetTransferRepository;
        private readonly IEthereumService ethereumService;
        private readonly string MusicAssetTransferAbi;
        public MusicAssetTransferService(
            IMusicRepository musicRepository,
            IMusicAssetTransferRepository musicAssetTransferRepository,
            IEthereumService ethereumService,
            IOptions<EthereumSettings> options)
        {
            this.musicRepository = musicRepository;
            this.musicAssetTransferRepository = musicAssetTransferRepository;
            this.ethereumService = ethereumService;
            MusicAssetTransferAbi = options.Value.MusicAssetTransferAbi;
        }

        async Task<Guid> IMusicAssetTransferService.Create(Guid musicId, string fromUserId, string toUserId, TranTypes tranType, FanTypes fanType, decimal amountValue)
        {
            //var music = musicRepository.Get(musicId);
            uint currentTime = (uint)DateTime.UtcNow.ToUnixTimestamp();

            var transfer = new MusicAssetTransfer()
            {
                MusicId = musicId,
                FromId = fromUserId,
                ToId = toUserId,
                DateTransferred = currentTime,
                TranType = tranType,
                FanType = fanType,
                DateStart = currentTime,
                DateEnd = currentTime,
                IsPermanent = true,
                IsConfirmed = true,
                DateCreated = DateTime.UtcNow,
                AmountValue = amountValue
            };
            
            var newTransferId = musicAssetTransferRepository.CreateAndReturnId(transfer);

            //var privateKey = "0xC40B82DCA66F1B0F117851AEF8E40D197F55499B09858B89AF2F8FF3B4FE83F3";
            //var account = new Account(privateKey);
            //Web3 web3 = new Web3(account, "https://ropsten.infura.io/v3/aaceb4b7c236404e9eb5416bef5292e0");
            //var transaction = web3.Eth.GetEtherTransferService().TransferEtherAndWaitForReceiptAsync(transfer.ToId.ToString(), amountValue);

            var function = ethereumService.GetFunction(EthereumFunctions.AddTransactionMusic);

            //var result = await function.CallAsync<string>(
            //       ethereumService.GetEthereumAccount(),
            //       new HexBigInteger(600000),
            //       new HexBigInteger(0),
            //       functionInput: new object[]
            //       {
            //            newTransferId.ToString(),
            //            transfer.MusicId.ToString(),
            //            transfer.FromId.ToString(),
            //            transfer.ToId.ToString(),
            //            transfer.DateTransferred,
            //            transfer.TranType,
            //            transfer.FanType,
            //            transfer.DateStart,
            //            transfer.DateEnd,
            //            transfer.IsPermanent,
            //            transfer.IsConfirmed
            //       });

            var transactionHash = await function.SendTransactionAsync(
                ethereumService.GetEthereumAccount(),
                new HexBigInteger(6000000),
                new HexBigInteger(Nethereum.Web3.Web3.Convert.ToWei(10, UnitConversion.EthUnit.Gwei)),
                new HexBigInteger(0),
                functionInput: new object[] {
                    newTransferId.ToString(),
                    transfer.MusicId.ToString(),
                    transfer.FromId.ToString(),
                    transfer.ToId.ToString(),
                    transfer.DateTransferred,
                    transfer.TranType,
                    transfer.FanType,
                    transfer.DateStart,
                    transfer.DateEnd,
                    transfer.IsPermanent,
                    transfer.IsConfirmed
                });

            transfer.TransactionHash = transactionHash;
            musicAssetTransferRepository.Update(transfer);

            bool isTransactionSuccess = false;
            do
            {
                var receipt = ethereumService.GetTransactionReceipt(transfer.TransactionHash).Result;
                if (receipt == null)
                    continue;
                if (receipt.Status.Value == (new HexBigInteger(1)).Value)
                {
                    isTransactionSuccess = true;
                    var contractAddress = ethereumService.GetObjectContractAddress(transfer.Id).Result;
                    transfer.ContractAddress = contractAddress;
                    transfer.TransactionStatus = TransactionStatuses.Success;
                    musicAssetTransferRepository.Update(transfer);

                }
            }
            while (isTransactionSuccess != true);


            //BackgroundJob.Schedule<IMusicAssetTransferUndergroundJob>(
            //    job => job.WaitForTransactionToSuccessThenFinishCreating(transfer),
            //    TimeSpan.FromSeconds(3)
            //);

            return newTransferId;
        }

        async Task<Guid> IMusicAssetTransferService.CreateLicenceTransaction(Guid musicId, string fromUserId, string toUserId, TranTypes tranType, FanTypes fanType, int duration, decimal amountValue)
        {
            var music = musicRepository.Get(musicId);
            DateTime startDate = DateTime.UtcNow;
            uint currentTime = (uint)startDate.ToUnixTimestamp();
            DateTime endDate = startDate.AddDays(duration);
            uint endDateTimeStamp = (uint)endDate.ToUnixTimestamp();

            var transfer = new MusicAssetTransfer()
            {
                MusicId = music.Id,
                FromId = fromUserId,
                ToId = toUserId,
                DateTransferred = currentTime,
                TranType = tranType,
                FanType = fanType,
                DateStart = currentTime,
                DateEnd = endDateTimeStamp,
                IsPermanent = false,
                IsConfirmed = false,
                DateCreated = DateTime.UtcNow,
                AmountValue = amountValue
            };


            var newTransferId = musicAssetTransferRepository.CreateAndReturnId(transfer);

            var function = ethereumService.GetFunction(EthereumFunctions.AddTransactionMusic);
            var transactionHash = await function.SendTransactionAsync(
                ethereumService.GetEthereumAccount(),
                new HexBigInteger(6000000),
                new HexBigInteger(Nethereum.Web3.Web3.Convert.ToWei(10, UnitConversion.EthUnit.Gwei)),
                new HexBigInteger(0),
                functionInput: new object[] {
                    newTransferId.ToString(),
                    transfer.MusicId.ToString(),
                    transfer.FromId.ToString(),
                    transfer.ToId.ToString(),
                    transfer.DateTransferred,
                    transfer.TranType,
                    transfer.FanType,
                    transfer.DateStart,
                    transfer.DateEnd,
                    transfer.IsPermanent,
                    transfer.IsConfirmed
                });

            transfer.TransactionHash = transactionHash;
            musicAssetTransferRepository.Update(transfer);


            BackgroundJob.Schedule<IMusicAssetTransferUndergroundJob>(
                job => job.WaitForTransactionToSuccessThenFinishCreating(transfer),
                TimeSpan.FromSeconds(3)
            );

            return newTransferId;
        }

        async Task IMusicAssetTransferService.UpdateLicenceTransaction(
            Guid id,
            Guid musicId,
            string fromUserId,
            string toUserId,
            FanTypes fanType,
            decimal amountValue
            )
        {
            var transfer = musicAssetTransferRepository.Get(id);
            if (transfer == null)
            {
                throw new ArgumentException("Id does not exist in the system.", nameof(id));
            }
            uint currentTime = (uint)DateTime.UtcNow.ToUnixTimestamp();

            transfer.MusicId = musicId;
            transfer.FromId = fromUserId;
            transfer.ToId = toUserId;
            transfer.FanType = fanType;
            transfer.IsConfirmed = true;
            transfer.DateTransferred = currentTime;

            var privateKey = "0xC40B82DCA66F1B0F117851AEF8E40D197F55499B09858B89AF2F8FF3B4FE83F3";
            var account = new Account(privateKey);
            Web3 web3 = new Web3(account, "https://ropsten.infura.io/v3/aaceb4b7c236404e9eb5416bef5292e0");
            var transaction = web3.Eth.GetEtherTransferService().TransferEtherAndWaitForReceiptAsync(transfer.ToId.ToString(), amountValue);

            // Update the blockchain.
            var contract = ethereumService.GetContract(MusicAssetTransferAbi, transfer.ContractAddress);
            var updateFunction = ethereumService.GetFunction(contract, EthereumFunctions.UpdateMusicAssetTransfer);
            var updateReceipt = await updateFunction.SendTransactionAsync(
                ethereumService.GetEthereumAccount(),
                new HexBigInteger(6000000),
                new HexBigInteger(Nethereum.Web3.Web3.Convert.ToWei(20, UnitConversion.EthUnit.Gwei)),
                new HexBigInteger(0),
                functionInput: new object[] {
                    transfer.MusicId.ToString(),
                    transfer.FromId.ToString(),
                    transfer.ToId.ToString(),
                    transfer.FanType,
                    transfer.DateTransferred,
                    transfer.IsConfirmed
                });

            musicAssetTransferRepository.Update(transfer);
        }

        MusicAssetTransfer IMusicAssetTransferService.Get(Guid id)
        {
            var result = musicAssetTransferRepository.Get(id);
            return result;
        }

        List<MusicAssetTransferQueryData> IMusicAssetTransferService.GetAll()
        {
            var result = new List<MusicAssetTransferQueryData>();
            var rawTransfers = musicAssetTransferRepository.GetAll();
            foreach (var transfer in rawTransfers)
            {
                result.Add(transfer.ToMusicAssetTransferQueryData());
            }
            return result;
        }

        List<MusicAssetTransfer> IMusicAssetTransferService.GetTransactMusic(Guid id)
        {
            var result = new List<MusicAssetTransfer>();
            var rawTransfers = musicAssetTransferRepository.GetTransactMusic(id);
            foreach (var transfer in rawTransfers)
            {
                result.Add(transfer);
            }
            return result;
        }

        List<MusicAssetTransfer> IMusicAssetTransferService.GetLicenceTransactMusic(Guid id)
        {
            var result = new List<MusicAssetTransfer>();
            var rawTransfers = musicAssetTransferRepository.GetLicenceTransactMusic(id);
            foreach (var transfer in rawTransfers)
            {
                result.Add(transfer);
            }
            return result;
        }

        MusicAssetTF IMusicAssetTransferService.GetLicenceMusicTransfersSC(Guid id)
        {
            var contract = ethereumService.GetMasterContract();
            var function = contract.GetFunction(EthereumFunctions.GetMusicAssetTransfer);
            var musicAssetTF = function.CallDeserializingToObjectAsync <MusicAssetTF> (id.ToString());

            //foreach (var transfer in rawTransfers)
            //{
            //    result.Add(transfer);
            //}
            Console.WriteLine(musicAssetTF.Result.Id);
            return musicAssetTF.Result;
        }

        async Task<string> IMusicAssetTransferService.GetContractAddress(Guid id)
        {
            var function = ethereumService.GetFunction("getAddressByID");
            try
            {
                var result = await function.CallAsync<string>(
                   ethereumService.GetEthereumAccount(),
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


        async Task IMusicAssetTransferService.Delete(Guid id)
        {
            var transfer = musicAssetTransferRepository.Get(id);
            if (transfer == null)
            {
                throw new ArgumentException("Id does not exist in the system.", nameof(id));
            }

            try
            {
                var function = ethereumService.GetFunction(EthereumFunctions.RemoveMusicAssetTransfer);
                var transactionHash = await function.SendTransactionAsync(
                                  ethereumService.GetEthereumAccount(),
                                  new HexBigInteger(1000000),
                                  new HexBigInteger(0),
                                  functionInput: new object[] {
                                       id.ToString()
                });

                var musicContract = ethereumService.GetContract(MusicAssetTransferAbi, transfer.ContractAddress);
                var deleteFunction = ethereumService.GetFunction(musicContract, EthereumFunctions.SelfDelete);
                var receipt = await deleteFunction.SendTransactionAsync(
                    ethereumService.GetEthereumAccount(),
                    new HexBigInteger(6000000),
                    new HexBigInteger(Nethereum.Web3.Web3.Convert.ToWei(5, UnitConversion.EthUnit.Gwei)),
                    new HexBigInteger(0),
                    functionInput: new object[] { }
                );

                musicAssetTransferRepository.Delete(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
