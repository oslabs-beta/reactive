// 

import React from 'react';
import ReactDOM from 'react-dom';
import Dendrogram from './Dendrogram';

const App = () => {
  return (
    <div>
      <h1>React Component Tree</h1>
      <Dendrogram />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';

// const container = document.getElementById('root');
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );