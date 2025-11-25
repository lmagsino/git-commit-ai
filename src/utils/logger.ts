import chalk from "chalk";

/**
 * Simple logger with colored output for CLI
 */
export const logger = {
  info: (message: string) => {
    console.log(chalk.blue("ℹ"), message);
  },

  success: (message: string) => {
    console.log(chalk.green("✔"), message);
  },

  warn: (message: string) => {
    console.log(chalk.yellow("⚠"), message);
  },

  error: (message: string) => {
    console.error(chalk.red("✖"), message);
  },

  step: (message: string) => {
    console.log(chalk.cyan("→"), message);
  },

  debug: (message: string) => {
    if (process.env["DEBUG"]) {
      console.log(chalk.gray("🔍"), chalk.gray(message));
    }
  },

  commitMessage: (message: string) => {
    console.log();
    console.log(chalk.bold("Generated commit message:"));
    console.log(chalk.dim("─".repeat(50)));
    console.log(chalk.white(message));
    console.log(chalk.dim("─".repeat(50)));
    console.log();
  },
};