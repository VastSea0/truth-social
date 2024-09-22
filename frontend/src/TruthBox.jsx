import React, { useState, useEffect } from 'react';
import { PlusCircle, Send, UserCircle } from 'lucide-react';

const TruthSocialApp = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState(Math.floor(Math.random() * 10000));
  const [greeting, setGreeting] = useState('');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Hata:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/requests', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setRequests(data))
      .catch(error => console.error('Hata:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === '') {
      alert('Truth box cannot be empty');
    } else if (!name) {
      alert('Truth box cannot be empty');
    } else if (name.length > 300) {
      alert('Truth box cannot be more than 300 characters');
 
    } else {
      setId(Math.floor(Math.random() * 10000));
      fetch('http://localhost:8000/truth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, id }),
      })
        .then(response => response.json())
        .then(data => {
          setGreeting(data.greeting);
          setRequests([...requests, { id, name, request: data.greeting }]);
          setName(''); // Clear input after submission
        })
        .catch(error => console.error('Hata:', error));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 text-center font-bold text-xl">
        Truth Social
      </header>

      {/* Truth List */}
      <main className="flex-grow overflow-y-auto">
        {requests.map((truth) => (
          <div key={truth.id} className="bg-white p-4 mb-2 shadow-sm">
            <div className="flex items-center mb-2">
              <UserCircle className="w-8 h-8 text-gray-500 mr-2" />
              <span className="font-semibold">User {truth.id}</span>
            </div>
            <p className="text-gray-800 mb-2">{truth.name}</p>
            {truth.request && (
              <p className="text-blue-500 font-semibold">{truth.request}</p>
            )}
          </div>
        ))}
      </main>

      {/* New Truth Input */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow-t-lg">
        <div className="flex flex-col">
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Share a truth (50-300 characters)..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            rows="3"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" /> Send Truth
          </button>
        </div>
      </form>

      {/* Navigation */}
      <nav className="bg-white border-t flex justify-around p-4">
        <button className="text-blue-500">
          <UserCircle className="w-6 h-6" />
        </button>
        <button className="text-blue-500">
          <PlusCircle className="w-6 h-6" />
        </button>
      </nav>

      {/* Message display (if needed) */}
      {message && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Message:</p>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default TruthSocialApp;