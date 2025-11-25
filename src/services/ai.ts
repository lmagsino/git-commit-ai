import Anthropic from "@anthropic-ai/sdk";
import type { GenerateOptions, GenerateResult } from "../types/index.js";
import { loadConfig } from "./config.js";
import { AiError, RateLimitError } from "../utils/errors.js";

/**
 * Generate a commit message using Claude API
 */
export async function generateCommitMessage(
  options: GenerateOptions
): Promise<GenerateResult> {
  const config = loadConfig();

  // Initialize the Anthropic client
  const client = new Anthropic({
    apiKey: config.apiKey,
  });

  // Build the prompt
  const systemPrompt = getSystemPrompt(options.style);
  const userPrompt = buildUserPrompt(options.diff, options.context);

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
    if (content.type !== "text") {
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

/**
 * Get the system prompt based on commit style
 * (We'll expand this in Step 4)
 */
function getSystemPrompt(style: string): string {
  const basePrompt = `You are a helpful assistant that generates git commit messages.
Analyze the provided git diff and generate a clear, concise commit message.
Output ONLY the commit message, nothing else.`;

  switch (style) {
    case "conventional":
      return `${basePrompt}

Use the Conventional Commits format:
<type>(<optional scope>): <description>

[optional body]

Types: feat, fix, docs, style, refactor, test, chore
Keep the subject line under 72 characters.`;

    case "simple":
      return `${basePrompt}

Write a simple, one-line commit message.
Start with a capital letter, no period at the end.
Keep it under 50 characters if possible.`;

    case "detailed":
      return `${basePrompt}

Write a detailed commit message with:
- A clear subject line (under 72 characters)
- A blank line
- A body explaining what changed and why`;

    default:
      return basePrompt;
  }
}

/**
 * Build the user prompt with diff and optional context
 */
function buildUserPrompt(diff: string, context?: string): string {
  let prompt = `Generate a commit message for the following changes:\n\n${diff}`;

  if (context) {
    prompt += `\n\nAdditional context: ${context}`;
  }

  return prompt;
}