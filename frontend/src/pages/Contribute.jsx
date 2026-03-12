import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Contribute() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  
  // Start with one empty test case by default
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/problems`, {
        title,
        description,
        difficulty,
        testCases
      });
      alert('Problem added successfully!');
      navigate('/problems'); // Redirect back to the problem list
    } catch (error) {
      console.error(error);
      alert('Error adding problem. Title might already exist!');
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Contribute a Problem</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        
        <label>Problem Title</label>
        <input required style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Multiply Two Numbers" />

        <label>Description</label>
        <textarea required style={{ ...inputStyle, minHeight: '100px' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write the problem statement here..." />

        <label>Difficulty</label>
        <select style={inputStyle} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <h3>Test Cases</h3>
        {testCases.map((tc, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Input</label>
              <input required style={inputStyle} value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} placeholder="e.g., 5 10" />
            </div>
            <div style={{ flex: 1 }}>
              <label>Expected Output</label>
              <input required style={inputStyle} value={tc.expectedOutput} onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)} placeholder="e.g., 50" />
            </div>
          </div>
        ))}
        
        <button type="button" onClick={addTestCase} style={{ backgroundColor: '#555', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
          + Add Another Test Case
        </button>

        <hr style={{ borderColor: '#444', marginBottom: '20px' }} />

        <button type="submit" style={{ width: '100%', backgroundColor: '#4caf50', color: 'white', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit to Database
        </button>
      </form>
    </div>
  );
}