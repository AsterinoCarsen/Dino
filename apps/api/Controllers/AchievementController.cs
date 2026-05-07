using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class AchievementController : BaseController
{
    private readonly AchievementService _achievementService;

    public AchievementController(AchievementService achievementService)
    {
        _achievementService = achievementService;
    }

    /// <summary>
    /// Returns all achievement definitions available in the system.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _achievementService.GetAllDefinitionsAsync();
        return Ok(result);
    }

    /// <summary>
    /// Returns all achievements earned by the authenticated user.
    /// </summary>
    [HttpGet("earned")]
    public async Task<IActionResult> GetEarned()
    {
        var result = await _achievementService.GetEarnedAsync(GetUserId());
        return Ok(result);
    }
}