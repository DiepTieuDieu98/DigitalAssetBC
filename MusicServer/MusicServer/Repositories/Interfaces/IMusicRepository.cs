using MusicServer.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicServer.Repositories.Interfaces
{
    public interface IMusicRepository
    {
        void Create(MusicInfo music);
        Guid CreateAndReturnId(MusicInfo music);

        void Update(MusicInfo music);

        List<MusicInfo> GetAll();

        MusicInfo Get(Guid companyId);

        void Delete(Guid id);
    }
}
