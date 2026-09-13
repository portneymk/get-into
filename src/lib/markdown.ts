import type { ReactNode } from "react";
import { createElement, Fragment } from "react";

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }

    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(createElement("strong", { key: key++ }, token.slice(2, -2)));
    } else if (token.startsWith("*")) {
      nodes.push(createElement("em", { key: key++ }, token.slice(1, -1)));
    } else if (token.startsWith("`")) {
      nodes.push(createElement("code", { key: key++ }, token.slice(1, -1)));
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          createElement(
            "a",
            {
              key: key++,
              href: link[2],
              target: "_blank",
              rel: "noreferrer",
            },
            link[1],
          ),
        );
      }
    }

    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function renderMarkdown(markdown: string): ReactNode {
  const blocks = markdown.trim().split(/\n{2,}/);
  return createElement(
    Fragment,
    null,
    blocks.map((block, index) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("> ")) {
        return createElement(
          "blockquote",
          { key: index },
          inline(trimmed.replace(/^>\s?/gm, "")),
        );
      }
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").filter((line) => line.trim().startsWith("- "));
        return createElement(
          "ul",
          { key: index },
          items.map((item, itemIndex) =>
            createElement("li", { key: itemIndex }, inline(item.replace(/^- /, ""))),
          ),
        );
      }
      return createElement("p", { key: index }, inline(trimmed.replace(/\n/g, " ")));
    }),
  );
}
