using Microsoft.AspNetCore.Mvc;

using api.DTOs;
using api.Services;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class SessionController : BaseController
{
    private readonly SessionService _sessionService;

    public SessionController(SessionService sessionService)
    {
        _sessionService = sessionService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SessionRequestDto dto)
    {
        var userId = GetUserId();
        var result = await _sessionService.CreateAsync(dto, userId);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllByUser()
    {
        var userId = GetUserId();
        var result = await _sessionService.GetUserSessionsAsync(userId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSession(int id)
    {
        var userId = GetUserId();
        var result = await _sessionService.GetSessionById(userId, id);
        if (result == null) return NotFound();
        return Ok(result);
    }
}