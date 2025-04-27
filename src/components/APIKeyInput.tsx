import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface APIKeyInputProps {
  apiKey: string;
  onChange: (key: string) => void;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ apiKey, onChange }) => {
  const [showKey, setShowKey] = useState<boolean>(false);

  return (
    <div className="relative">
      <input
        type={showKey ? "text" : "password"}
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your DeepSeek API key"
        className="w-full border border-gray-300 rounded-lg py-2 px-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
      <button
        type="button"
        onClick={() => setShowKey(!showKey)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default APIKeyInput;
