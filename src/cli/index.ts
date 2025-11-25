#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import type { CliOptions, CommitStyle } from "../types/index.js";
import { GitCommitAiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import {
  ensureGitRepository,
  getStagedDiff,
  getStagedFiles,
} from "../services/git.js";
import { generateCommitMessage } from "../services/ai.js";

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

  // Step 1: Check if in git repo
  logger.step("Checking git repository...");
  await ensureGitRepository();

  // Step 2: Get staged changes
  logger.step("Reading staged changes...");
  const diff = await getStagedDiff();
  const files = await getStagedFiles();

  logger.info(`Found ${chalk.cyan(files.length)} staged file(s):`);
  files.forEach((file) => {
    console.log(chalk.gray(`   ${file}`));
  });

  // Step 3: Generate commit message
  logger.step(`Generating commit message (${chalk.cyan(options.style)} style)...`);
  const result = await generateCommitMessage({
    diff,
    style: options.style,
    context: options.context,
  });

  // Step 4: Display the result
  logger.commitMessage(result.message);

  if (options.dryRun) {
    logger.warn("Dry run mode - commit was not created");
    return;
  }

  // TODO: Next steps
  // 5. Confirm with user (unless --yes)
  // 6. Create commit

  logger.success("AI integration working! Interactive confirmation coming next.");
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