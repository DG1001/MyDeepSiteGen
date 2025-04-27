import { useState, useEffect } from 'react';

export const useAutoComplete = (html: string): string => {
  const [completedHtml, setCompletedHtml] = useState<string>('');

  useEffect(() => {
    if (!html) {
      setCompletedHtml('');
      return;
    }

    // Check if the HTML is already complete (has html, head, and body tags)
    const hasHtmlTag = html.includes('<html') && html.includes('</html>');
    const hasHeadTag = html.includes('<head') && html.includes('</head>');
    const hasBodyTag = html.includes('<body') && html.includes('</body>');
    
    if (hasHtmlTag && hasHeadTag && hasBodyTag) {
      setCompletedHtml(html);
      return;
    }

    // Auto-complete the HTML structure based on what's missing
    let resultHtml = html;
    
    // If it doesn't have an HTML structure at all, wrap it
    if (!hasHtmlTag) {
      if (!hasHeadTag) {
        resultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
</head>
<body>
  ${resultHtml}
</body>
</html>`;
      } else if (!hasBodyTag) {
        // Has head but no body
        resultHtml = `<!DOCTYPE html>
<html lang="en">
${resultHtml}
<body>
</body>
</html>`;
      }
    } else if (hasHtmlTag && !hasBodyClosingTag(resultHtml)) {
      // Has HTML tag but body isn't closed properly
      resultHtml = `${resultHtml}
</body>
</html>`;
    }
    
    setCompletedHtml(resultHtml);
  }, [html]);

  return completedHtml;
};

// Helper function to check if the body tag is properly closed
const hasBodyClosingTag = (html: string): boolean => {
  const bodyOpenTagIndex = html.indexOf('<body');
  if (bodyOpenTagIndex === -1) return false;
  
  const bodyCloseTagIndex = html.indexOf('</body>');
  return bodyCloseTagIndex > bodyOpenTagIndex;
};
