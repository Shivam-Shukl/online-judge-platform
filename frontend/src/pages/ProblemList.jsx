import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems`);
        setProblems(response.data.problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Problem List</h1>
        {/* ADDED: Button to go to the Contribute page */}
        <Link to="/contribute" style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          + Contribute Problem
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {/* ADDED: Using 'index' to generate the 1, 2, 3 numbering */}
        {problems.map((problem, index) => (
          <div key={problem._id} style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>
                {index + 1}. {problem.title} 
              </h3>
              <span style={{ color: problem.difficulty === 'Easy' ? '#4caf50' : problem.difficulty === 'Medium' ? '#ff9800' : '#f44336', fontSize: '14px' }}>
                {problem.difficulty}
              </span>
            </div>
            
            <Link to={`/problem/${problem._id}`} style={{ backgroundColor: '#2196f3', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '4px' }}>
              Solve Problem
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}