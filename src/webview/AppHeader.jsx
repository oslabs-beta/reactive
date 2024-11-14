/*
APP HEADER COMPONENT
==================

PURPOSE:
Renders a fixed header displaying app analysis statistics and branding.

COMPONENT STYLING:
-----------------
1. Layout:
   - Fixed position header
   - Flex container for content organization
   - SVG icon with atomic and tree visualization

2. Key Style Elements:
   - Dark background (bg-gray-900)
   - Contrast text colors
   - Rounded statistic pills
   - Dynamic spacing

REGEX EXPLANATION:
-----------------
appName formatting uses two regex transforms:
1. .replace(/\.[^/.]+$/, "") - Removes file extension
   Example: "MyApp.tsx" → "MyApp"
2. .replace(/([A-Z])/g, " $1") - Adds spaces before capitals
   Example: "MyApp" → "My App"
*/

import React from "react";

const AppHeader = ({ stats, appName, filePath }) => {
  // Format display name with regex transforms
  const displayName = appName
    .replace(/\.[^/.]+$/, "")     // Remove file extension
    .replace(/([A-Z])/g, " $1")   // Add spaces before capitals
    .trim();                      // Remove extra spaces

  // Calculate component type percentages
  const { functionalCount, classCount, nullCount, totalComponents } = stats;
  const functionalPercent = ((functionalCount / totalComponents) * 100).toFixed(1);
  const classPercent = ((classCount / totalComponents) * 100).toFixed(1);
  const nullPercent = ((nullCount / totalComponents) * 100).toFixed(1);

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-10">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-12">
          {/* SVG Icon Container - Add SVG with Reactive Logo */}

          {/* App Info Section */}
          <div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-blue-400">Reactive</span>
              {/* Edit span below to dynamically show target app name */}
              {/* <span className="text-lg text-gray-300 mt-1">
                {displayName || "Analyzing Unknown App"}
              </span> */}
              <div className="flex items-baseline space-x-4 mt-2">
                <span className="text-gray-400 text-sm">{filePath}</span>
              </div>
            </div>
            {/* Statistics pills */}
            <div className="text-sm mt-2 space-x-6">
              <span className="px-3 py-1 bg-blue-500 rounded-full">
                Functional: {functionalPercent}% |&nbsp;
              </span>
              <span className="px-3 py-1 bg-green-500 rounded-full">
                Class: {classPercent}% |&nbsp;
              </span>
              <span className="px-3 py-1 bg-yellow-500 rounded-full">
                Other: {nullPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;

/*
USAGE:
-----
<AppHeader
  stats={{
    functionalCount: 10,
    classCount: 2,
    nullCount: 0,
    totalComponents: 12
  }}
  appName="MyReactApp.tsx"
  filePath="/src/App.tsx"
/>
*/

// import React from "react";

// console.log("Top of file, Rendering AppHeader with updated SVG icon");

// const AppHeader = ({ stats, appName, filePath }) => {
//   const displayName = appName
//     .replace(/\.[^/.]+$/, "")
//     .replace(/([A-Z])/g, " $1")
//     .trim();
//   const { functionalCount, classCount, nullCount, totalComponents } = stats;
//   const functionalPercent = ((functionalCount / totalComponents) * 100).toFixed(
//     1
//   );
//   const classPercent = ((classCount / totalComponents) * 100).toFixed(1);
//   const nullPercent = ((nullCount / totalComponents) * 100).toFixed(1);

//   return (
//     <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 z-10">
//       <div className="flex items-center justify-between max-w-screen-xl mx-auto">
//         <div className="flex items-center space-x-12">
//           <div className="p-4 rounded-lg">
//             <svg
//               id="unique-alien-icon"
//               width="50"
//               height="50"
//               viewBox="0 0 100 100"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g transform="translate(35,10) scale(0.8)">
//                 <circle cx="20" cy="20" r="6" fill="currentColor" />
//                 <path
//                   d="M20 20m-15 0a15 15 0 1 0 30 0a15 15 0 1 0 -30 0"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                   fill="none"
//                 />
//                 <circle cx="20" cy="20" r="3" fill="white" />
//                 <path
//                   d="M20 5C30 5 30 35 20 35C10 35 10 5 20 5"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                   fill="none"
//                 />
//                 <circle cx="20" cy="5" r="2.5" fill="currentColor" />
//                 <circle cx="20" cy="35" r="2.5" fill="currentColor" />
//               </g>
//               <g transform="translate(0,45)">
//                 <line
//                   x1="50"
//                   y1="0"
//                   x2="50"
//                   y2="40"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                 />
//                 <circle cx="50" cy="10" r="4" fill="currentColor" />
//                 <line
//                   x1="20"
//                   y1="10"
//                   x2="80"
//                   y2="10"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                 />
//                 <circle cx="20" cy="10" r="4" fill="currentColor" />
//                 <circle cx="80" cy="10" r="4" fill="currentColor" />
//                 <circle cx="50" cy="25" r="4" fill="currentColor" />
//                 <line
//                   x1="30"
//                   y1="25"
//                   x2="70"
//                   y2="25"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                 />
//                 <circle cx="30" cy="25" r="4" fill="currentColor" />
//                 <circle cx="70" cy="25" r="4" fill="currentColor" />
//                 <circle cx="50" cy="40" r="4" fill="currentColor" />
//               </g>
//             </svg>
//           </div>

//           {/* App Info Section */}
//           <div>
//             <div className="flex flex-col">
//               <span className="text-xl font-bold text-blue-400">Reactive</span>
//               <span className="text-lg text-gray-300 mt-1">
//                 {displayName || "Analyzing Unknown App"}
//               </span>
//               <div className="flex items-baseline space-x-4 mt-2">
//                 <span className="text-gray-400 text-sm">{filePath}</span>
//               </div>
//             </div>
//             <div className="text-sm mt-2 space-x-6">
//               <span className="px-3 py-1 bg-blue-500 rounded-full">
//                 Functional: {functionalPercent}%
//               </span>
//               <span className="px-3 py-1 bg-green-500 rounded-full">
//                 Class: {classPercent}%
//               </span>
//               <span className="px-3 py-1 bg-yellow-500 rounded-full">
//                 Other: {nullPercent}%
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// console.log("Bottom of file, Rendering AppHeader with updated SVG icon");

// export default AppHeader;
