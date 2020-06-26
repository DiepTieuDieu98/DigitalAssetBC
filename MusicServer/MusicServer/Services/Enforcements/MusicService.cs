using MusicServer.Repositories.Interfaces;
using MusicServer.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Nethereum.Hex.HexTypes;
using Nethereum.Util;
using MusicServer.Utilities;
using MusicServer.Models.Database;
using MusicServer.Models.Database.Queries;
using Hangfire;
using MusicServer.UndergroundJobs.Interfaces;

namespace MusicServer.Services.Enforcements
{
    public class MusicService : IMusicService
    {
        private readonly IEthereumService ethereumService;
        private readonly IMusicRepository musicRepository;
        private readonly string MusicAbi;

        public MusicService(
            IEthereumService ethereumService,
            IMusicRepository musicRepository,
            IOptions<EthereumSettings> options)
        {
            this.ethereumService = ethereumService;
            this.musicRepository = musicRepository;
            MusicAbi = options.Value.MusicAbi;
        }

        async Task<Guid> IMusicService.Create(
            string name,
            string title,
            string album,
            string publishingYear,
            uint ownerId,
            string licenceLink,
            string musicLink,
            CreatureTypes creatureType,
            OwnerTypes ownerType)
        {
            var function = ethereumService.GetFunction(EthereumFunctions.AddMusicAsset);
            try
            {
                var music = new MusicInfo()
                {
                    Name = name,
                    Title = title,
                    Album = album,
                    PublishingYear = publishingYear,
                    OwnerId = ownerId,
                    LicenceLink = licenceLink,
                    MusicLink = musicLink,
                    CreatureType = creatureType,
                    OwnerType = ownerType,
                    DateCreated = DateTime.UtcNow
                };
                Guid newMusicId = musicRepository.CreateAndReturnId(music);

                var transactionHash = await function.SendTransactionAsync(
                    ethereumService.GetEthereumAccount(),
                    new HexBigInteger(4000000),
                    new HexBigInteger(Nethereum.Web3.Web3.Convert.ToWei(50, UnitConversion.EthUnit.Gwei)),
                    new HexBigInteger(0),
                    functionInput: new object[] {
                        newMusicId.ToString(),
                        name,
                        title,
                        album,
                        publishingYear,
                        ownerId,
                        licenceLink,
                        musicLink,
                        (uint)creatureType,
                        (uint)ownerType
                    });

                music.TransactionHash = transactionHash;
                musicRepository.Update(music);

                BackgroundJob.Schedule<IMusicUndergroundJob>(
                    backgroundJob => backgroundJob.WaitForTransactionToSuccessThenFinishCreatingMusic(music),
                    TimeSpan.FromSeconds(3)
                );

                return newMusicId;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        List<MusicQueryData> IMusicService.GetAllMusics()
        {
            try
            {
                var musics = musicRepository.GetAll();
                List<MusicQueryData> result = new List<MusicQueryData>();
                foreach (var music in musics)
                {
                    result.Add(music.ToMusicQueryData());
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        List<MusicQueryData> IMusicService.GetMusicListWithUserID(uint userID)
        {
            try
            {
                var musics = musicRepository.GetWithUserID(userID);
                return musics;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
