import inquirer from "inquirer";

export type UserAction = "confirm" | "regenerate" | "edit" | "cancel";

/**
 * Ask user to confirm, regenerate, edit, or cancel the commit
 */
export async function promptForAction(): Promise<UserAction> {
  const { action } = await inquirer.prompt<{ action: UserAction }>([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "✔ Commit with this message", value: "confirm" },
        { name: "🔄 Regenerate message", value: "regenerate" },
        { name: "✏️  Edit message manually", value: "edit" },
        { name: "✖ Cancel", value: "cancel" },
      ],
    },
  ]);

  return action;
}

/**
 * Allow user to edit the commit message
 */
export async function promptForEdit(currentMessage: string): Promise<string> {
  const { message } = await inquirer.prompt<{ message: string }>([
    {
      type: "editor",
      name: "message",
      message: "Edit your commit message:",
      default: currentMessage,
    },
  ]);

  return message.trim();
}

/**
 * Simple yes/no confirmation
 */
export async function promptForConfirmation(message: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
    {
      type: "confirm",
      name: "confirmed",
      message,
      default: true,
    },
  ]);

  return confirmed;
}