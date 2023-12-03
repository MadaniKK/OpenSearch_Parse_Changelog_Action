import { CHANGELOG_SECTION_REGEX } from "../config/constants.js";
import { InvalidChangelogHeadingError, EmptyChangelogSectionError } from "./customErrors.js";

// **************************************************************
// I) INTERNAL FUNCTIONS
// **************************************************************
/**
 * Processes a line of text to determine if it's a valid changelog entry.
 * Handles comment blocks and trims lines that are part of the changelog.
 * @param {string} line - A line of text.
 * @param {Object} state - An object maintaining the state of comment parsing.
 * @return {Object} An object containing the updated state and the processed line.
 */
const processLine = (line, state) => {
  // Check for the start of a comment block
  if (line.includes("<!--"))
    return {
      state: { ...state, inComment: true },
      line: null,
    };

  // Check for the end of a comment block
  if (line.includes("-->"))
    return {
      state: { ...state, inComment: false },
      line: null,
    };
  
  const trimmedLine = line.trim();
  // If the line is not in a comment, contains text, and does not begin with "#" (which would indicate a section heading), consider it as part of the changelog
  if (!state.inComment && trimmedLine.length > 0 && !trimmedLine.startsWith("#")) return { state, line: trimmedLine };

  // For lines within comments or empty lines, return null
  return { state, line: null };
};

// **************************************************************
// II) EXPORTED FUNCTIONS
// **************************************************************
/**
 * Extracts changelog entries from a PR description.
 * @param {string} prDescription - The PR description text in markdown format.
 * @return {string[]} An array of changelog entry strings.
 */
export const extractChangelogEntries = (prDescription) => {
  // Match the changelog section using the defined regex
  const changelogSection = prDescription.match(CHANGELOG_SECTION_REGEX);
  // Output -> Array of length 2:
  // changelogSection[0]: Full regex match including '## Changelog' and following content.
  // changelogSection[1]: Captured content after '## Changelog', excluding the heading itself.
  // Throw error if '## Changelog' header is missing or malformed
  if (!changelogSection) {
    throw new InvalidChangelogHeadingError();
  }

  // Initial accumulator for reduce: empty array for lines and initial state
  const initialAcc = { entries: [], state: { inComment: false } };

  // Process each line and filter out valid changelog entries
  const changelogEntries = changelogSection[0]
    .split("\n")
    .reduce((acc, line) => {
      const { entries, state } = acc;
      const processed = processLine(line, state);
      if (processed.line) entries.push(processed.line.trim());
      return { entries, state: processed.state };
    }, initialAcc).entries;

  if (changelogEntries.length === 0) {
    throw new EmptyChangelogSectionError();
  }

  return changelogEntries;
};