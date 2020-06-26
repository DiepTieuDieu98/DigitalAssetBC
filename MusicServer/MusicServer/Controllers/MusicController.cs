using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusicServer.Models.Database;
using MusicServer.Models.Database.Commands;
using MusicServer.Models.Database.Queries;
using MusicServer.Services.Interfaces;
using Org.BouncyCastle.Crypto;

namespace MusicServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly IMusicService musicService;
        private readonly IPKIEncordeService pkiEncordeService;

        public MusicController(IMusicService musicService,
            IPKIEncordeService pkiEncordeService)
        {
            this.musicService = musicService;
            this.pkiEncordeService = pkiEncordeService;
        }

        // GET: api/Music
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}


        [HttpGet]
        public List<MusicQueryData> GetMusics()
        {
            var musics = musicService.GetAllMusics();
            return musics;
        }

        // GET: api/Music/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        //// POST: api/Music
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        [HttpPost]
        public async Task<IActionResult> CreateMusicAsync([FromBody] CreateMusicCommand command)
        {
            try
            {
                if (String.IsNullOrEmpty(command.Name))
                {
                    command.Name = String.Empty;
                }

                if (command.Title == null)
                {
                    command.Title = String.Empty;
                }
                if (command.Album == null)
                {
                    command.Album = String.Empty;
                }
                if (command.PublishingYear == null)
                {
                    command.PublishingYear = String.Empty;
                }

                Enum.TryParse<CreatureTypes>(command.CreatureType, true, out CreatureTypes creatureType);
                Enum.TryParse<OwnerTypes>(command.OwnerType, true, out OwnerTypes ownerTypes);

                var result = await musicService.Create(
                    command.Name,
                    command.Title,
                    command.Album,
                    command.PublishingYear,
                    command.OwnerId,
                    command.LicenceLink,
                    command.MusicLink,
                    creatureType,
                    ownerTypes);

                return Ok(new { MusicId = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("SignDataKey1")]
        public IActionResult SignDataKey1([FromBody] CreateDataKey1Command command)
        {
            try
            {
                SHA256Managed sha256 = new SHA256Managed();
                BigInteger p = pkiEncordeService.RandomInteger(10); //generate a random Big Integer number
                BigInteger key1 = BigInteger.Pow(p, command.Key1X);
                string data = key1.ToString();
                byte[] dataBytes = Encoding.UTF8.GetBytes(data);
                byte[] hashedMessage = sha256.ComputeHash(dataBytes);

                command.KeyType = 1;

                var keyPair = pkiEncordeService.GetKeyPair(command.KeyType, command.UserID);

                var signature = pkiEncordeService.SignData(hashedMessage, keyPair.Private);

                return Ok(new { hashMess = hashedMessage, Sign = signature, pValue = p, Key1 = key1 });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("SignDataShareFullKey")]
        public IActionResult SignDataShareFullKey([FromBody] CreateDataShareFullKeyCommand command)
        {
            try
            {
                SHA256Managed sha256 = new SHA256Managed();
                string data = command.FullKey.ToString();
                byte[] dataBytes = Encoding.UTF8.GetBytes(data);
                byte[] hashedMessage = sha256.ComputeHash(dataBytes);

                command.KeyType = 1;

                var keyPair = pkiEncordeService.GetKeyPair(command.KeyType, command.UserID);

                var signature = pkiEncordeService.SignData(hashedMessage, keyPair.Private);

                return Ok(new { hashMess = hashedMessage, Sign = signature, FullKey = data });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("SignDataKey2Server")]
        public IActionResult SignDataKey2Server([FromBody] CreateDataKey2Command command)
        {
            try
            {
                SHA256Managed sha256 = new SHA256Managed();
                BigInteger key2 = BigInteger.Pow(command.pValue, command.Key2X);
                BigInteger fullKey = command.FullKey1X * key2;
                string data = key2.ToString();
                byte[] dataBytes = Encoding.UTF8.GetBytes(data);
                byte[] hashedMessage = sha256.ComputeHash(dataBytes);

                command.KeyType = 0;

                var keyPair = pkiEncordeService.GetKeyPair(command.KeyType, 0);

                var signature = pkiEncordeService.SignData(hashedMessage, keyPair.Private);

                return Ok(new { hashMess = hashedMessage, Sign = signature, FullKey = fullKey });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPost("VerifySignature")]
        public  IActionResult VerifySignature([FromBody] CreateDataCheckSignCommand command)
        {
            try
            {
                AsymmetricCipherKeyPair keyPair = null;
                if (command.KeyType == 0)
                {

                    keyPair = pkiEncordeService.GetKeyPair(command.KeyType, 0);
                }
                else
                {
                    keyPair = pkiEncordeService.GetKeyPair(command.KeyType, command.UserID);
                }
                

                var valid = pkiEncordeService.VerifySignature(command.hashedMessage, command.signature, keyPair.Public);

                return Ok(new { checkSign = valid });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        // PUT: api/Music/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        
    }
}
