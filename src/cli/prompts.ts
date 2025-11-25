import inquirer from "inquirer";

export type UserAction = "confirm" | "regenerate" | "edit" | "cancel";

/**
 * Ask user to confirm, regenerate, edit, or cancel the commit
 */
export async function promptForAction(): Promise<UserAction> {
  console.log("\nOptions:");
  console.log("  1) Commit with this message");
  console.log("  2) Regenerate message");
  console.log("  3) Edit message manually");
  console.log("  4) Cancel\n");

  const { choice } = await inquirer.prompt<{ choice: string }>([
    {
      type: "input",
      name: "choice",
      message: "Enter choice (1-4):",
    },
  ]);

  switch (choice.trim()) {
    case "1":
      return "confirm";
    case "2":
      return "regenerate";
    case "3":
      return "edit";
    case "4":
      return "cancel";
    default:
      console.log("Invalid choice, please try again.");
      return promptForAction();
  }
}

/**
 * Allow user to edit the commit message
 */
export async function promptForEdit(currentMessage: string): Promise<string> {
  console.log("\nCurrent message:");
  console.log(currentMessage);
  console.log("");

  const { message } = await inquirer.prompt<{ message: string }>([
    {
      type: "input",
      name: "message",
      message: "Enter new commit message (or press Enter to keep current):",
    },
  ]);

  return message.trim() || currentMessage;
}

/**
 * Simple yes/no confirmation
 */
export async function promptForConfirmation(message: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt<{ confirmed: string }>([
    {
      type: "input",
      name: "confirmed",
      message: `${message} (y/n):`,
    },
  ]);

  return confirmed.toLowerCase() === "y" || confirmed.toLowerCase() === "yes";
}