import sanitizeHtml from "sanitize-html";

type RawHtmlProps = {
  html?: string;
};

export const RawHtml = ({ html }: RawHtmlProps) => {
  if (!html) return;
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(html, {
          exclusiveFilter: function (frame) {
            return frame.tag === "p" && !frame.text.trim();
          },
        }),
      }}
    />
  );
};
