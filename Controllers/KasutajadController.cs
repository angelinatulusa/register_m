using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using register_m.Data;
using register_m.Models;

namespace register_m.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KasutajadController : Controller
    {
        private readonly ApplicationDbContext _context;

        public KasutajadController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var kasutajadList = await _context.Kasutaja
                    .Select(k => new Kasutajad
                    {
                        Id = k.Id,
                        Aeg = k.Aeg,
                        Nimi = k.Nimi,
                        Isikukood = k.Isikukood,
                        Valik = k.Valik,
                        Roll = k.Roll
                    })
                    .ToListAsync();

                return Ok(kasutajadList);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving data: {ex.Message}");
            }
        }

        [HttpPost("lisa")]
        public async Task<IActionResult> PostKasutaja([FromBody] Kasutajad kasutajad)
        {
            if (kasutajad == null)
            {
                return BadRequest("Invalid request data.");
            }

            if (string.IsNullOrWhiteSpace(kasutajad.Nimi))
            {
                return BadRequest("The Nimi field is required.");
            }

            if (kasutajad.Aeg == default(DateTime))
            {
                return BadRequest("The Aeg field is required and must be a valid date.");
            }
            if (string.IsNullOrWhiteSpace(kasutajad.Roll))
            {
                // Устанавливаем значение по умолчанию, если Roll не был предоставлен
                kasutajad.Roll = "kasutaja";
            }
            try
            {
                await _context.Kasutaja.AddAsync(kasutajad);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error saving changes: {ex.Message}");
            }
        }


        [HttpDelete("kustuta/{id}")]
        public IActionResult Delete(int id)
        {
            var kasutaja = _context.Kasutaja.Find(id);
            if (kasutaja == null)
            {
                return NotFound();
            }

            _context.Kasutaja.Remove(kasutaja);
            _context.SaveChanges();
            return Ok();
        }
        [HttpGet("checkAdmin")]
        [AllowAnonymous] // Этот атрибут разрешает доступ даже без аутентификации
        public IActionResult CheckAdmin([FromQuery] string name, [FromQuery] string code)
        {
            bool isAdmin = IsAdmin(name, code);

            return Ok(new { isAdmin });
        }

        private bool IsAdmin(string name, string code)
        {
            return name == "admin" && code == "111";
        }
    }
}
