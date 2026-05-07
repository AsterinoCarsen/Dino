using api.DTOs;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class AscentController : BaseController
{
    private readonly AscentService _ascentService;

    public AscentController(AscentService ascentService)
    {
        _ascentService = ascentService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AscentRequestDto dto)
    {
        var result = await _ascentService.CreateAsync(dto, GetUserId());
        if (result == null) return BadRequest("Invalid grade system, style, grade, or session.");
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _ascentService.DeleteAsync(id, GetUserId());
        if (!success) return NotFound();
        return NoContent();
    }
}