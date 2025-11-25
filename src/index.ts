/**
 * git-commit-ai
 * Generate meaningful git commit messages using AI
 */

// Export types
export type {
  CommitStyle,
  Config,
  GenerateOptions,
  GenerateResult,
  CliOptions,
} from "./types/index.js";

// Export errors
export {
  GitCommitAiError,
  GitError,
  NoStagedChangesError,
  NotAGitRepoError,
  AiError,
  ApiKeyError,
  RateLimitError,
  ConfigError,
} from "./utils/errors.js";

// Export services for programmatic use
export { loadConfig } from "./services/config.js";
export { generateCommitMessage } from "./services/ai.js";
export {
  isGitRepository,
  getStagedDiff,
  getStagedFiles,
  createCommit,
} from "./services/git.js";