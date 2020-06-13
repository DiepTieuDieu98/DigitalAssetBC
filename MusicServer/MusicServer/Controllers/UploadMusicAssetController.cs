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
                return CreatedAtRoute(routeName: "myFile", routeValues: new { fileName = key }, value: null);
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
                return CreatedAtRoute(routeName: "myFile", routeValues: new { fileName = key }, value: null);
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
                return CreatedAtRoute(routeName: "myFile", routeValues: new { fileName = key }, value: null);
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
                return CreatedAtRoute(routeName: "myFile", routeValues: new { fileName = key }, value: null);
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
