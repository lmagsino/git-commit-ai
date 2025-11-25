/**
 * Commit message styles supported by the tool
 */
export type CommitStyle = "conventional" | "simple" | "detailed";

/**
 * Configuration options
 */
export interface Config {
  apiKey: string;
  model: string;
  defaultStyle: CommitStyle;
}

/**
 * Options passed to the commit message generator
 */
export interface GenerateOptions {
  diff: string;
  style: CommitStyle;
  context?: string;
}

/**
 * Result from AI commit message generation
 */
export interface GenerateResult {
  message: string;
  subject: string;
  body?: string;
}

/**
 * CLI command options
 */
export interface CliOptions {
  style: CommitStyle;
  dryRun: boolean;
  context?: string;
  yes: boolean;
}