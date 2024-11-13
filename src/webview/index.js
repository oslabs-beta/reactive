import React from 'react';
import { createRoot } from 'react-dom/client';
import Dendrogram from './Dendrogram';

const App = () => {
  return (
    <div>
      <h1>React Component Tree</h1>
        <div>
          <Dendrogram />
        </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);