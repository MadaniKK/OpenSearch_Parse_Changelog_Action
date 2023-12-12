import {
  PullRequestDataExtractionError,
  GetGithubContentError,
  CreateChangesetFileError,
  UpdateChangesetFileError,
  UpdatePRLabelError,
  InvalidChangelogHeadingError,
  EntryTooLongError,
  InvalidPrefixError,
  CategoryWithSkipOptionError,
  ChangelogEntryMissingHyphenError,
  EmptyEntryDescriptionError,
  EmptyChangelogSectionError,
} from "../utils/customErrors.js";

import { MAX_ENTRY_LENGTH } from "../config/constants.js";

describe("Custom Errors Tests", () => {
  test("PullRequestDataExtractionError default message", () => {
    const error = new PullRequestDataExtractionError();
    expect(error.message).toBe("Error extracting data from Pull Request");
    expect(error.name).toBe("PullRequestDataExtractionError");
    expect(error.shouldResultInPRComment).toBe(false);
  });

  test("GetGithubContentError default message", () => {
    const error = new GetGithubContentError();
    expect(error.message).toBe("Error retrieving content from GitHub repository");
    expect(error.name).toBe("GetGithubContentError");
    expect(error.shouldResultInPRComment).toBe(false);
  });

  test("CreateChangesetFileError default message", () => {
    const error = new CreateChangesetFileError();
    expect(error.message).toBe("Error creating changeset file");
    expect(error.name).toBe("CreateChangesetFileError");
    expect(error.shouldResultInPRComment).toBe(false);
  });

  test("UpdateChangesetFileError default message", () => {
    const error = new UpdateChangesetFileError();
    expect(error.message).toBe("Error updating changeset file");
    expect(error.name).toBe("UpdateChangesetFileError");
    expect(error.shouldResultInPRComment).toBe(false);
  });

  test("UpdatePRLabelError default message", () => {
    const error = new UpdatePRLabelError();
    expect(error.message).toBe(
      "There was an error updating the label of the pull request. Please ensure the PR is accessible and the label format is correct."
    );
    expect(error.name).toBe("UpdatePRLabelError");
    expect(error.shouldResultInPRComment).toBe(false);
  });

  test("InvalidChangelogHeadingError default message", () => {
    const error = new InvalidChangelogHeadingError();
    expect(error.message).toBe(
      "The '## Changelog' heading in your PR description is either missing or malformed. Please make sure that your PR description includes a '## Changelog' heading with with proper spelling, capitalization, spacing, and Markdown syntax."
    );
    expect(error.name).toBe("InvalidChangelogHeadingError");
    expect(error.shouldResultInPRComment).toBe(true);
  });

  test("EmptyChangelogSectionError default message", () => {
    const error = new EmptyChangelogSectionError();
    expect(error.message).toBe(
      "The Changelog section in your PR description is empty. Please add a valid changelog entry or entries. If you did add a changelog entry, check to make sure that it was not accidentally included inside the comment block in the Changelog section."
    );
    expect(error.name).toBe("EmptyChangelogSectionError");
    expect(error.shouldResultInPRComment).toBe(true);
  });

  test("EntryTooLongError default message", () => {
    const entryLength = MAX_ENTRY_LENGTH + 1;
    const characterOverage = entryLength - MAX_ENTRY_LENGTH;
    const error = new EntryTooLongError(entryLength);
    expect(error.message).toBe(
      `Entry is ${entryLength} characters long, which is ${characterOverage} ${
        characterOverage === 1 ? "character" : "characters"
      } longer than the maximum allowed length of ${MAX_ENTRY_LENGTH} characters. Please revise your entry to be within the maximum length.`
    );
    expect(error.name).toBe("EntryTooLongError");
    expect(error.shouldResultInPRComment).toBe(true);
  });

  test("InvalidPrefixError with foundPrefix", () => {
    const foundPrefix = "invalid";
    const error = new InvalidPrefixError(foundPrefix);
    expect(error.message).toBe(
      `Invalid description prefix. Found "${foundPrefix}". Expected "breaking", "deprecate", "feat", "fix", "infra", "doc", "chore", "refactor", "security", "skip", or "test".`
    );
    expect(error.name).toBe("InvalidPrefixError");
    expect(error.shouldResultInPRComment).toBe(true);
  });

  test("CategoryWithSkipOptionError default message", () => {
    const error = new CategoryWithSkipOptionError();
    expect(error.message).toBe(
      "If your Changelog section includes the 'skip' option, it cannot also contain other changelog entries. Please revise your Changelog section."
    );
    expect(error.name).toBe("CategoryWithSkipOptionError");
    expect(error.shouldResultInPRComment).toBe(true);
  });

  test("ChangelogEntryMissingHyphenError default message", () => {
    const error = new ChangelogEntryMissingHyphenError();
    expect(error.message).toBe(
      "Changelog entries must begin with a hyphen (-)."
    );
    expect(error.name).toBe("ChangelogEntryMissingHyphenError");
    expect(error.shouldResultInPRComment).toBe(true);
  });

  test("EmptyEntryDescriptionError with foundPrefix", () => {
    const foundPrefix = "test";
    const error = new EmptyEntryDescriptionError(foundPrefix);
    expect(error.message).toBe(
      `Description for "${foundPrefix}" entry cannot be empty.`
    );
    expect(error.name).toBe("EmptyEntryDescriptionError");
    expect(error.shouldResultInPRComment).toBe(true);
  });
});
