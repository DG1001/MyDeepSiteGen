import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  value, 
  onChange, 
  onGenerate,
  disabled 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      onGenerate();
    }
  };

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Describe the website you want to create... (e.g., 'Create a landing page for a coffee shop with a menu section')"
        className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
      />
      <p className="mt-2 text-sm text-gray-500">
        Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to generate
      </p>
    </div>
  );
};

export default PromptInput;
