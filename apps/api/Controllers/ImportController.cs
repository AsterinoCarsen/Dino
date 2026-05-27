using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace api.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class ImportController : BaseController
{
    private readonly ImportService _importService;

    public ImportController(ImportService importService)
    {
        _importService = importService;
    }

    [HttpPost("kaya")]
    [EnableRateLimiting("import")]
    public async Task<IActionResult> ImportKaya(IFormFile file, [FromQuery] bool overwrite = false)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided.");

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            return BadRequest("File must be a .csv.");

        using var stream = file.OpenReadStream();
        var result = await _importService.ImportKayaAsync(stream, GetUserId(), overwrite);
        return Ok(result);
    }
}