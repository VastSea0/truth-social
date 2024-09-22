import React, { useState, useEffect } from 'react';

export default function TruthBox() {
  const [message, setMessage] = useState('');  // backend'den gelen mesajı tutacak state
  const [name, setName] = useState(''); // input alanındaki değeri tutacak state
  const [id, setId] = useState(0); 
  const [greeting, setGreeting] = useState(''); // gönder butonuna tıklandığında gelen yanıtı tutacak state
  

  useEffect(() => { // component yüklendiğinde çalışacak fonksiyon
    fetch('http://localhost:8000', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(error => console.error('Hata:', error));
  }, []);

  // gönder butonuna tıklandığında çalışacak fonksiyon
  const handleSubmit = (e) => {
    if (name === '') {
      alert('Truth box cannot be empty');
      e.preventDefault();
    } else if (!name) {
      alert('Truth box cannot be empty');
      e.preventDefault();
    } else if (name.length > 300) {
      alert('Truth box cannot be more than 300 characters');
      e.preventDefault();
    } else if (name.length < 50) {
      alert('Truth box must be at least 50 characters');
      e.preventDefault();
    } else {
      e.preventDefault();
      setId(Math.floor(Math.random() * 10000));
      console.log(id);
      fetch('http://localhost:8000/truth', { // /truth endpointine istek at
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name , id}), // name değerini gönder
      })
        .then(response => response.json()) // gelen yanıtı json formatına çevir
        .then(data => setGreeting(data.greeting)) // gelen yanıttaki greeting değerini setGreeting fonksiyonu ile state'e ata
        .catch(error => console.error('Hata:', error));
    }
    
   
    
   
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Truth Box</h2>
                <p className='text text-gray-400 font-bold'>Tell me a truth</p>
                 
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="name" className="sr-only">Truth box</label>
                      <textarea
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Enter a truth"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onSubmit={() => {
                        setId(Math.floor(Math.random() * 10000));
                        console.log(id);
                      }}
                    >
                      Submit
                    </button>

                  </div>
                </form>
                {
                    /* gönder butonuna tıklandıktan sonra greeting state'i doluysa bu kısım çalışacak */
                }
                {greeting && (
        
                  <div className="mt-8 text-center">
                    <p className="text-xl font-semibold text-gray-900">Succsess!</p>
                  </div>
                )} 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}