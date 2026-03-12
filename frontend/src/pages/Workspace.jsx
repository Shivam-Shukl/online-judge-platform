import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import Editor from '@monaco-editor/react';
import axios from 'axios';

export default function Workspace() {
  const { id } = useParams(); 
  const [problem, setProblem] = useState(null); 
  
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}');
  const [status, setStatus] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`);
        setProblem(response.data.problem);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    if (lang === 'cpp') {
      setCode('#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}');
    } else {
      setCode('def solve():\n    # your code here\n    pass\n\nif __name__ == "__main__":\n    solve()');
    }
  };

  const handleSubmit = async () => {
    setStatus('Grading...');
    setResults(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submit`, {
        language,
        code,
        problemId: id 
      });
      setStatus(response.data.status);
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
      setStatus('Error connecting to server or execution failed.');
    }
  };

  if (!problem) return <h2 style={{ padding: '20px' }}>Loading problem...</h2>;

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '20px', gap: '20px' }}>
      
      <div style={{ flex: 1, backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', overflowY: 'auto' }}>
        <h2>{problem.title}</h2> 
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {problem.description}
        </p>
        
        <div style={{ marginTop: '20px' }}>
          <h4>Test Results: {status && <span style={{ color: status === 'Accepted' ? '#4caf50' : '#f44336' }}>{status}</span>}</h4>
          
          {results && results.map((res, index) => (
            <div key={index} style={{ backgroundColor: '#1e1e1e', padding: '10px', marginTop: '10px', borderLeft: res.passed ? '5px solid #4caf50' : '5px solid #f44336' }}>
              <p><strong>Input:</strong> {res.input}</p>
              <p><strong>Expected:</strong> {res.expectedOutput}</p>
              <p><strong>Your Output:</strong> {res.userOutput || res.error}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <select value={language} onChange={handleLanguageChange} style={{ padding: '8px', fontSize: '16px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px' }}>
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
          <button onClick={handleSubmit} style={{ marginLeft: '10px', padding: '8px 16px', fontSize: '16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Submit Code
          </button>
        </div>

        <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #444' }}>
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : 'python'}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{ fontSize: 16, minimap: { enabled: false } }}
          />
        </div>
      </div>
    </div>
  );
}