import React, { useEffect, useRef, useState } from 'react';
import { useAutoComplete } from '../hooks/useAutoComplete';

interface PreviewProps {
  html: string;
  isGenerating: boolean;
}

const Preview: React.FC<PreviewProps> = ({ html, isGenerating }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<string>('');
  
  // Process the HTML to remove markdown code blocks and metadata
  const processHtml = (rawHtml: string): string => {
    // Remove markdown code block markers and metadata comments
    let processed = rawHtml
      .replace(/```html\n?/g, '')
      .replace(/```\n?.*$/g, '')
      .trim();
    
    // Remove any trailing metadata about the webpage features
    processed = processed.replace(/This webpage includes:[\s\S]*$/, '');
    
    return processed;
  };

  const processedHtml = processHtml(html);
  const completedHtml = useAutoComplete(processedHtml);
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(completedHtml);
      iframe.contentWindow.document.close();
    }

    // Update status
    if (isGenerating) {
      setStatus('Generating website...');
    } else if (html) {
      setStatus('Generation complete');
    } else {
      setStatus('');
    }
  }, [completedHtml, isGenerating]);

  return (
    <div className="flex flex-col h-[calc(100%-3rem)]">
      <div className="relative flex-1 min-h-0 bg-gray-50">
        {!html && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 mb-4 border-4 border-dashed rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-200 rounded-md" />
            </div>
            <p className="text-center px-6">
              Your website preview will appear here
            </p>
          </div>
        )}
        
        {isGenerating && !html && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          title="Website Preview"
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
      
      <div className="h-12 bg-gray-50 border-t border-gray-200">
        <div className="h-full px-4 flex items-center text-sm text-gray-600">
          {status || 'Ready to generate'}
        </div>
      </div>
    </div>
  );
};

export default Preview;
