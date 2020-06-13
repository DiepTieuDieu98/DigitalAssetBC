using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MusicServer.Models.Database;
using MusicServer.Models.Database.Commands;
using MusicServer.Models.Database.Queries;
using MusicServer.Services.Interfaces;

namespace MusicServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly IMusicService musicService;

        public MusicController(IMusicService musicService)
        {
            this.musicService = musicService;
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
                    command.LicenceId,
                    creatureType,
                    ownerTypes);

                return Ok(new { MusicId = result });
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
