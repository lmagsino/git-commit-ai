#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import type { CliOptions, CommitStyle } from "../types/index.js";
import { GitCommitAiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

const VERSION = "0.1.0";

const program = new Command()
  .name("git-commit-ai")
  .description("Generate meaningful git commit messages using AI")
  .version(VERSION)
  .option(
    "-s, --style <style>",
    "Commit message style (conventional, simple, detailed)",
    "conventional"
  )
  .option(
    "-d, --dry-run",
    "Preview the commit message without committing",
    false
  )
  .option(
    "-c, --context <context>",
    "Additional context about the changes"
  )
  .option(
    "-y, --yes",
    "Skip confirmation prompt and commit directly",
    false
  )
  .action(async (options: CliOptions) => {
    try {
      await run(options);
    } catch (error) {
      handleError(error);
      process.exit(1);
    }
  });

/**
 * Main run function
 */
async function run(options: CliOptions): Promise<void> {
  const validStyles: CommitStyle[] = ["conventional", "simple", "detailed"];
  if (!validStyles.includes(options.style)) {
    throw new GitCommitAiError(
      `Invalid style "${options.style}". Must be one of: ${validStyles.join(", ")}`
    );
  }

  logger.info(`Using ${chalk.cyan(options.style)} commit style`);

  if (options.dryRun) {
    logger.warn("Dry run mode - will not create commit");
  }

  // TODO: Implement in upcoming steps
  // 1. Check if in git repo
  // 2. Get staged diff
  // 3. Generate commit message
  // 4. Show message and confirm
  // 5. Create commit (unless dry-run)

  logger.success("CLI is set up! Implementation coming in next steps.");
}

/**
 * Handle errors with user-friendly messages
 */
function handleError(error: unknown): void {
  if (error instanceof GitCommitAiError) {
    logger.error(error.message);
  } else if (error instanceof Error) {
    logger.error(`Unexpected error: ${error.message}`);
    if (process.env["DEBUG"]) {
      console.error(error.stack);
    }
  } else {
    logger.error("An unexpected error occurred");
  }
}

program.parse();