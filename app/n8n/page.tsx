'use client';

import { useState } from 'react';

export default function Page() {
  const [generation, setGeneration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <button
        className='px-4 py-2 bg-blue-500 text-white rounded'
        onClick={async () => {
          setIsLoading(true);
          // Cambiar endpoint a /api/n8n
          await fetch('/api/n8n', {
            method: 'POST',
            body: JSON.stringify({
              prompt: 'Inventate una historia para programadores',
            }),
          }).then(response => {
            response.json().then(json => {
              setGeneration(json.text);
              setIsLoading(false);
            });
          });
        }}
      >
        Generate
      </button>

      {isLoading ? 'Loading...' : generation}
    </div>
  );
}