using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

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
}