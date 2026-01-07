
import React, { useState } from 'react';
import { Button } from './Button';

interface CodeDisplayProps {
  code: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ghl-optimized-design.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-300">Generated GHL Code</h3>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCopy} className="py-2 px-4 text-sm">
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          <Button variant="primary" onClick={handleDownload} className="py-2 px-4 text-sm">
            Download .html
          </Button>
        </div>
      </div>
      <pre className="p-6 overflow-auto mono text-xs leading-relaxed text-blue-300 selection:bg-blue-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
};
