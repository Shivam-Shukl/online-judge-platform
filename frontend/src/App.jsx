import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProblemList from './pages/ProblemList';
import Workspace from './pages/Workspace';
import Contribute from './pages/Contribute';
import Login from './pages/Login';       // <-- IMPORT
import Register from './pages/Register'; // <-- IMPORT

function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#1e1e1e', color: 'white', minHeight: '100vh', margin: 0, fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problem/:id" element={<Workspace />} /> 
          <Route path="/contribute" element={<Contribute />} /> 
          <Route path="/login" element={<Login />} />       {/* <-- ADD ROUTE */}
          <Route path="/register" element={<Register />} /> {/* <-- ADD ROUTE */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;