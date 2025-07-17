import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <header className="text-center">
        <img src={logo} className="h-20 w-20 mx-auto mb-4 animate-spin" alt="logo" />
        <p className="text-lg text-gray-700 mb-4">
          Edit <code className="bg-gray-200 px-2 py-1 rounded">src/App.tsx</code> and save to reload.
        </p>
        <a
          className="text-blue-500 hover:text-blue-700 underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
