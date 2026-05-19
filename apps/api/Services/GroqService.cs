using GroqSharp.Models;
using GroqSharp;

namespace api.Services;

/// <summary>
/// Wraps the GroqSharp client to generate AI summaries for climbing insights.
/// Returns an empty string on failure so insights endpoints never break if Groq is unavailable.
/// </summary>
public class GroqService
{
    private readonly IGroqClient _client;
    private readonly ILogger<GroqService> _logger;

    public GroqService(IConfiguration configuration, ILogger<GroqService> logger)
    {
        _logger = logger;

        var apiKey = configuration["Groq:ApiKey"] ?? throw new InvalidOperationException("Groq:ApiKey is not configured.");
        var model = configuration["Groq:Model"] ?? "llama-3.1-8b-instant";

        _client = new GroqClient(apiKey, model)
            .SetTemperature(0.5)
            .SetMaxTokens(200)
            .SetTopP(1)
            .SetStructuredRetryPolicy(3);
    }

    /// <summary>
    /// Generates a short AI summary for a climbing insight prompt.
    /// </summary>
    /// <param name="prompt">The insight data prompt to summarize.</param>
    /// <returns>The generated summary, or an empty string if generation fails.</returns>
    public async Task<string> GenerateSummaryAsync(string prompt)
    {
        try
        {
            var response = await _client.CreateChatCompletionAsync(
                new Message { Role = MessageRoleType.System, Content = "You are a climbing coach giving one-time snapshot insights to a climber. Write 1-2 sentences directly to the climber using you/your. Observations only — no suggestions for future sessions, no implied follow-up. Be specific with grade names and encouraging. No preamble." },
                new Message { Role = MessageRoleType.User, Content = prompt }
            );

            return response ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Groq summary generation failed.");
            return string.Empty;
        }
    }
}