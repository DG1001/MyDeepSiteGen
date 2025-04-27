import React from 'react';
import { Github } from 'lucide-react';
import Generator from './components/Generator';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            DeepSite Generator
          </h1>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="GitHub repository"
          >
            <Github size={24} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Generator />
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>Powered by DeepSeek AI • Created with ❤️ in 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
