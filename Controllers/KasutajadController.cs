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

            // 1. Проверка наличия поля Nimi
            if (string.IsNullOrWhiteSpace(kasutajad.Nimi))
            {
                return BadRequest("The Nimi field is required.");
            }

            try
            {
                // 2. Решение проблемы с конвертацией JSON значения в Aeg
                //    Удостоверьтесь, что формат даты соответствует ожидаемому формату в модели Kasutajad
                //    Пример: "Aeg": "2023-12-01T12:34:56"
                //    Вам может потребоваться использовать другие инструменты или атрибуты для управления форматом даты

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
    }

}
