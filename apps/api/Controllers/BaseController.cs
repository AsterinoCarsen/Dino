using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

public class BaseController : ControllerBase
{
    protected Guid GetUserId()
    {
        return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}