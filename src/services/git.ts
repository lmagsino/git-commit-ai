import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { NoStagedChangesError, NotAGitRepoError, GitError } from "../utils/errors.js";

const execFileAsync = promisify(execFile);

/**
 * Execute a git command and return stdout
 */
async function git(args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", args);
    return stdout;
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw new GitError(`Git command failed: git ${args.join(" ")}\n${error.message}`);
    }
    throw error;
  }
}

/**
 * Check if current directory is a git repository
 */
export async function isGitRepository(): Promise<boolean> {
  try {
    await git(["rev-parse", "--git-dir"]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure we're in a git repository, throw if not
 */
export async function ensureGitRepository(): Promise<void> {
  const isRepo = await isGitRepository();
  if (!isRepo) {
    throw new NotAGitRepoError();
  }
}

/**
 * Get the diff of staged changes
 */
export async function getStagedDiff(): Promise<string> {
  const diff = await git(["diff", "--cached"]);

  if (!diff.trim()) {
    throw new NoStagedChangesError();
  }

  return diff;
}

/**
 * Get a summary of staged files (for context)
 */
export async function getStagedFiles(): Promise<string[]> {
  const output = await git(["diff", "--cached", "--name-only"]);
  return output.trim().split("\n").filter(Boolean);
}

/**
 * Create a commit with the given message
 */
export async function createCommit(message: string): Promise<string> {
  const result = await git(["commit", "-m", message]);
  return result;
}