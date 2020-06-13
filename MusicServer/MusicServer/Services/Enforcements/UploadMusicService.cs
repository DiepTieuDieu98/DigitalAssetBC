using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MusicServer.Models.Database;
using MusicServer.Repositories.Interfaces;
using MusicServer.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicServer.Services.Enforcements
{
    public class UploadMusicService : IUploadMusicService
    {
        private readonly IConfiguration configuration;
        private readonly string storageConnectionString;
        private readonly IMusicAssetRepository musicAssetRepository;

        public UploadMusicService(
            IConfiguration configuration,
            IMusicAssetRepository musicAssetRepository)
        {
            this.configuration = configuration;
            this.musicAssetRepository = musicAssetRepository;

            storageConnectionString = this.configuration["StorageBlobString"];
        }

        string IUploadMusicService.SaveAzureBlobInfoToDatabaseAndReturnKey(string blobName, string uri)
        {
            var blobResource = new MusicAsset()
            {
                Name = blobName,
                Uri = uri
            };
            var key = musicAssetRepository.CreateAndReturnKey(blobResource);
            return key;
        }

        /// <summary>
        /// Upload given file to Azure Blob Storage and return its unique name on Blob and the URI where the resource lives.
        /// </summary>
        /// <param name="file"></param>
        /// <param name="resourceType"></param>
        /// <returns>
        ///     First return value is the unique file name of the file on Azure Blob Storage.
        ///     Second return value is the URI of the resource on Azure Blob Storage.
        /// </returns>
        async Task<(string, string)> IUploadMusicService.UploadFileToAzureBlob(IFormFile file, ResourceTypes resourceType)
        {
            // Create a BlobServiceClient object which will be used to create a container client
            BlobServiceClient blobServiceClient = new BlobServiceClient(storageConnectionString);

            //Create a unique name for the container
            string containerName = "bug-container";
            switch (resourceType)
            {
                case (ResourceTypes.Audio):
                    {
                        containerName = "audio";
                        break;
                    }
                case (ResourceTypes.Lyrics):
                    {
                        containerName = "lyrics";
                        break;
                    }
                case (ResourceTypes.Video):
                    {
                        containerName = "video";
                        break;
                    }
                case (ResourceTypes.Licence):
                    {
                        containerName = "licence";
                        break;
                    }
                case (ResourceTypes.Other):
                default:
                    {
                        containerName = "other";
                        break;
                    }
            }


            // Create the container and return a container client object
            var response = await blobServiceClient.GetBlobContainerClient(containerName)
                .CreateIfNotExistsAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Get a reference to a blob
            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName);
            var fileExtension = System.IO.Path.GetExtension(file.FileName);
            var uniqueFileName = fileName + "-" + Guid.NewGuid().ToString() + fileExtension;
            file.Headers["CONTENT-TYPE"] = this.GetFileContentType(file.FileName);
            var fileContentStream = file.OpenReadStream();
            BlobClient blobClient = containerClient.GetBlobClient(uniqueFileName);
            try
            {
                // Open the file and upload its data
                await blobClient.UploadAsync(fileContentStream);
                blobClient.SetHttpHeaders(
                    new Azure.Storage.Blobs.Models.BlobHttpHeaders()
                    {
                        ContentType = file.ContentType
                    });
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return (uniqueFileName, blobClient.Uri.AbsoluteUri);
        }

        public string GetFileContentType(string FilePath)
        {
            string ContentType = string.Empty;
            string Extension = System.IO.Path.GetExtension(FilePath).ToLower();

            switch (Extension)
            {
                case "pdf":
                case ".pdf":
                    ContentType = "application/pdf";
                    break;
                case "bmp":
                case ".bmp":
                    ContentType = "image/bmp";
                    break;
                case "gif":
                case ".gif":
                    ContentType = "image/gif";
                    break;
                case "png":
                case ".png":
                    ContentType = "image/png";
                    break;
                case "jpg":
                case ".jpg":
                    ContentType = "image/jpeg";
                    break;
                case "jpeg":
                case ".jpeg":
                    ContentType = "image/jpeg";
                    break;
                case "zip":
                case ".zip":
                    ContentType = "application/zip";
                    break;
                default:
                    ContentType = "application/octet-stream";
                    break;

            }
            return ContentType;
        }

        string IUploadMusicService.GetFileUri(string fileName)
        {
            var resource = musicAssetRepository.Get(fileName);

            if (resource == null)
            {
                return null;
            }

            var resourceUri = resource.Uri;
            return resourceUri;
        }
    }
}
