import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatParsedText(input: string): string {
  // Replace sequences of special characters with appropriate spacing
  let formatted = input
    .replace(/\s*[+/,]+\s*/g, " ") // Replace common symbols with a space, excluding 'n'
    .replace(/\s+/g, " ") // Collapse multiple spaces into one
    .replace(/\s*\n+\s*/g, "\n") // Normalize newlines
    .replace(/-\s*/g, "") // Remove dangling hyphens at the end of lines
    .trim(); // Remove leading/trailing whitespace

  // Further format for structure
  formatted = formatted
    .replace(/(\w)\s*\n\s*(\w)/g, "$1 $2") // Fix split words across lines
    .replace(/\n\s*\n+/g, "\n\n") // Normalize paragraph breaks
    .replace(/\n/g, "\n "); // Add space after newlines for better readability

  return formatted;
}
