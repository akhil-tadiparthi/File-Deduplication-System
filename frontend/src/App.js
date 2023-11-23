import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home';
import Login from './login';
import Register from './register';
import Dashboard  from './dashboard';
import ViewFiles from './viewFiles';
import './App.css';
import { useState } from 'react';
import { AuthProvider } from './AuthContext';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            <Route path="/dashboard" element={<Dashboard email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
            <Route path="/viewFiles" element={<ViewFiles email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
            <Route path="/fileUpload" element={<fileUpload email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;