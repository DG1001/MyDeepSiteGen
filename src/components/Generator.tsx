import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Copy, Zap, AlertCircle } from 'lucide-react';
import APIKeyInput from './APIKeyInput';
import PromptInput from './PromptInput';
import Preview from './Preview';
import { generateWebsite } from '../services/api';

const Generator: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('deepseek-api-key') || '';
  });
  const [prompt, setPrompt] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  
  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('deepseek-api-key', apiKey);
    }
  }, [apiKey]);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('API key is required');
      setShowApiKeyInput(true);
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a description for your website');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setGeneratedHtml('');

    try {
      await generateWebsite(
        apiKey,
        prompt,
        (chunk) => {
          setGeneratedHtml(prev => prev + chunk);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 lg:max-w-md space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300">
          <button 
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="flex items-center justify-between w-full text-left font-medium mb-4"
          >
            <span>DeepSeek API Key</span>
            {showApiKeyInput ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          <div className={`transition-all duration-300 overflow-hidden ${showApiKeyInput ? 'max-h-24' : 'max-h-0'}`}>
            <APIKeyInput 
              apiKey={apiKey} 
              onChange={setApiKey}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Website Description</h2>
          <PromptInput 
            value={prompt}
            onChange={setPrompt}
            onGenerate={handleGenerate}
            disabled={isGenerating}
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={18} />
            <span>{isGenerating ? 'Generating...' : 'Generate Website'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preview</h2>
          {generatedHtml && (
            <button
              onClick={handleCopyToClipboard}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <Copy size={16} />
              <span className="text-sm">Copy Code</span>
            </button>
          )}
        </div>
        <Preview 
          html={generatedHtml} 
          isGenerating={isGenerating} 
        />
      </div>
    </div>
  );
};

export default Generator;
