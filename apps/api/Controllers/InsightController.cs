using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class InsightController : BaseController
{
    private readonly InsightService _insightsService;

    public InsightController(InsightService insightsService)
    {
        _insightsService = insightsService;
    }

    [HttpGet("grade-pyramid")]
    public async Task<IActionResult> GetGradePyramid([FromQuery] string? gradeSystem = null)
    {
        try
        {
            var result = await _insightsService.GetGradePyramidAsync(GetUserId(), gradeSystem);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("attempt-ratio")]
    public async Task<IActionResult> GetAttemptRatio([FromQuery] string? gradeSystem = null)
    {
        try
        {
            var result = await _insightsService.GetAttemptRatioAsync(GetUserId(), gradeSystem);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("volume")]
    public async Task<IActionResult> GetVolume([FromQuery] string groupBy = "month")
    {
        if (groupBy != "month" && groupBy != "session")
            return BadRequest("groupBy must be 'month' or 'session'.");

        var result = await _insightsService.GetVolumeAsync(GetUserId(), groupBy);
        return Ok(result);
    }
}