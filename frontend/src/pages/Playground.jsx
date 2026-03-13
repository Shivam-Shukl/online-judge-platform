import { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';

export default function Playground() {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput("Running code...");
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/run`, {
        language,
        code,
        input
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput(error.response?.data?.error || "An error occurred during execution.");
    }
    setLoading(false);
  };

  // Monaco needs the full language name for Python to color it correctly
  const getMonacoLanguage = (lang) => {
    if (lang === 'py') return 'python';
    return lang;
  };

  const containerStyle = { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1e1e1e', color: 'white', padding: '20px', boxSizing: 'border-box' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' };
  const selectStyle = { padding: '8px 15px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px', fontSize: '16px' };
  const btnStyle = { padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
  const editorAreaStyle = { display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' };
  const sidePanelStyle = { display: 'flex', flexDirection: 'column', width: '30%', gap: '20px' };
  const textAreaStyle = { width: '100%', height: '100%', backgroundColor: '#2d2d2d', color: '#f8f8f2', fontFamily: 'monospace', fontSize: '16px', padding: '15px', border: '1px solid #444', borderRadius: '4px', resize: 'none', boxSizing: 'border-box' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2>Online Compiler</h2>
        <div>
          <select style={selectStyle} value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="cpp">C++</option>
            <option value="py">Python</option>
            <option value="java">Java</option>
          </select>
          <button style={{ ...btnStyle, marginLeft: '15px' }} onClick={handleRun} disabled={loading}>
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      <div style={editorAreaStyle}>
        {/* 🔥 The Upgraded Monaco Editor 🔥 */}
        <div style={{ flex: 1, border: '1px solid #444', borderRadius: '4px', overflow: 'hidden' }}>
          <Editor
            height="100%"
            language={getMonacoLanguage(language)}
            theme="vs-dark"
            value={code}
            onChange={(newValue) => setCode(newValue)}
            options={{
              fontSize: 16,
              minimap: { enabled: false }, // Hides the tiny code map on the right to save space
              automaticLayout: true,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Input and Output Panels stay as textareas since they are just for raw text */}
        <div style={sidePanelStyle}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Custom Input</h3>
            <textarea 
              style={textAreaStyle} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type your inputs here..."
              spellCheck="false"
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Output</h3>
            <textarea 
              style={{ ...textAreaStyle, backgroundColor: '#111', color: loading ? '#888' : '#4caf50' }} 
              value={output} 
              readOnly 
            />
          </div>
        </div>
      </div>
    </div>
  );
}