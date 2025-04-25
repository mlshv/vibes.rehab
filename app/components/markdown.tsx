import { marked } from "marked";
import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Partial<Components> = {
  code: ({ node, children, ...props }) => {
    if (
      node?.children?.length === 1 &&
      node.children[0].type === "text" &&
      node.children[0].value === ""
    )
      return null;

    if (node?.position?.start.line !== node?.position?.end.line) {
      return (
        <pre
          {...(props as React.HTMLAttributes<HTMLPreElement>)}
          className="text-sm w-full overflow-x-auto p-4"
        >
          <code className="whitespace-pre-wrap break-words">{children}</code>
        </pre>
      );
    }

    return (
      <code
        className=""
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="flex flex-col gap-3 list-decimal list-outside" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="ml-4" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="flex flex-col gap-3 list-decimal list-outside" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  p: ({ node, children, ...props }) => {
    return (
      <div className="whitespace-pre-wrap mt-4 my-3" {...props}>
        {children}
      </div>
    );
  },
};

const remarkPlugins = [remarkGfm];

const MarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);
MarkdownBlock.displayName = "MarkdownBlock";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

function NonMemoizedMarkdown({ content }: { content: string }) {
  const blocks = parseMarkdownIntoBlocks(content);

  return blocks.map((block, i) => <MarkdownBlock key={i} content={block} />);
}

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.content === nextProps.content
);
