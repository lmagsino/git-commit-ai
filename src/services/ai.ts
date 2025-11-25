import Anthropic from "@anthropic-ai/sdk";
import type { GenerateOptions, GenerateResult } from "../types/index.js";
import { loadConfig } from "./config.js";
import { AiError, RateLimitError } from "../utils/errors.js";
import {
  getSystemPrompt,
  buildUserPrompt,
  truncateDiff,
} from "../prompts/templates.js";

/**
 * Generate a commit message using Claude API
 */
export async function generateCommitMessage(
  options: GenerateOptions
): Promise<GenerateResult> {
  const config = loadConfig();

  const client = new Anthropic({
    apiKey: config.apiKey,
  });

  // Truncate diff if too long (saves tokens, improves focus)
  const diff = truncateDiff(options.diff);

  // Build prompts using templates
  const systemPrompt = getSystemPrompt(options.style);
  const userPrompt = buildUserPrompt(diff, options.context);

  try {
    const response = await client.messages.create({
      model: config.model,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    // Extract text from response
    const content = response.content[0];
    if (content?.type !== "text") {
      throw new AiError("Unexpected response type from Claude API");
    }

    const message = content.text.trim();
    const [subject, ...bodyLines] = message.split("\n");

    return {
      message,
      subject: subject ?? "",
      body: bodyLines.length > 0 ? bodyLines.join("\n").trim() : undefined,
    };
  } catch (error) {
    // Handle specific API errors
    if (error instanceof Anthropic.RateLimitError) {
      throw new RateLimitError();
    }

    if (error instanceof Anthropic.APIError) {
      throw new AiError(
        `Claude API error: ${error.message}`,
        error.status
      );
    }

    throw error;
  }
}