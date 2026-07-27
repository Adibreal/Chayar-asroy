import { Fragment } from "react";

/**
 * Renders `*emphasised*` spans inside CMS text as the brand's accented italic.
 *
 * The approved homepage design sets one word of the impact headline in italic
 * primary ("Small hands, *steady* work."). That flourish was hardcoded JSX
 * before Phase 5D; moving the headline into the CMS would have flattened it.
 *
 * Asterisks match the Markdown convention already used for story bodies, so
 * editors need no HTML and cannot inject markup — everything outside the
 * asterisks is rendered as plain text.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);

  return (
    <>
      {parts.map((part, index) =>
        // Odd indices are the captured groups, i.e. the emphasised runs.
        index % 2 === 1 ? (
          <em key={index} className="text-primary">
            {part}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
