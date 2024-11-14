import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const COLORS = {
  initial: "#ff69b4",
  depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
  text: {
    primary: "#1a237e",
    secondary: "#2e7d32",
    tertiary: "#1565c0"
  },
  link: "rgba(85, 85, 85, 0.4)",
  truncation: "#e91e63"
};

const NODE_CONFIG = {
  baseWidth: 130,
  baseHeight: 70,
  depthScale: 0.9,
  minScale: 0.6,
  cornerRadius: 10,
  textTruncateLength: 15,
  verticalSpacing: 120,
  horizontalSpacing: 40
};

const Dendrogram = ({ data, appName }) => {
  const svgRef = useRef();
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    const tree = d3.tree()
      .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
      .separation((a, b) => (a.parent === b.parent ? 1.2 : 2.4));

    const root = d3.hierarchy(data);
    const g = svg.append("g"); // Group element to allow for zooming

    const zoom = d3.zoom()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    function update(source) {
      tree(root);
      const nodes = root.descendants();
      const links = root.links();

      const link = g.selectAll(".link")
        .data(links, d => d.target.data.file);

      link.enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
          .x(d => d.x)
          .y(d => d.y)
        )
        .style("stroke", COLORS.link)
        .style("fill", "none")
        .style("stroke-width", 1.5);

      link.exit().remove();

      const node = g.selectAll(".node")
        .data(nodes, d => d.data.file);

      const nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${source.x0 || d.x},${source.y0 || d.y})`)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter.each(function(d) {
        const depth = Math.min(d.depth, COLORS.depths.length - 1);
        d3.select(this).append("rect")
          .attr("x", -NODE_CONFIG.baseWidth / 2)
          .attr("y", -NODE_CONFIG.baseHeight / 2)
          .attr("width", NODE_CONFIG.baseWidth)
          .attr("height", NODE_CONFIG.baseHeight)
          .attr("rx", NODE_CONFIG.cornerRadius)
          .style("fill", COLORS.depths[depth]);

        const textGroup = d3.select(this).append("g").attr("class", "text-group");
        const fileName = d.data.file || "Unnamed";
        const truncatedName = fileName.length > NODE_CONFIG.textTruncateLength
          ? `${fileName.slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
          : fileName;

        textGroup.append("text")
          .attr("y", -NODE_CONFIG.baseHeight / 4)
          .attr("text-anchor", "middle")
          .style("fill", COLORS.text.primary)
          .text(truncatedName);

        if (truncatedName !== fileName) {
          textGroup.append("title").text(fileName);
        }

        textGroup.append("text")
          .attr("y", 0)
          .attr("text-anchor", "middle")
          .style("fill", COLORS.text.secondary)
          .text(d.data.type || "Unknown");

        textGroup.append("text")
          .attr("y", NODE_CONFIG.baseHeight / 4)
          .attr("text-anchor", "middle")
          .style("fill", COLORS.text.tertiary)
          .text(`State: ${d.data.state ? d.data.state.length : 0}`);
      });

      const nodeUpdate = nodeEnter.merge(node);
      nodeUpdate.transition().duration(750).attr("transform", d => `translate(${d.x},${d.y})`);
      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
      node.exit().remove();
    }

    update(root);

    const initialTransform = d3.zoomIdentity.translate(width / 2, height / 4).scale(0.8);
    svg.call(zoom.transform, initialTransform);

    setTimeout(() => {
      svg.transition()
        .duration(2000)
        .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 6).scale(0.4));
    }, 1000);

    return () => svg.selectAll("*").remove();
  }, [data]);

  // **DARK MODE STYLES**
  const backgroundColor = isDarkMode ? "#1a1a1a" : "#ffffff";
  const textColor = isDarkMode ? "#ffffff" : "#333333";

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsDarkMode(prev => !prev)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "10px 20px",
          backgroundColor: isDarkMode ? "#333" : "#ddd",
          color: isDarkMode ? "#eee" : "#111",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Toggle Dark Mode
      </button>

      <h1
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: textColor,
          fontSize: "24px",
          fontFamily: "Arial, sans-serif"
        }}
      >
        {appName || "React Component Tree"}
      </h1>

      <svg 
        ref={svgRef} 
        width="100vw" 
        height="100vh"
        style={{ backgroundColor }}
      >
        <style>{`
          .link { stroke: ${COLORS.link}; stroke-width: 1.5px; }
          .node text { font-size: 12px; font-weight: 500; fill: ${textColor}; }
        `}</style>
      </svg>
    </div>
  );
};

export default Dendrogram;


// // /*
// // VISUALIZATION CONFIGURATION:
// // --------------------------
// // 1. Node Display:
// //    - Rounded rectangles with dynamic sizing based on depth
// //    - Smart text truncation for names > 15 characters
// //    - Hover tooltips for full names
// //    - Visual indicators for truncated names
// //    - Depth-based colors for distinguishing levels

// // 2. Layout:
// //    - Designed for trees up to 5+ levels deep
// //    - Handles 2-10 siblings per level smoothly
// //    - Dynamic spacing for visually clear separation

// // 3. Color Scheme:
// //    - Transition from pink to orange with increasing depth
// //    - High contrast text
// //    - Light shadows to enhance depth perception
// // */

// import React, { useRef, useEffect } from "react";
// import * as d3 from "d3";

// // **STYLE CONFIGURATION:** Set color and sizing for node and link visuals
// const COLORS = {
//   initial: "#ff69b4", // Start with pink, transitioning to orange for deeper nodes
//   depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
//   text: {
//     primary: "#1a237e", // Filename color
//     secondary: "#2e7d32", // Component type color
//     tertiary: "#1565c0", // State info color
//   },
//   link: "rgba(85, 85, 85, 0.4)", // Links between nodes (semi-transparent for readability)
//   truncation: "#e91e63", // Indicator for truncated text
// };

// // **NODE LAYOUT CONFIGURATION:** Customize dimensions and spacing for nodes
// const NODE_CONFIG = {
//   baseWidth: 130,
//   baseHeight: 70,
//   depthScale: 0.9, // Nodes shrink slightly at each level
//   minScale: 0.6, // Minimum size scale at deepest level
//   cornerRadius: 10, // Rounded corners
//   textTruncateLength: 15, // Max chars before filename is truncated
//   verticalSpacing: 120, // Distance between tree levels
//   horizontalSpacing: 40, // Distance between sibling nodes
// };

// // **DENDROGRAM COMPONENT:** Renders tree structure and controls layout with D3
// const Dendrogram = ({ data }) => {
//   const svgRef = useRef(); // References the SVG container

//   // **EFFECT:** Executes when the component is mounted
//   useEffect(() => {
//     if (!svgRef.current) return;

//     // **SVG & D3 SETUP**: Creates an SVG drawing area
//     const svg = d3.select(svgRef.current);
//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     // Configuring a tree layout in D3
//     const tree = d3
//       .tree()
//       .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
//       .separation((a, b) => (a.parent === b.parent ? 1.2 : 2.4));

//     // **DATA STRUCTURE:** Create hierarchy from data
//     const root = d3.hierarchy(data);

//     // **ZOOM SETUP**: Enable zoom with limits and responsiveness
//     const zoom = d3
//       .zoom()
//       .scaleExtent([0.1, 2]) // Limits of zoom scale
//       .on("zoom", (event) => {
//         g.attr("transform", event.transform); // Zooms on SVG group element
//       });
//     svg.call(zoom);

//     // **DRAWING GROUP**: Append a group to contain all elements (nodes & links)
//     const g = svg.append("g");

//     // **UPDATE FUNCTION:** Core function for handling re-rendering on events
//     function update(source) {
//       // Compute the tree layout on the root data
//       tree(root);
//       const nodes = root.descendants();
//       const links = root.links();

//       // **LINKS**: Draws lines between nodes
//       const link = g.selectAll(".link").data(links, (d) => d.target.data.file);

//       link
//         .enter()
//         .append("path")
//         .attr("class", "link")
//         .attr(
//           "d",
//           d3
//             .linkVertical()
//             .x((d) => d.x) // x-coord based on depth
//             .y((d) => d.y) // y-coord based on hierarchy level
//         )
//         .style("stroke", COLORS.link) // Styling links
//         .style("fill", "none")
//         .style("stroke-width", 1.5);

//       link.exit().remove(); // Removes outdated links

//       // **NODES**: Create nodes with rectangles and text
//       const node = g.selectAll(".node").data(nodes, (d) => d.data.file);

//       const nodeEnter = node
//         .enter()
//         .append("g")
//         .attr("class", "node")
//         .attr(
//           "transform",
//           (d) => `translate(${source.x0 || d.x},${source.y0 || d.y})`
//         )
//         .on("click", (event, d) => {
//           d.children = d.children ? null : d._children; // Toggle visibility of children
//           update(d); // Update the layout
//         });

//       // **NODE STYLING**: Define background rectangles with color gradients
//       nodeEnter.each(function (d) {
//         const depth = Math.min(d.depth, COLORS.depths.length - 1); // Limits depth color range
//         const rect = d3
//           .select(this)
//           .append("rect")
//           .attr("x", -NODE_CONFIG.baseWidth / 2)
//           .attr("y", -NODE_CONFIG.baseHeight / 2)
//           .attr("width", NODE_CONFIG.baseWidth)
//           .attr("height", NODE_CONFIG.baseHeight)
//           .attr("rx", NODE_CONFIG.cornerRadius)
//           .style("fill", COLORS.depths[depth])
//           .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))");

//         // **TEXT CONFIGURATION:** Append text for filename, type, and state
//         const textGroup = d3
//           .select(this)
//           .append("g")
//           .attr("class", "text-group");

//         // Display filename with truncation indicator
//         const fileName = d.data.file || "Unnamed";
//         const truncatedName =
//           fileName.length > NODE_CONFIG.textTruncateLength
//             ? `${fileName.slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
//             : fileName;

//         textGroup
//           .append("text")
//           .attr("y", -NODE_CONFIG.baseHeight / 4)
//           .attr("text-anchor", "middle")
//           .style("fill", COLORS.text.primary)
//           .text(truncatedName);

//         // **HOVER TOOLTIP**: Show full filename on hover if truncated
//         if (truncatedName !== fileName) {
//           textGroup.append("title").text(fileName); // Tooltip with full name
//         }

//         // Component type text (e.g., Functional, Class, etc.)
//         textGroup
//           .append("text")
//           .attr("y", 0)
//           .attr("text-anchor", "middle")
//           .style("fill", COLORS.text.secondary)
//           .text(d.data.type || "Unknown");

//         // State info (number of state variables) for the component
//         textGroup
//           .append("text")
//           .attr("y", NODE_CONFIG.baseHeight / 4)
//           .attr("text-anchor", "middle")
//           .style("fill", COLORS.text.tertiary)
//           .text(`State: ${d.data.state ? d.data.state.length : 0}`);
//       });

//       // **NODE TRANSITIONS**: Adds smooth transitions for position updates
//       const nodeUpdate = nodeEnter.merge(node);
//       nodeUpdate
//         .transition()
//         .duration(750)
//         .attr("transform", (d) => `translate(${d.x},${d.y})`);

//       // Store positions for transitions
//       nodes.forEach((d) => {
//         d.x0 = d.x;
//         d.y0 = d.y;
//       });

//       // Remove outdated nodes
//       node.exit().remove();
//     }

//     // Initial render setup: Set up the root node and render
//     update(root);

//     // Set initial zoom position and scale
//     const initialTransform = d3.zoomIdentity
//       .translate(width / 2, height / 4)
//       .scale(0.8);
//     svg.call(zoom.transform, initialTransform);

//     return () => {
//       svg.selectAll("*").remove(); // Clean up when component unmounts
//     };
//   }, [data]);

//   // **SVG RETURN**: Returns the SVG element with a responsive setup
//   return (
//     <svg
//       ref={svgRef}
//       width="100vw"
//       height="100vh"
//       style={{ background: "#f0f0f0" }} // Background for contrast
//     >
//       <style>{`
//         .link { stroke: ${COLORS.link}; stroke-width: 1.5px; }
//         .node text { font-size: 12px; font-weight: 500; }
//         .text-group text { font-family: sans-serif; }
//       `}</style>
//     </svg>
//   );
// };

// export default Dendrogram;

// // import React, { useRef, useEffect } from "react";
// // import * as d3 from "d3";
// // import AppHeader from './AppHeader';
// // import { createRoot } from "react-dom/client";

// // // D3 Configuration constants
// // const COLORS = {
// //   initial: "#ff69b4",
// //   depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
// //   text: { primary: "#1a237e", secondary: "#2e7d32", tertiary: "#1565c0" },
// //   link: "rgba(85, 85, 85, 0.4)",
// // };
// // const NODE_CONFIG = {
// //   baseWidth: 130, baseHeight: 70, depthScale: 0.9, minScale: 0.6, cornerRadius: 10, textTruncateLength: 15
// // };

// // const container = document.getElementById('root') || document.createElement('div');
// // if (!container.id) { container.id = 'root'; document.body.appendChild(container); }
// // const root = createRoot(container);

// // function calculateComponentStats(data) {
// //   let functionalCount = 0, classCount = 0, nullCount = 0;
// //   function traverse(node) {
// //     if (node.type === 'FunctionComponent') functionalCount++;
// //     else if (node.type === 'ClassComponent') classCount++;
// //     else nullCount++;
// //     if (node.children) node.children.forEach(traverse);
// //   }
// //   traverse(data);
// //   const totalComponents = Math.max(1, functionalCount + classCount + nullCount);
// //   return { functionalCount, classCount, nullCount, totalComponents };
// // }

// // window.addEventListener("message", (event) => {
// //   if (event.data.type === "astData") {
// //     const astData = event.data.payload.treeData || {};
// //     const stats = calculateComponentStats(astData);
// //     root.render(
// //       <div className="h-screen w-screen">
// //         <AppHeader
// //           stats={stats}
// //           appName={event.data.appName || "React App"}
// //           filePath={event.data.payload.filePath || "Unknown Component Path"}
// //         />
// //         {Object.keys(astData).length > 0 ? (
// //           <Dendrogram data={astData} />
// //         ) : (
// //           <p>No component data to display</p>
// //         )}
// //       </div>
// //     );
// //   }
// // });

// // const Dendrogram = ({ data }) => {
// //   const svgRef = useRef();

// //   useEffect(() => {
// //     if (!svgRef.current) return;
// //     const svg = d3.select(svgRef.current);
// //     const margin = { top: 80, right: 20, bottom: 20, left: 20 };
// //     const width = window.innerWidth - margin.left - margin.right;
// //     const height = window.innerHeight - margin.top - margin.bottom;
// //     const tree = d3.tree().nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2]);
// //     const root = d3.hierarchy(data);
// //     root.descendants().forEach(d => (d._children = d.children));

// //     const zoom = d3.zoom().scaleExtent([0.1, 2]).on("zoom", (event) => g.attr("transform", event.transform));
// //     svg.call(zoom);
// //     const g = svg.append("g");

// //     function update(source) {
// //       tree(root);
// //       const nodes = root.descendants();
// //       const links = root.links();

// //       const link = g.selectAll(".link").data(links, d => d.target.data.file);
// //       const linkEnter = link.enter().append("path").attr("class", "link").attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));
// //       link.merge(linkEnter).transition().duration(750).attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));
// //       link.exit().transition().duration(750).remove();

// //       const node = g.selectAll(".node").data(nodes, d => d.data.file);
// //       const nodeEnter = node.enter().append("g").attr("class", "node").attr("transform", d => `translate(${source.x0 || d.x},${source.y0 || d.y})`)
// //         .on("click", (event, d) => { d.children = d.children ? null : d._children; update(d); });

// //       nodeEnter.each(function(d) {
// //         const depth = Math.min(d.depth, COLORS.depths.length - 1);
// //         d3.select(this).append("rect").attr("x", -NODE_CONFIG.baseWidth / 2).attr("y", -NODE_CONFIG.baseHeight / 2)
// //           .attr("width", NODE_CONFIG.baseWidth).attr("height", NODE_CONFIG.baseHeight)
// //           .attr("rx", NODE_CONFIG.cornerRadius).attr("ry", NODE_CONFIG.cornerRadius)
// //           .style("fill", COLORS.depths[depth]);

// //         const textGroup = d3.select(this).append("g").attr("class", "text-group");
// //         textGroup.append("text").attr("y", -NODE_CONFIG.baseHeight / 4).attr("text-anchor", "middle").style("fill", COLORS.text.primary)
// //           .text(d.data.file ? d.data.file.slice(0, NODE_CONFIG.textTruncateLength) : "Unnamed");

// //         textGroup.append("text").attr("y", 0).attr("text-anchor", "middle").style("fill", COLORS.text.secondary)
// //           .text(d.data.type || "Unknown");

// //         textGroup.append("text").attr("y", NODE_CONFIG.baseHeight / 4).attr("text-anchor", "middle").style("fill", COLORS.text.tertiary)
// //           .text(`State: ${d.data.state ? d.data.state.length : 0}`);
// //       });

// //       const nodeUpdate = nodeEnter.merge(node);
// //       nodeUpdate.transition().duration(750).attr("transform", d => `translate(${d.x},${d.y})`);
// //       nodes.forEach(d => { d.x0 = d.x; d.y0 = d.y; });
// //       node.exit().transition().duration(750).attr("transform", d => `translate(${source.x},${source.y})`).remove();
// //     }

// //     update(root);
// //   }, [data]);

// //   return <svg ref={svgRef} width="95vw" height="90vh" className="bg-gray-50"></svg>;
// // };

// // export default Dendrogram;

// // // import React, { useRef, useEffect } from "react";
// // // import { createRoot } from "react-dom/client";
// // // import * as d3 from "d3";
// // // import AppHeader from './AppHeader';

// // // // Configuration constants
// // // const COLORS = {
// // //   initial: "#ff69b4",       // Starting pink
// // //   transition: "#ffeb3b",    // Transition yellow
// // //   depths: [                 // Final depth-based colors
// // //     "#ffb74d",             // Root (Level 0)
// // //     "#ffa726",             // Level 1
// // //     "#ff9800",             // Level 2
// // //     "#fb8c00",             // Level 3
// // //     "#f57c00",             // Level 4
// // //     "#ef6c00"              // Level 5+
// // //   ],
// // //   text: {
// // //     primary: "#1a237e",    // Dark blue for filenames
// // //     secondary: "#2e7d32",  // Dark green for type
// // //     tertiary: "#1565c0"    // Blue for state
// // //   },
// // //   link: "rgba(85, 85, 85, 0.4)", // Semi-transparent connections
// // //   truncation: "#e91e63"     // Pink indicator for truncated names
// // // };

// // // const NODE_CONFIG = {
// // //   baseWidth: 130,
// // //   baseHeight: 70,
// // //   depthScale: 0.9,         // Size reduction per level
// // //   minScale: 0.6,           // Minimum size (60% of base)
// // //   cornerRadius: 10,
// // //   textTruncateLength: 15,
// // //   verticalSpacing: 120,
// // //   horizontalSpacing: 40
// // // };

// // // function calculateComponentStats(data) {
// // //   let functionalCount = 0;
// // //   let classCount = 0;
// // //   let nullCount = 0;

// // //   function traverse(node) {
// // //     if (node.type === 'FunctionComponent') functionalCount++;
// // //     else if (node.type === 'ClassComponent') classCount++;
// // //     else nullCount++;

// // //     if (node.children) {
// // //       node.children.forEach(traverse);
// // //     }
// // //   }

// // //   traverse(data);

// // //   const totalComponents = Math.max(1, functionalCount + classCount + nullCount);

// // //   return {
// // //     functionalCount,
// // //     classCount,
// // //     nullCount,
// // //     totalComponents
// // //   };
// // // }

// // // window.addEventListener("message", (event) => {
// // //   if (event.data.type === "astData") {
// // //     const astData = event.data.payload;
// // //     const stats = calculateComponentStats(astData);
// // //     const container = document.getElementById("root");
// // //     const root = createRoot(container);

// // //     root.render(
// // //       <div className="h-screen w-screen">
// // //         <AppHeader
// // //           stats={stats}
// // //           appName={astData.file || "React App"}
// // //           filePath="/src/App.tsx"
// // //         />
// // //         <Dendrogram data={astData} />
// // //       </div>
// // //     );
// // //   }
// // // });

// // // const Dendrogram = ({ data }) => {
// // //   const svgRef = useRef();

// // //   useEffect(() => {
// // //     if (!svgRef.current) return;

// // //     const svg = d3.select(svgRef.current);
// // //     const margin = { top: 80, right: 20, bottom: 20, left: 20 };
// // //     const width = window.innerWidth - margin.left - margin.right;
// // //     const height = window.innerHeight - margin.top - margin.bottom;

// // //     // Tree layout configuration
// // //     const tree = d3
// // //       .tree()
// // //       .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
// // //       .separation((a, b) => {
// // //         return a.parent === b.parent ? 1.2 : 2.4;
// // //       });

// // //     const root = d3.hierarchy(data);
// // //     root.descendants().forEach((d) => (d._children = d.children));

// // //     const zoom = d3.zoom()
// // //       .scaleExtent([0.1, 2])
// // //       .on("zoom", (event) => {
// // //         g.attr("transform", event.transform);
// // //       });

// // //     svg.call(zoom);

// // //     const g = svg.append("g");

// // //     // Helper functions
// // //     const getNodeSize = (depth) => {
// // //       const scale = Math.max(
// // //         NODE_CONFIG.minScale,
// // //         Math.pow(NODE_CONFIG.depthScale, depth)
// // //       );
// // //       return {
// // //         width: NODE_CONFIG.baseWidth * scale,
// // //         height: NODE_CONFIG.baseHeight * scale
// // //       };
// // //     };

// // //     const formatNodeName = (name) => {
// // //       const maxLength = NODE_CONFIG.textTruncateLength;
// // //       if (!name) return { display: 'Unnamed', truncated: false };
// // //       if (name.length <= maxLength) {
// // //         return { display: name, truncated: false };
// // //       }
// // //       return {
// // //         display: `${name.slice(0, maxLength - 3)}...`,
// // //         truncated: true
// // //       };
// // //     };

// // //     function update(source) {
// // //       tree(root);
// // //       const nodes = root.descendants();
// // //       const links = root.links();

// // //       // Update links
// // //       const link = g
// // //         .selectAll(".link")
// // //         .data(links, d => d.target.data.file);

// // //       const linkEnter = link
// // //         .enter()
// // //         .append("path")
// // //         .attr("class", "link")
// // //         .attr("d", d3.linkVertical()
// // //           .x(d => d.x)
// // //           .y(d => d.y)
// // //         );

// // //       link.merge(linkEnter)
// // //         .transition()
// // //         .duration(750)
// // //         .attr("d", d3.linkVertical()
// // //           .x(d => d.x)
// // //           .y(d => d.y)
// // //         );

// // //       link.exit()
// // //         .transition()
// // //         .duration(750)
// // //         .remove();

// // //       // Update nodes
// // //       const node = g
// // //         .selectAll(".node")
// // //         .data(nodes, d => d.data.file);

// // //       const nodeEnter = node
// // //         .enter()
// // //         .append("g")
// // //         .attr("class", "node")
// // //         .attr("transform", d => `translate(${source.x0 || d.x},${source.y0 || d.y})`)
// // //         .on("click", (event, d) => {
// // //           d.children = d.children ? null : d._children;
// // //           update(d);
// // //         });

// // //       // Add node rectangles with depth-based styling
// // //       nodeEnter.each(function(d) {
// // //         const nodeSize = getNodeSize(d.depth);
// // //         const depth = Math.min(d.depth, COLORS.depths.length - 1);

// // //         // Background rectangle
// // //         d3.select(this)
// // //           .append("rect")
// // //           .attr("x", -nodeSize.width / 2)
// // //           .attr("y", -nodeSize.height / 2)
// // //           .attr("width", nodeSize.width)
// // //           .attr("height", nodeSize.height)
// // //           .attr("rx", NODE_CONFIG.cornerRadius)
// // //           .attr("ry", NODE_CONFIG.cornerRadius)
// // //           .style("fill", COLORS.initial)
// // //           .attr("data-depth", depth)
// // //           .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))");

// // //         const { display, truncated } = formatNodeName(d.data.file);

// // //         // Create text group
// // //         const textGroup = d3.select(this)
// // //           .append("g")
// // //           .attr("class", "text-group");

// // //         // Filename
// // //         textGroup
// // //           .append("text")
// // //           .attr("y", -nodeSize.height / 4)
// // //           .attr("text-anchor", "middle")
// // //           .style("fill", COLORS.text.primary)
// // //           .text(display);

// // //         if (truncated) {
// // //           textGroup
// // //             .append("circle")
// // //             .attr("cx", nodeSize.width / 2 - 8)
// // //             .attr("cy", -nodeSize.height / 4)
// // //             .attr("r", 3)
// // //             .style("fill", COLORS.truncation);

// // //           textGroup
// // //             .append("title")
// // //             .text(d.data.file);
// // //         }

// // //         // Component type
// // //         textGroup
// // //           .append("text")
// // //           .attr("y", 0)
// // //           .attr("text-anchor", "middle")
// // //           .style("fill", COLORS.text.secondary)
// // //           .text(d.data.type);

// // //         // State count
// // //         const stateText = textGroup
// // //           .append("text")
// // //           .attr("y", nodeSize.height / 4)
// // //           .attr("text-anchor", "middle")
// // //           .style("fill", COLORS.text.tertiary)
// // //           .style("cursor", "pointer")
// // //           .text(`State: ${d.data.state.length}`)
// // //           .on("click", function(event) {
// // //             event.stopPropagation();
// // //             showStateDetails(d, this);
// // //           });
// // //       });

// // //       function showStateDetails(d, element) {
// // //         g.selectAll(".state-details").remove();

// // //         const stateDetails = g
// // //           .append("g")
// // //           .attr("class", "state-details")
// // //           .attr("transform", `translate(${d.x + 100},${d.y - 30})`);

// // //         stateDetails
// // //           .append("rect")
// // //           .attr("x", -170)
// // //           .attr("y", 80)
// // //           .attr("width", 150)
// // //           .attr("height", d.data.state.length * 20 + 20)
// // //           .attr("rx", 5)
// // //           .attr("ry", 5)
// // //           .style("fill", "#fff")
// // //           .style("stroke", COLORS.text.tertiary)
// // //           .style("stroke-width", "1px")
// // //           .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.1))");

// // //         stateDetails
// // //           .append("text")
// // //           .attr("x", -35)
// // //           .attr("y", 95)
// // //           .text("×")
// // //           .style("fill", COLORS.text.tertiary)
// // //           .style("cursor", "pointer")
// // //           .style("font-size", "16px")
// // //           .on("click", () => stateDetails.remove());

// // //         d.data.state.forEach((item, i) => {
// // //           stateDetails
// // //             .append("text")
// // //             .attr("x", -160)
// // //             .attr("y", i * 20 + 100)
// // //             .text(item)
// // //             .style("fill", COLORS.text.primary)
// // //             .style("font-size", "12px");
// // //         });
// // //       }

// // //       // Handle node updates
// // //       const nodeUpdate = nodeEnter.merge(node);

// // //       nodeUpdate
// // //         .transition()
// // //         .duration(750)
// // //         .attr("transform", d => `translate(${d.x},${d.y})`);

// // //       // Store positions for transitions
// // //       nodes.forEach(d => {
// // //         d.x0 = d.x;
// // //         d.y0 = d.y;
// // //       });

// // //       // Remove old nodes
// // //       node.exit()
// // //         .transition()
// // //         .duration(750)
// // //         .attr("transform", d => `translate(${source.x},${source.y})`)
// // //         .remove();

// // //       // Transition to depth-based colors
// // //       setTimeout(() => {
// // //         g.selectAll("rect")
// // //           .transition()
// // //           .duration(2000)
// // //           .style("fill", d => COLORS.depths[Math.min(d.depth, COLORS.depths.length - 1)]);
// // //       }, 1000);
// // //     }

// // //     // Initial render
// // //     update(root);

// // //     // Initial view positioning
// // //     const initialTransform = d3.zoomIdentity
// // //       .translate(width / 2, height / 4)
// // //       .scale(0.8);

// // //     svg.call(zoom.transform, initialTransform);

// // //     // Zoom out animation
// // //     setTimeout(() => {
// // //       svg.transition()
// // //         .duration(2000)
// // //         .call(zoom.transform, d3.zoomIdentity
// // //           .translate(width / 2, height / 6)
// // //           .scale(0.4)
// // //         );
// // //     }, 1000);

// // //     return () => {
// // //       svg.selectAll("*").remove();
// // //     };
// // //   }, [data]);

// // //   return (
// // //     <svg
// // //       ref={svgRef}
// // //       width="95vw"
// // //       height="90vh"
// // //       className="bg-gray-50"
// // //     >
// // //       <style>{`
// // //         .link {
// // //           fill: none;
// // //           stroke: ${COLORS.link};
// // //           stroke-width: 1.5px;
// // //         }
// // //         .node text {
// // //           font-size: 12px;
// // //           font-weight: 500;
// // //         }
// // //         .text-group text {
// // //           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
// // //         }
// // //         .state-details {
// // //           pointer-events: all;
// // //         }
// // //         .state-details text {
// // //           user-select: none;
// // //         }
// // //       `}</style>
// // //     </svg>
// // //   );
// // // };

// // // export default Dendrogram;

// // // /*
// // // VISUALIZATION CONFIGURATION:
// // // --------------------------
// // // 1. Node Display:
// // //    - Rounded rectangles with dynamic sizing
// // //    - Smart text truncation for names > 15 characters
// // //    - Hover tooltips for full names
// // //    - Visual indicators for truncated names
// // //    - Depth-based sizing and colors

// // // 2. Layout:
// // //    - Optimized for 5+ levels deep
// // //    - Handles 2-10 siblings per level
// // //    - Responsive spacing
// // //    - Enhanced sibling separation

// // // 3. Color Scheme:
// // //    - Initial pink-to-yellow transition
// // //    - Depth-based gradient afterwards
// // //    - High contrast text
// // //    - Subtle shadows for depth
// // // */

// // // import React, { useRef, useEffect } from "react";
// // // import { createRoot } from "react-dom/client";
// // // import * as d3 from "d3";
// // // import AppHeader from './AppHeader';

// // // // Configuration constants
// // // const COLORS = {
// // //   initial: "#ff69b4",       // Starting pink
// // //   transition: "#ffeb3b",    // Transition yellow
// // //   depths: [                 // Final depth-based colors
// // //     "#ffb74d",             // Root (Level 0)
// // //     "#ffa726",             // Level 1
// // //     "#ff9800",             // Level 2
// // //     "#fb8c00",             // Level 3
// // //     "#f57c00",             // Level 4
// // //     "#ef6c00"              // Level 5+
// // //   ],
// // //   text: {
// // //     primary: "#1a237e",    // Dark blue for filenames
// // //     secondary: "#2e7d32",  // Dark green for type
// // //     tertiary: "#1565c0"    // Blue for state
// // //   },
// // //   link: "rgba(85, 85, 85, 0.4)", // Semi-transparent connections
// // //   truncation: "#e91e63"     // Pink indicator for truncated names
// // // };

// // // const NODE_CONFIG = {
// // //   baseWidth: 130,           // Base node width
// // //   baseHeight: 70,           // Base node height
// // //   depthScale: 0.9,         // Size reduction per level
// // //   minScale: 0.6,           // Minimum size (60% of base)
// // //   cornerRadius: 10,         // Rounded corner radius
// // //   textTruncateLength: 15,   // Max characters before truncation
// // //   verticalSpacing: 120,     // Vertical distance between levels
// // //   horizontalSpacing: 40     // Minimum horizontal distance between siblings
// // // };

// // // function calculateComponentStats(data) {
// // //   let functionalCount = 0;
// // //   let classCount = 0;
// // //   let nullCount = 0;

// // //   function traverse(node) {
// // //     if (node.type === 'FunctionComponent') functionalCount++;
// // //     else if (node.type === 'ClassComponent') classCount++;
// // //     else nullCount++;

// // //     if (node.children) {
// // //       node.children.forEach(traverse);
// // //     }
// // //   }

// // //   traverse(data);

// // //   const totalComponents = Math.max(1, functionalCount + classCount + nullCount);

// // //   return {
// // //     functionalCount,
// // //     classCount,
// // //     nullCount,
// // //     totalComponents
// // //   };
// // // }

// // // // Window event listener for data
// // // window.addEventListener("message", (event) => {
// // //   if (event.data.type === "astData") {
// // //     const astData = event.data.payload;
// // //     const stats = calculateComponentStats(astData);
// // //     const container = document.getElementById("root");
// // //     const root = createRoot(container);

// // //     root.render(
// // //       <div className="h-screen w-screen">
// // //         <AppHeader
// // //           stats={stats}
// // //           appName="react-swipeable-views"
// // //           filePath="/src/App.tsx"
// // //         />
// // //         <Dendrogram data={astData} />
// // //       </div>
// // //     );
// // //   }
// // // });

// // // const Dendrogram = ({ data }) => {
// // //   const svgRef = useRef();

// // //   useEffect(() => {
// // //     if (!svgRef.current) return;

// // //     const svg = d3.select(svgRef.current);
// // //     const margin = { top: 80, right: 20, bottom: 20, left: 20 };
// // //     const width = window.innerWidth - margin.left - margin.right;
// // //     const height = window.innerHeight - margin.top - margin.bottom;

// // //     // Tree layout configuration
// // //     const tree = d3
// // //       .tree()
// // //       .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
// // //       .separation((a, b) => {
// // //         return a.parent === b.parent ? 1.2 : 2.4;
// // //       });

// // //     const root = d3.hierarchy(data);
// // //     root.descendants().forEach((d) => (d._children = d.children));

// // //     // Zoom behavior
// // //     const zoom = d3.zoom()
// // //       .scaleExtent([0.1, 2])
// // //       .on("zoom", (event) => {
// // //         g.attr("transform", event.transform);
// // //       });

// // //     svg.call(zoom);

// // //     const g = svg.append("g");

// // //     // Helper functions
// // //     const getNodeSize = (depth) => {
// // //       const scale = Math.max(
// // //         NODE_CONFIG.minScale,
// // //         Math.pow(NODE_CONFIG.depthScale, depth)
// // //       );
// // //       return {
// // //         width: NODE_CONFIG.baseWidth * scale,
// // //         height: NODE_CONFIG.baseHeight * scale
// // //       };
// // //     };

// // //     const formatNodeName = (name) => {
// // //       if (name.length <= NODE_CONFIG.textTruncateLength) {
// // //         return { display: name, truncated: false };
// // //       }
// // //       return {
// // //         display: `${name.slice(0, NODE_CONFIG.textTruncateLength - 3)}...`,
// // //         truncated: true
// // //       };
// // //     };

// // //     function update(source) {
// // //       tree(root);
// // //       const nodes = root.descendants();
// // //       const links = root.links();

// // //       // Update links
// // //       const link = g
// // //         .selectAll(".link")
// // //         .data(links, d => d.target.data.file);

// // //       const linkEnter = link
// // //         .enter()
// // //         .append("path")
// // //         .attr("class", "link")
// // //         .attr("d", d3.linkVertical()
// // //           .x(d => d.x)
// // //           .y(d => d.y)
// // //         );

// // //       link.merge(linkEnter)
// // //         .transition()
// // //         .duration(750)
// // //         .attr("d", d3.linkVertical()
// // //           .x(d => d.x)
// // //           .y(d => d.y)
// // //         );

// // //       link.exit()
// // //         .transition()
// // //         .duration(750)
// // //         .remove();

// // //       // Update nodes
// // //       const node = g
// // //         .selectAll(".node")
// // //         .data(nodes, d => d.data.file);

// // //       const nodeEnter = node
// // //         .enter()
// // //         .append("g")
// // //         .attr("class", "node")
// // //         .attr("transform", d => `translate(${source.x0 || d.x},${source.y0 || d.y})`)
// // //         .on("click", (event, d) => {
// // //           d.children = d.children ? null : d._children;
// // //           update(d);
// // //         });

// // //       // Add node rectangles
// // //       nodeEnter.each(function(d) {
// // //         const nodeSize = getNodeSize(d.depth);
// // //         const depth = Math.min(d.depth, COLORS.depths.length - 1);

// // //         // Background rectangle
// // //         d3.select(this)
// // //           .append("rect")
// // //           .attr("x", -nodeSize.width / 2)
// // //           .attr("y", -nodeSize.height / 2)
// // //           .attr("width", nodeSize.width)
// // //           .attr("height", nodeSize.height)
// // //           .attr("rx", NODE_CONFIG.cornerRadius)
// // //           .attr("ry", NODE_CONFIG.cornerRadius)
// // //           .style("fill", COLORS.initial)
// // //           .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))");

// // //         // Format node name
// // //         const { display, truncated } = formatNodeName(d.data.file);

// // //         // Main text group
// // //         const textGroup = d3.select(this)
// // //           .append("g")
// // //           .attr("class", "text-group");

// // //         // Filename
// // //         textGroup
// // //           .append("text")
// // //           .attr("y", -nodeSize.height / 4)
// // //           .attr("text-anchor", "middle")
// // //           .style("fill", COLORS.text.primary)
// // //           .text(display);

// // //         // Truncation indicator
// // //         if (truncated) {
// // //           textGroup
// // //             .append("circle")
// // //             .attr("cx", nodeSize.width / 2 - 8)
// // //             .attr("cy", -nodeSize.height / 4)
// // //             .attr("r", 3)
// // //             .style("fill", COLORS.truncation);
// // //         }

// // //         // Type
// // //         textGroup
// // //           .append("text")
// // //           .attr("y", 0)
// // //           .attr("text-anchor", "middle")
// // //           .style("fill", COLORS.text.secondary)
// // //           .text(d.data.type);

// // //         // State count
// // //         textGroup
// // //           .append("text")
// // //           .attr("y", nodeSize.height / 4)
// // //           .attr("text-anchor", "middle")
// // //           .style("fill", COLORS.text.tertiary)
// // //           .style("cursor", "pointer")
// // //           .text(`State: ${d.data.state.length}`)
// // //           .on("click", function(event) {
// // //             event.stopPropagation();
// // //             showStateDetails(d, this);
// // //           });

// // //         // Tooltip for full name if truncated
// // //         if (truncated) {
// // //           textGroup
// // //             .append("title")
// // //             .text(d.data.file);
// // //         }
// // //       });

// // //       function showStateDetails(d, element) {
// // //         // Remove any existing state details
// // //         g.selectAll(".state-details").remove();

// // //         const stateDetails = g
// // //           .append("g")
// // //           .attr("class", "state-details")
// // //           .attr("transform", `translate(${d.x + 100},${d.y - 30})`);

// // //         stateDetails
// // //           .append("rect")
// // //           .attr("x", -170)
// // //           .attr("y", 80)
// // //           .attr("width", 150)
// // //           .attr("height", d.data.state.length * 20 + 20)
// // //           .attr("rx", 5)
// // //           .attr("ry", 5)
// // //           .style("fill", "#fff")
// // //           .style("stroke", COLORS.text.tertiary)
// // //           .style("stroke-width", "1px")
// // //           .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.1))");

// // //         // Close button
// // //         stateDetails
// // //           .append("text")
// // //           .attr("x", -35)
// // //           .attr("y", 95)
// // //           .text("×")
// // //           .style("fill", COLORS.text.tertiary)
// // //           .style("cursor", "pointer")
// // //           .style("font-size", "16px")
// // //           .on("click", () => stateDetails.remove());

// // //         // State items
// // //         d.data.state.forEach((item, i) => {
// // //           stateDetails
// // //             .append("text")
// // //             .attr("x", -160)
// // //             .attr("y", i * 20 + 100)
// // //             .text(item)
// // //             .style("fill", COLORS.text.primary)
// // //             .style("font-size", "12px");
// // //         });
// // //       }

// // //       // Handle node updates
// // //       const nodeUpdate = nodeEnter.merge(node);

// // //       nodeUpdate
// // //         .transition()
// // //         .duration(750)
// // //         .attr("transform", d => `translate(${d.x},${d.y})`);

// // //       // Store node positions for transitions
// // //       nodes.forEach(d => {
// // //         d.x0 = d.x;
// // //         d.y0 = d.y;
// // //       });

// // //       // Handle removed nodes
// // //       node.exit()
// // //         .transition()
// // //         .duration(750)
// // //         .attr("transform", d => `translate(${source.x},${source.y})`)
// // //         .remove();

// // //       // Color transition
// // //       setTimeout(() => {
// // //         g.selectAll("rect")
// // //           .transition()
// // //           .duration(2000)
// // //           .style("fill", d => COLORS.depths[Math.min(d.depth, COLORS.depths.length - 1)]);
// // //       }, 1000);

// // //       return nodes;
// // //     }

// // // // Initial render
// // // const nodes = update(root);

// // // // Initial view positioning
// // // const initialTransform = d3.zoomIdentity
// // //   .translate(width / 2, height / 4)
// // //   .scale(0.8);

// // // svg.call(zoom.transform, initialTransform);

// // // // Zoom out animation after initial render
// // // setTimeout(() => {
// // //   svg.transition()
// // //     .duration(2000)
// // //     .call(zoom.transform, d3.zoomIdentity
// // //       .translate(width / 2, height / 6)
// // //       .scale(0.4)
// // //     );
// // // }, 1000);

// // // // Cleanup on unmount
// // // return () => {
// // //   svg.selectAll("*").remove();
// // // };
// // // }, [data]);

// // // return (
// // // <svg
// // //   ref={svgRef}
// // //   width="95vw"
// // //   height="90vh"
// // //   className="bg-gray-50"
// // // >
// // //   <style>{`
// // //     .link {
// // //       fill: none;
// // //       stroke: ${COLORS.link};
// // //       stroke-width: 1.5px;
// // //     }
// // //     .node text {
// // //       font-size: 12px;
// // //       font-weight: 500;
// // //     }
// // //     .text-group text {
// // //       font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
// // //     }
// // //     .state-details {
// // //       pointer-events: all;
// // //     }
// // //     .state-details text {
// // //       user-select: none;
// // //     }
// // //   `}</style>
// // // </svg>
// // // );
// // // };

// // // export default Dendrogram;
