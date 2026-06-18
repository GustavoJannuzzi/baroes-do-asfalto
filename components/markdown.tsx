import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";

/** Renderiza o markdown do livro com o tema Barões (prose-barao). */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-barao">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
