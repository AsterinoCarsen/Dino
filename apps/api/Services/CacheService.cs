using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using api.Models.Grades;

namespace api.Services;

/// <summary>
/// Wraps IDistributedCache with typed get/set/delete helpers.
/// </summary>
public class CacheService
{
    private readonly IDistributedCache _cache;

    public CacheService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var cached = await _cache.GetStringAsync(key);
        if (cached == null) return default;
        return JsonSerializer.Deserialize<T>(cached);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiry ?? TimeSpan.FromHours(1)
        };
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(value), options);
    }

    public async Task DeleteAsync(string key)
    {
        await _cache.RemoveAsync(key);
    }

    /// <summary>
    /// Invalidates all insight cache keys for a user.
    /// Call after any ascent or session write that affects insight calculations.
    /// </summary>
    public async Task InvalidateInsightsAsync(Guid userId)
    {
        await DeleteAsync($"insights:{userId}:grade-pyramid:all");
        await DeleteAsync($"insights:{userId}:grade-pyramid:all:summary");
        await DeleteAsync($"insights:{userId}:attempt-ratio:all");
        await DeleteAsync($"insights:{userId}:attempt-ratio:all:summary");
        await DeleteAsync($"insights:{userId}:volume:month");
        await DeleteAsync($"insights:{userId}:volume:month:summary");
        await DeleteAsync($"insights:{userId}:volume:session");
        await DeleteAsync($"insights:{userId}:volume:session:summary");
        await DeleteAsync($"insights:{userId}:summary");
        await DeleteAsync($"insights:{userId}:summary:ai");

        foreach (var system in Enum.GetValues<GradeSystem>())
        {
            await DeleteAsync($"insights:{userId}:grade-pyramid:{system}");
            await DeleteAsync($"insights:{userId}:grade-pyramid:{system}:summary");
            await DeleteAsync($"insights:{userId}:attempt-ratio:{system}");
            await DeleteAsync($"insights:{userId}:attempt-ratio:{system}:summary");
        }
    }
}