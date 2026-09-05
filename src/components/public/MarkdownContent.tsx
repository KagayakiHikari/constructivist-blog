"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { safeMarkdownUrl } from "@/lib/markdown";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={safeMarkdownUrl}
        components={{
          a({ href, children }) {
            const safeHref = safeMarkdownUrl(href);
            if (!safeHref) return <span>{children}</span>;
            return (
              <a href={safeHref} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          img({ src, alt }) {
            const safeSrc = safeMarkdownUrl(src ?? undefined);
            if (!safeSrc) return null;
            return <img src={safeSrc} alt={alt ?? ""} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
