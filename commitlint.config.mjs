/**
 * Conventional Commits enforced via commitlint (see .husky/commit-msg).
 * Format: <type>(optional scope): <subject>
 * Examples:
 *   feat(gallery): add lightbox navigation
 *   fix(forms): validate volunteer email server-side
 *   chore(deps): bump next to 16.2
 */
const config = {
  extends: ["@commitlint/config-conventional"],
};

export default config;
