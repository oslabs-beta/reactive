/*
INITIALIZATION FLOW:
1. Import required dependencies
2. Set up DOM container for React
3. Create message listener for VSCode extension communication
4. Handle component tree data and render visualization

COMPONENT HIERARCHY:
Root
├── AppHeader (Statistics & App Info)
└── Dendrogram (Tree Visualization)
*/

import React from "react";
import { createRoot } from "react-dom/client";
import AppHeader from "./AppHeader";
import Dendrogram from "./Dendrogram";

/*
ROOT CONTAINER SETUP
Purpose: Ensure we have a single, consistent mounting point for React
Process:
1. Try to find existing root element
2. If not found, create new one
3. Initialize React root once
*/
const container = document.getElementById("root") || document.createElement("div");
if (!container.id) {
  container.id = "root";
  document.body.appendChild(container);
}
const root = createRoot(container);

/*
STATS CALCULATION FUNCTION
Purpose: Analyze component tree to generate statistics
Input: Component tree data object
Output: Object containing component type counts
Process:
1. Initialize counters
2. Recursively traverse tree
3. Categorize each component
4. Return statistics object

Data Structure Expected:
{
  type: "functional" | "class" | other,
  children: Array<Component>,
  ...other properties
}
*/
const calculateComponentStats = (data) => {
  // Return default stats if no data
  if (!data) return {
    functionalCount: 0,
    classCount: 0,
    nullCount: 0,
    totalComponents: 0,
  };

  // Initialize counters
  let functionalCount = 0;
  let classCount = 0;
  let nullCount = 0;

  /*
  TREE TRAVERSAL FUNCTION
  Purpose: Recursive component counting
  Process:
  1. Check component type
  2. Increment appropriate counter
  3. Recursively process children
  */
  const traverseForStats = (node) => {
    if (node.type && typeof node.type === "string") {
      // Categorize component based on type
      if (node.type.toLowerCase().includes("function")) functionalCount++;
      else if (node.type.toLowerCase().includes("class")) classCount++;
      else nullCount++;
    }
    // Process children recursively
    if (node.children) {
      node.children.forEach(traverseForStats);
    }
  };

  traverseForStats(data);
  return {
    functionalCount,
    classCount,
    nullCount,
    totalComponents: functionalCount + classCount + nullCount,
  };
};

/*
MESSAGE HANDLER
Purpose: Communication bridge with VSCode extension
Process:
1. Listen for 'astData' messages
2. Extract and validate data
3. Calculate statistics
4. Render UI components

Message Structure Expected:
{
  type: "astData",
  payload: {
    treeData: ComponentTreeObject,
    filePath: string
  },
  appName: string
}
*/
window.addEventListener("message", (event) => {
  if (event.data.type === "astData") {
    // Extract and validate data
    const astData = event.data.payload.treeData || {};
    const filePath = event.data.payload.filePath || "Unknown Component Path";
    const appName = event.data.appName || "React App";

    // Calculate component statistics
    const stats = calculateComponentStats(astData);

    /*
    RENDER UI
    Components:
    1. AppHeader: Shows statistics and app info
    2. Dendrogram: Displays component tree visualization
    
    Key Features:
    - Key prop on AppHeader forces refresh on app name change
    - Conditional rendering handles empty data case
    */
    root.render(
      <div className="h-screen w-screen">
        <AppHeader
          key={appName}
          stats={stats}
          appName={appName}
          filePath={filePath}
        />

        {astData && Object.keys(astData).length > 0 ? (
          <Dendrogram data={astData} />
        ) : (
          <p>No component data to display</p>
        )}
      </div>
    );
  }
});

// import React from "react";
// import { createRoot } from "react-dom/client";
// import AppHeader from "./AppHeader";
// import Dendrogram from "./Dendrogram";

// // Set up root container only once
// const container =
//   document.getElementById("root") || document.createElement("div");
// if (!container.id) {
//   container.id = "root";
//   document.body.appendChild(container);
// }
// const root = createRoot(container);

// // Function to safely calculate component stats
// const calculateComponentStats = (data) => {
//   if (!data)
//     return {
//       functionalCount: 0,
//       classCount: 0,
//       nullCount: 0,
//       totalComponents: 0,
//     };

//   let functionalCount = 0;
//   let classCount = 0;
//   let nullCount = 0;

//   const traverseForStats = (node) => {
//     if (node.type && typeof node.type === "string") {
//       if (node.type.toLowerCase().includes("function")) functionalCount++;
//       else if (node.type.toLowerCase().includes("class")) classCount++;
//       else nullCount++;
//     }
//     if (node.children) {
//       node.children.forEach(traverseForStats);
//     }
//   };

//   traverseForStats(data);
//   return {
//     functionalCount,
//     classCount,
//     nullCount,
//     totalComponents: functionalCount + classCount + nullCount,
//   };
// };

// // Listen for messages to update data and render
// window.addEventListener("message", (event) => {
//   if (event.data.type === "astData") {
//     const astData = event.data.payload.treeData || {};
//     const filePath = event.data.payload.filePath || "Unknown Component Path";
//     const appName = event.data.appName || "React App";

//     const stats = calculateComponentStats(astData);

//     root.render(
//       <div className="h-screen w-screen">
//         <AppHeader
//           key={appName} // This key is applied here
//           stats={stats}
//           appName={appName}
//           filePath={filePath}
//         />

//         {astData && Object.keys(astData).length > 0 ? (
//           <Dendrogram data={astData} />
//         ) : (
//           <p>No component data to display</p>
//         )}
//       </div>
//     );
//   }
// });

