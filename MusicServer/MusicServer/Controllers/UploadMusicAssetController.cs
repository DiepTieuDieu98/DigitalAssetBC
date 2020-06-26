using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MusicServer.Models.Database;
using MusicServer.Services.Interfaces;

namespace MusicServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadMusicAssetController : ControllerBase
    {
        const String folderName = "files";
        private readonly String folderPath = Path.Combine(Directory.GetCurrentDirectory(), folderName);
        private readonly IConfiguration configuration;
        private readonly IUploadMusicService uploadMusicService;

        public UploadMusicAssetController(
            IConfiguration configuration,
            IUploadMusicService uploadMusicService)
        {
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            this.configuration = configuration;
            this.uploadMusicService = uploadMusicService;
        }

        [HttpPost("licence")]
        public async Task<IActionResult> PostLicence(
            [FromForm(Name = "myFile")]IFormFile myFile)
        {

            try
            {
                var (blobFileName, uri) = await uploadMusicService.UploadFileToAzureBlob(myFile, ResourceTypes.Licence);
                var key = uploadMusicService.SaveAzureBlobInfoToDatabaseAndReturnKey(blobFileName, uri);
                //return CreatedAtRoute(routeName: "myFile", routeValues: new { fileName = key }, value: null);
                return Ok(new { licenceLink = uri });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("audio")]
        public async Task<IActionResult> PostAudio(
            [FromForm(Name = "myFile")]IFormFile myFile)
        {

            try
            {
                var (blobFileName, uri) = await uploadMusicService.UploadFileToAzureBlob(myFile, ResourceTypes.Audio);
                var key = uploadMusicService.SaveAzureBlobInfoToDatabaseAndReturnKey(blobFileName, uri);
                //return CreatedAtRoute(routeName: "myFile", routeValues: new { fileName = key }, value: null);
                return Ok(new { audioLink = uri });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("DeleteAudio")]
        public IActionResult DeleteAudio(string blobName)
        {

            try
            {
                uploadMusicService.DeleteFileInAzureBlob(blobName, ResourceTypes.Audio);
                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("CopyFileEncryptAndUploadAudio")]
        public IActionResult CopyFileEncryptAndUploadAudio(string blobName)
        {

            try
            {
                uploadMusicService.CopyFileEncryptAndUploadToAzureBlob(blobName, ResourceTypes.Audio);
                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("lyrics")]
        public async Task<IActionResult> PostLyrics(
            [FromForm(Name = "myFile")]IFormFile myFile)
        {

            try
            {
                var (blobFileName, uri) = await uploadMusicService.UploadFileToAzureBlob(myFile, ResourceTypes.Lyrics);
                var key = uploadMusicService.SaveAzureBlobInfoToDatabaseAndReturnKey(blobFileName, uri);
                //return CreatedAtRoute(routeName: "myFile", routeValues: new { fileName = key }, value: null);
                return Ok(new { lyricsLink = uri });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("video")]
        public async Task<IActionResult> PostVideo(
            [FromForm(Name = "myFile")]IFormFile myFile)
        {

            try
            {
                var (blobFileName, uri) = await uploadMusicService.UploadFileToAzureBlob(myFile, ResourceTypes.Video);
                var key = uploadMusicService.SaveAzureBlobInfoToDatabaseAndReturnKey(blobFileName, uri);
                return Ok(new { videoLink = uri });
                //return CreatedAtRoute(routeName: "myFile", routeValues: new { fileName = key }, value: null);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        /// <summary>
        /// Use this API to get the URI of the file on Azure Blob Storage system or the file in download dialogue.
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        [HttpGet("{fileName}", Name = "myFile")]
        public IActionResult Get([FromRoute] string fileName)
        {
            var uri = uploadMusicService.GetFileUri(fileName);
            if (uri == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(uri);
            }
        }


        [HttpPost("EncryptFileMusic")]
        public IActionResult EncryptFileMusic(
           [FromForm(Name = "myFile")]IFormFile myFile)
        {

            try
            {
                var fileName = System.IO.Path.GetFileNameWithoutExtension(myFile.FileName);
                var fileExtension = System.IO.Path.GetExtension(myFile.FileName);

                string SavePath = Path.Combine(Directory.GetCurrentDirectory() + "/bin/file/", fileName+ fileExtension);

                using (var stream = new FileStream(SavePath, FileMode.Create))
                {
                    myFile.CopyTo(stream);
                }
              

                string filePathNew = Directory.GetCurrentDirectory() + "/bin/keys/" + fileName + "1" + fileExtension;

                uploadMusicService.AES_Encrypt(SavePath, filePathNew, "abc1212");

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("DecryptFileMusic")]
        public IActionResult DecryptFileMusic(
           [FromForm(Name = "myFile")]IFormFile myFile)
        {

            try
            {
                var fileName = System.IO.Path.GetFileNameWithoutExtension(myFile.FileName);
                var fileExtension = System.IO.Path.GetExtension(myFile.FileName);

                string filePath = Directory.GetCurrentDirectory() + "/bin/keys/" + fileName + fileExtension;

                string filePathNew = Directory.GetCurrentDirectory() + "/bin/keys/" + fileName + "2" + fileExtension;

                uploadMusicService.AES_Decrypt(filePath, filePathNew, "abc1313");

                return StatusCode(StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        //// GET: api/UploadMusicAsset
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET: api/UploadMusicAsset/5
        //[HttpGet("{id}", Name = "Get")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST: api/UploadMusicAsset
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// PUT: api/UploadMusicAsset/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE: api/ApiWithActions/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
