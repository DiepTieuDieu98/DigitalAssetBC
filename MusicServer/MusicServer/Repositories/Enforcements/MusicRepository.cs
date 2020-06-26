using MusicServer.Models.Database;
using MusicServer.Models.Database.Queries;
using MusicServer.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicServer.Repositories.Enforcements
{
    public class MusicRepository : BaseRepository, IMusicRepository
    {
        public MusicRepository(MusicDBContext dbContext) : base(dbContext)
        {
        }

        void IMusicRepository.Create(MusicInfo music)
        {
            dbContext.MusicInfos.Add(music);
            dbContext.SaveChanges(true);
        }

        Guid IMusicRepository.CreateAndReturnId(MusicInfo music)
        {
            (this as IMusicRepository).Create(music);
            return music.Id;
        }

        void IMusicRepository.Delete(Guid id)
        {
            var musicToBeDeleted = (this as IMusicRepository).Get(id);
            dbContext.MusicInfos.Remove(musicToBeDeleted);
            dbContext.SaveChanges();
        }

        MusicInfo IMusicRepository.Get(Guid musicId)
        {
            var result = dbContext.MusicInfos.Where(c => c.Id == musicId).SingleOrDefault();
            return result;
        }

        List<MusicInfo> IMusicRepository.GetAll()
        {
            return dbContext.MusicInfos.ToList();
        }

        List<MusicQueryData> IMusicRepository.GetWithUserID(uint userID)
        {
            var result = from a in dbContext.MusicInfos
                         where a.OwnerId == userID
                         select new MusicQueryData()
                         {
                            Id = a.Id,
                            Name = a.Name,
                            Title = a.Title,
                            Album = a.Album,
                            PublishingYear = a.PublishingYear,
                            OwnerId = a.OwnerId,
                            LicenceLink = a.LicenceLink,
                            MusicLink = a.MusicLink,
                            CreatureType = a.CreatureType.ToString(),
                            OwnerType = a.OwnerType.ToString(),
                            TransactionHash = a.TransactionHash,
                            ContractAddress = a.ContractAddress,
                            DateCreated = a.DateCreated,
                            TransactionStatus = a.TransactionStatus.ToString()
                         };
            return result.ToList();
        }

        void IMusicRepository.Update(MusicInfo music)
        {
            dbContext.MusicInfos.Update(music);
            dbContext.SaveChanges();
        }
    }
}
