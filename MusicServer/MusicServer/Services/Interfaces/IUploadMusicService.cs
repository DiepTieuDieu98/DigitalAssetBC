using Microsoft.AspNetCore.Http;
using MusicServer.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicServer.Services.Interfaces
{
    public interface IUploadMusicService
    {
        Task<(string, string)> UploadFileToAzureBlob(IFormFile file, ResourceTypes resourceType = ResourceTypes.Other);

        string SaveAzureBlobInfoToDatabaseAndReturnKey(string blobName, string uri);

        string GetFileUri(string fileName);
    }
}
