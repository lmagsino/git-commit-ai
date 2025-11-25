import { config as loadEnv } from "dotenv";
import type { Config, CommitStyle } from "../types/index.js";
import { ApiKeyError, ConfigError } from "../utils/errors.js";

// Load .env file if present
loadEnv();

const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_STYLE: CommitStyle = "conventional";

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): Config {
  const apiKey = process.env["ANTHROPIC_API_KEY"];

  if (!apiKey) {
    throw new ApiKeyError();
  }

  const model = process.env["ANTHROPIC_MODEL"] ?? DEFAULT_MODEL;
  const styleEnv = process.env["COMMIT_STYLE"];

  let defaultStyle: CommitStyle = DEFAULT_STYLE;
  if (styleEnv) {
    if (!isValidStyle(styleEnv)) {
      throw new ConfigError(
        `Invalid COMMIT_STYLE: "${styleEnv}". Must be one of: conventional, simple, detailed`
      );
    }
    defaultStyle = styleEnv;
  }

  return {
    apiKey,
    model,
    defaultStyle,
  };
}

/**
 * Type guard to check if a string is a valid CommitStyle
 */
function isValidStyle(style: string): style is CommitStyle {
  return ["conventional", "simple", "detailed"].includes(style);
}