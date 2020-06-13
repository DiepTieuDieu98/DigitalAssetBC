using MusicServer.Models.Database;
using MusicServer.Models.Database.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicServer.Services.Interfaces
{
    public interface IMusicService
    {
        /// <summary>
        /// Create a new album in the database and Ethereum network.
        /// </summary>
        /// <returns>Return the Id of the newly created album</returns>
        Task<Guid> Create(
            string name,
            string title,
            string album,
            string publishingYear,
            uint ownerId,
            uint licenceId,
            CreatureTypes creatureType,
            OwnerTypes ownerType);

        List<MusicQueryData> GetAllMusics();
        List<MusicQueryData> GetMusicListWithUserID(uint userID);
    }
}
