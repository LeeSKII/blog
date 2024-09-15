import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      <code className={`language-${language}`} style={{ background: "none" }}>
        {value}
      </code>
      <button
        onClick={copyToClipboard}
        className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
};

export default CodeBlock;
