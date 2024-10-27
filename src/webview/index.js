import React from 'react';
import { createRoot } from 'react-dom/client';
import loadD3Module from './Dendrogram';

const App = () => {
  return (
    <div>
      <h1>React Component Tree</h1>
      <loadD3Module />
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

