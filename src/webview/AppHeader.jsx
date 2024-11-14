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
