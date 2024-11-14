import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

// Visual styling constants
const COLORS = {
  light: {
    background: "#ffffff",
    link: "rgba(85, 85, 85, 0.4)",
    text: {
      primary: "#1a237e",
      secondary: "#2e7d32",
      tertiary: "#1565c0",
    },
    depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
  },
  dark: {
    background: "#212121",
    link: "rgba(255, 255, 255, 0.4)",
    text: {
      primary: "#bbdefb",
      secondary: "#c8e6c9",
      tertiary: "#90caf9",
    },
    depths: ["#6d4c41", "#5d4037", "#4e342e", "#3e2723", "#181616", "#000000"],
  },
};

// Node layout configuration
const NODE_CONFIG = {
  baseWidth: 130,
  baseHeight: 70,
  cornerRadius: 10,
  textTruncateLength: 15,
};

const Dendrogram = ({ data }) => {
  const svgRef = useRef();
  const [darkMode, setDarkMode] = useState(true);
  let i = 0; // Initialize node ID counter

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set background color based on theme
    svg.style("background", darkMode ? COLORS.dark.background : COLORS.light.background);

    const colorScheme = darkMode ? COLORS.dark : COLORS.light;

    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

    const tree = d3
      .tree()
      // Adjust nodeSize to increase vertical spacing
      .nodeSize([NODE_CONFIG.baseWidth * 1.5, NODE_CONFIG.baseHeight * 4]) // Increase vertical spacing
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5)); // Adjust separation

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);

    // Create hierarchy and store initial children state
    const root = d3.hierarchy(data);
    root.x0 = 0;
    root.y0 = 0;

    root.descendants().forEach((d) => {
      d._children = d.children;
      // Optionally, collapse nodes here if you want
      // d.children = null;
    });

    // Function to update the tree
    function update(source) {
      const duration = 750;

      // Assigns the x and y position for the nodes
      const treeData = tree(root);

      // Compute the new tree layout
      const nodes = treeData.descendants();
      const links = treeData.links();

      // Normalize for fixed-depth (adjusted depth factor)
      nodes.forEach((d) => (d.y = d.depth * 200)); // Increase depth spacing

      /** Nodes Section **/

      // Update the nodes...
      const node = g.selectAll("g.node").data(nodes, (d) => d.id || (d.id = ++i));

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${source.x0},${source.y0})`)
        .on("click", (event, d) => {
          // Toggle children on click
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(d);
        });

      // Add rectangles for the nodes
      nodeEnter
        .append("rect")
        .attr("class", "node")
        .attr("x", -NODE_CONFIG.baseWidth / 2)
        .attr("y", -NODE_CONFIG.baseHeight / 2)
        .attr("width", NODE_CONFIG.baseWidth)
        .attr("height", NODE_CONFIG.baseHeight)
        .attr("rx", NODE_CONFIG.cornerRadius)
        .style("fill", (d) => {
          const depth = (d.depth % (colorScheme.depths.length));
          return colorScheme.depths[depth];
        });

      // Add text to the nodes
      const textGroup = nodeEnter.append("g").attr("class", "text-group");

      // Component name
      const fileName = (d) => d.data.file || "Unnamed";
      const truncatedName = (d) =>
        fileName(d).length > NODE_CONFIG.textTruncateLength
          ? `${fileName(d).slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
          : fileName(d);

      textGroup
        .append("text")
        .attr("dy", "-0.6em")
        .attr("text-anchor", "middle")
        .style("fill", colorScheme.text.primary)
        .text((d) => truncatedName(d));

      // Add tooltip for truncated names
      textGroup
        .append("title")
        .text((d) => (truncatedName(d) !== fileName(d) ? fileName(d) : ""));

      // Component type
      textGroup
        .append("text")
        .attr("dy", "0.7em")
        .attr("text-anchor", "middle")
        .style("fill", colorScheme.text.secondary)
        .text((d) => d.data.type || "Unknown");

      // State count
      textGroup
        .append("text")
        .attr("dy", "1.9em")
        .attr("text-anchor", "middle")
        .style("fill", colorScheme.text.tertiary)
        .text((d) => `State: ${d.data.state ? d.data.state.length : 0}`);

      // UPDATE
      const nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the nodes
      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      // Remove any exiting nodes
      const nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${source.x},${source.y})`)
        .remove();

      // On exit reduce the node rectangles size to 0
      nodeExit.select("rect").attr("width", 0).attr("height", 0);

      /** Links Section **/

      // Update the links...
      const link = g.selectAll("path.link").data(links, (d) => d.target.id);

      // Enter any new links at the parent's previous position.
      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", () => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        })
        .style("fill", "none")
        .style("stroke", colorScheme.link)
        .style("stroke-width", "1.5px");

      // UPDATE
      const linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate
        .transition()
        .duration(duration)
        .attr("d", (d) => diagonal(d.source, d.target));

      // Remove any exiting links
      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", () => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Store the old positions for transition.
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      return `M ${s.x},${s.y}
              C ${(s.x + d.x) / 2},${s.y}
                ${(s.x + d.x) / 2},${d.y}
                ${d.x},${d.y}`;
    }

    // Start the visualization with a zoom-in effect
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(2));

    // Initial update to render the tree
    update(root);

    // Animate zoom-out to fit the tree
    svg
      .transition()
      .duration(2000)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, 50).scale(0.8),
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );

    // Cleanup function
    return () => {
      svg.selectAll("*").remove();
    };
  }, [data, darkMode]);

  return (
    <div>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <svg ref={svgRef} width="100vw" height="100vh">
        <style>{`
          .node rect {
            cursor: pointer;
            stroke-width: 1.5px;
          }
          .node text {
            font-size: 12px;
            font-family: sans-serif;
          }
          .link {
            fill: none;
            stroke-width: 1.5px;
          }
        `}</style>
      </svg>
    </div>
  );
};

export default Dendrogram;


// import React, { useRef, useEffect, useState } from "react";
// import * as d3 from "d3";

// // Visual styling constants
// const COLORS = {
//   light: {
//     background: "#ffffff",
//     link: "rgba(85, 85, 85, 0.4)",
//     text: {
//       primary: "#1a237e",
//       secondary: "#2e7d32",
//       tertiary: "#1565c0",
//     },
//     depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
//   },
//   dark: {
//     background: "#212121",
//     link: "rgba(255, 255, 255, 0.4)",
//     text: {
//       primary: "#bbdefb",
//       secondary: "#c8e6c9",
//       tertiary: "#90caf9",
//     },
//     depths: ["#6d4c41", "#5d4037", "#4e342e", "#3e2723", "#212121", "#000000"],
//   },
// };

// // Node layout configuration
// const NODE_CONFIG = {
//   baseWidth: 130,
//   baseHeight: 70,
//   cornerRadius: 10,
//   textTruncateLength: 15,
// };

// const Dendrogram = ({ data }) => {
//   const svgRef = useRef();
//   const [darkMode, setDarkMode] = useState(false);
//   let i = 0; // Initialize node ID counter

//   useEffect(() => {
//     if (!svgRef.current) return;

//     // Clear previous SVG content
//     d3.select(svgRef.current).selectAll("*").remove();

//     const svg = d3.select(svgRef.current);
//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     // Set background color based on theme
//     svg.style("background", darkMode ? COLORS.dark.background : COLORS.light.background);

//     const colorScheme = darkMode ? COLORS.dark : COLORS.light;

//     const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

//     const tree = d3
//       .tree()
//       .nodeSize([NODE_CONFIG.baseWidth * 1.5, NODE_CONFIG.baseHeight * 2])
//       .separation((a, b) => (a.parent === b.parent ? 1 : 2));

//     const zoom = d3
//       .zoom()
//       .scaleExtent([0.1, 2])
//       .on("zoom", (event) => g.attr("transform", event.transform));

//     svg.call(zoom);

//     // Create hierarchy and store initial children state
//     const root = d3.hierarchy(data);
//     root.x0 = 0;
//     root.y0 = 0;

//     root.descendants().forEach((d) => {
//       d._children = d.children;
//       // Optionally, collapse nodes here if you want
//       // d.children = null;
//     });

//     // Function to update the tree
//     function update(source) {
//       const duration = 750;

//       // Assigns the x and y position for the nodes
//       const treeData = tree(root);

//       // Compute the new tree layout
//       const nodes = treeData.descendants();
//       const links = treeData.links();

//       // Normalize for fixed-depth
//       nodes.forEach((d) => (d.y = d.depth * 180));

//       /** Nodes Section **/

//       // Update the nodes...
//       const node = g.selectAll("g.node").data(nodes, (d) => d.id || (d.id = ++i));

//       // Enter any new nodes at the parent's previous position.
//       const nodeEnter = node
//         .enter()
//         .append("g")
//         .attr("class", "node")
//         .attr("transform", (d) => `translate(${source.x0},${source.y0})`)
//         .on("click", (event, d) => {
//           // Toggle children on click
//           if (d.children) {
//             d._children = d.children;
//             d.children = null;
//           } else {
//             d.children = d._children;
//             d._children = null;
//           }
//           update(d);
//         });

//       // Add rectangles for the nodes
//       nodeEnter
//         .append("rect")
//         .attr("class", "node")
//         .attr("x", -NODE_CONFIG.baseWidth / 2)
//         .attr("y", -NODE_CONFIG.baseHeight / 2)
//         .attr("width", NODE_CONFIG.baseWidth)
//         .attr("height", NODE_CONFIG.baseHeight)
//         .attr("rx", NODE_CONFIG.cornerRadius)
//         .style("fill", (d) => {
//           const depth = Math.min(d.depth, colorScheme.depths.length - 1);
//           return colorScheme.depths[depth];
//         });

//       // Add text to the nodes
//       const textGroup = nodeEnter.append("g").attr("class", "text-group");

//       // Component name
//       const fileName = (d) => d.data.file || "Unnamed";
//       const truncatedName = (d) =>
//         fileName(d).length > NODE_CONFIG.textTruncateLength
//           ? `${fileName(d).slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
//           : fileName(d);

//       textGroup
//         .append("text")
//         .attr("dy", "-0.6em")
//         .attr("text-anchor", "middle")
//         .style("fill", colorScheme.text.primary)
//         .text((d) => truncatedName(d));

//       // Add tooltip for truncated names
//       textGroup
//         .append("title")
//         .text((d) => (truncatedName(d) !== fileName(d) ? fileName(d) : ""));

//       // Component type
//       textGroup
//         .append("text")
//         .attr("dy", "0em")
//         .attr("text-anchor", "middle")
//         .style("fill", colorScheme.text.secondary)
//         .text((d) => d.data.type || "Unknown");

//       // State count
//       textGroup
//         .append("text")
//         .attr("dy", "1.2em")
//         .attr("text-anchor", "middle")
//         .style("fill", colorScheme.text.tertiary)
//         .text((d) => `State: ${d.data.state ? d.data.state.length : 0}`);

//       // UPDATE
//       const nodeUpdate = nodeEnter.merge(node);

//       // Transition to the proper position for the nodes
//       nodeUpdate
//         .transition()
//         .duration(duration)
//         .attr("transform", (d) => `translate(${d.x},${d.y})`);

//       // Remove any exiting nodes
//       const nodeExit = node
//         .exit()
//         .transition()
//         .duration(duration)
//         .attr("transform", (d) => `translate(${source.x},${source.y})`)
//         .remove();

//       // On exit reduce the node rectangles size to 0
//       nodeExit.select("rect").attr("width", 0).attr("height", 0);

//       /** Links Section **/

//       // Update the links...
//       const link = g.selectAll("path.link").data(links, (d) => d.target.id);

//       // Enter any new links at the parent's previous position.
//       const linkEnter = link
//         .enter()
//         .insert("path", "g")
//         .attr("class", "link")
//         .attr("d", () => {
//           const o = { x: source.x0, y: source.y0 };
//           return diagonal(o, o);
//         })
//         .style("fill", "none")
//         .style("stroke", colorScheme.link)
//         .style("stroke-width", "1.5px");

//       // UPDATE
//       const linkUpdate = linkEnter.merge(link);

//       // Transition back to the parent element position
//       linkUpdate
//         .transition()
//         .duration(duration)
//         .attr("d", (d) => diagonal(d.source, d.target));

//       // Remove any exiting links
//       link
//         .exit()
//         .transition()
//         .duration(duration)
//         .attr("d", () => {
//           const o = { x: source.x, y: source.y };
//           return diagonal(o, o);
//         })
//         .remove();

//       // Store the old positions for transition.
//       nodes.forEach((d) => {
//         d.x0 = d.x;
//         d.y0 = d.y;
//       });
//     }

//     // Creates a curved (diagonal) path from parent to the child nodes
//     function diagonal(s, d) {
//       return `M ${s.x},${s.y}
//               C ${(s.x + d.x) / 2},${s.y}
//                 ${(s.x + d.x) / 2},${d.y}
//                 ${d.x},${d.y}`;
//     }

//     // Start the visualization with a zoom-in effect
//     svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(2));

//     // Initial update to render the tree
//     update(root);

//     // Animate zoom-out to fit the tree
//     svg
//       .transition()
//       .duration(2000)
//       .call(
//         zoom.transform,
//         d3.zoomIdentity.translate(width / 2, 50).scale(0.8),
//         d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
//       );

//     // Cleanup function
//     return () => {
//       svg.selectAll("*").remove();
//     };
//   }, [data, darkMode]);

//   return (
//     <div>
//       {/* Dark Mode Toggle */}
//       <button
//         onClick={() => setDarkMode((prev) => !prev)}
//         style={{
//           position: "absolute",
//           top: 10,
//           right: 10,
//           zIndex: 1,
//           padding: "10px 20px",
//           cursor: "pointer",
//         }}
//       >
//         {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//       </button>
//       <svg ref={svgRef} width="100vw" height="100vh">
//         <style>{`
//           .node rect {
//             cursor: pointer;
//             stroke-width: 1.5px;
//           }
//           .node text {
//             font-size: 12px;
//             font-family: sans-serif;
//           }
//           .link {
//             fill: none;
//             stroke-width: 1.5px;
//           }
//         `}</style>
//       </svg>
//     </div>
//   );
// };

// export default Dendrogram;


// // import React, { useRef, useEffect, useState } from "react";
// // import * as d3 from "d3";

// // // Visual styling constants
// // const COLORS = {
// //   light: {
// //     background: "#ffffff",
// //     link: "rgba(85, 85, 85, 0.4)",
// //     text: {
// //       primary: "#1a237e",
// //       secondary: "#2e7d32",
// //       tertiary: "#1565c0",
// //     },
// //     depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
// //   },
// //   dark: {
// //     background: "#212121",
// //     link: "rgba(255, 255, 255, 0.4)",
// //     text: {
// //       primary: "#bbdefb",
// //       secondary: "#c8e6c9",
// //       tertiary: "#90caf9",
// //     },
// //     depths: ["#6d4c41", "#5d4037", "#4e342e", "#3e2723", "#212121", "#000000"],
// //   },
// // };

// // // Node layout configuration
// // const NODE_CONFIG = {
// //   baseWidth: 130,
// //   baseHeight: 70,
// //   cornerRadius: 10,
// //   textTruncateLength: 15,
// // };

// // const Dendrogram = ({ data }) => {
// //   const svgRef = useRef();
// //   const [darkMode, setDarkMode] = useState(false);

// //   useEffect(() => {
// //     if (!svgRef.current) return;

// //     // Clear previous SVG content
// //     d3.select(svgRef.current).selectAll("*").remove();

// //     const svg = d3.select(svgRef.current);
// //     const width = window.innerWidth;
// //     const height = window.innerHeight;

// //     // Set background color based on theme
// //     svg.style("background", darkMode ? COLORS.dark.background : COLORS.light.background);

// //     const colorScheme = darkMode ? COLORS.dark : COLORS.light;

// //     const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

// //     const tree = d3
// //       .tree()
// //       .nodeSize([NODE_CONFIG.baseWidth * 1.5, NODE_CONFIG.baseHeight * 2])
// //       .separation((a, b) => (a.parent === b.parent ? 1 : 2));

// //     const zoom = d3
// //       .zoom()
// //       .scaleExtent([0.1, 2])
// //       .on("zoom", (event) => g.attr("transform", event.transform));

// //     svg.call(zoom);

// //     // Create hierarchy and store initial children state
// //     const root = d3.hierarchy(data);
// //     root.x0 = 0;
// //     root.y0 = 0;

// //     root.descendants().forEach((d) => {
// //       d._children = d.children;
// //       // Optionally, collapse nodes here if you want
// //       // d.children = null;
// //     });

// //     // Function to update the tree
// //     function update(source) {
// //       const duration = 750;

// //       // Assigns the x and y position for the nodes
// //       const treeData = tree(root);

// //       // Compute the new tree layout
// //       const nodes = treeData.descendants();
// //       const links = treeData.links();

// //       // Normalize for fixed-depth
// //       nodes.forEach((d) => (d.y = d.depth * 180));

// //       /** Nodes Section **/

// //       // Update the nodes...
// //       const node = g.selectAll("g.node").data(nodes, (d) => d.id || (d.id = ++i));

// //       // Enter any new modes at the parent's previous position.
// //       const nodeEnter = node
// //         .enter()
// //         .append("g")
// //         .attr("class", "node")
// //         .attr("transform", (d) => `translate(${source.x0},${source.y0})`)
// //         .on("click", (event, d) => {
// //           // Toggle children on click
// //           if (d.children) {
// //             d._children = d.children;
// //             d.children = null;
// //           } else {
// //             d.children = d._children;
// //             d._children = null;
// //           }
// //           update(d);
// //         });

// //       // Add rectangles for the nodes
// //       nodeEnter
// //         .append("rect")
// //         .attr("class", "node")
// //         .attr("x", -NODE_CONFIG.baseWidth / 2)
// //         .attr("y", -NODE_CONFIG.baseHeight / 2)
// //         .attr("width", NODE_CONFIG.baseWidth)
// //         .attr("height", NODE_CONFIG.baseHeight)
// //         .attr("rx", NODE_CONFIG.cornerRadius)
// //         .style("fill", (d) => {
// //           const depth = Math.min(d.depth, colorScheme.depths.length - 1);
// //           return colorScheme.depths[depth];
// //         });

// //       // Add text to the nodes
// //       const textGroup = nodeEnter.append("g").attr("class", "text-group");

// //       // Component name
// //       const fileName = (d) => d.data.file || "Unnamed";
// //       const truncatedName = (d) =>
// //         fileName(d).length > NODE_CONFIG.textTruncateLength
// //           ? `${fileName(d).slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
// //           : fileName(d);

// //       textGroup
// //         .append("text")
// //         .attr("dy", "-0.6em")
// //         .attr("text-anchor", "middle")
// //         .style("fill", colorScheme.text.primary)
// //         .text((d) => truncatedName(d));

// //       // Add tooltip for truncated names
// //       textGroup
// //         .append("title")
// //         .text((d) => (truncatedName(d) !== fileName(d) ? fileName(d) : ""));

// //       // Component type
// //       textGroup
// //         .append("text")
// //         .attr("dy", "0em")
// //         .attr("text-anchor", "middle")
// //         .style("fill", colorScheme.text.secondary)
// //         .text((d) => d.data.type || "Unknown");

// //       // State count
// //       textGroup
// //         .append("text")
// //         .attr("dy", "1.2em")
// //         .attr("text-anchor", "middle")
// //         .style("fill", colorScheme.text.tertiary)
// //         .text((d) => `State: ${d.data.state ? d.data.state.length : 0}`);

// //       // UPDATE
// //       const nodeUpdate = nodeEnter.merge(node);

// //       // Transition to the proper position for the nodes
// //       nodeUpdate
// //         .transition()
// //         .duration(duration)
// //         .attr("transform", (d) => `translate(${d.x},${d.y})`);

// //       // Remove any exiting nodes
// //       const nodeExit = node
// //         .exit()
// //         .transition()
// //         .duration(duration)
// //         .attr("transform", (d) => `translate(${source.x},${source.y})`)
// //         .remove();

// //       // On exit reduce the node circles size to 0
// //       nodeExit.select("rect").attr("width", 0).attr("height", 0);

// //       /** Links Section **/

// //       // Update the links...
// //       const link = g.selectAll("path.link").data(links, (d) => d.target.id);

// //       // Enter any new links at the parent's previous position.
// //       const linkEnter = link
// //         .enter()
// //         .insert("path", "g")
// //         .attr("class", "link")
// //         .attr("d", () => {
// //           const o = { x: source.x0, y: source.y0 };
// //           return diagonal(o, o);
// //         })
// //         .style("fill", "none")
// //         .style("stroke", colorScheme.link)
// //         .style("stroke-width", "1.5px");

// //       // UPDATE
// //       const linkUpdate = linkEnter.merge(link);

// //       // Transition back to the parent element position
// //       linkUpdate
// //         .transition()
// //         .duration(duration)
// //         .attr("d", (d) => diagonal(d.source, d.target));

// //       // Remove any exiting links
// //       link
// //         .exit()
// //         .transition()
// //         .duration(duration)
// //         .attr("d", () => {
// //           const o = { x: source.x, y: source.y };
// //           return diagonal(o, o);
// //         })
// //         .remove();

// //       // Store the old positions for transition.
// //       nodes.forEach((d) => {
// //         d.x0 = d.x;
// //         d.y0 = d.y;
// //       });
// //     }

// //     // Creates a curved (diagonal) path from parent to the child nodes
// //     function diagonal(s, d) {
// //       return `M ${s.x},${s.y}
// //               C ${(s.x + d.x) / 2},${s.y}
// //                 ${(s.x + d.x) / 2},${d.y}
// //                 ${d.x},${d.y}`;
// //     }

// //     // Start the visualization with a zoom-in effect
// //     svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(2));

// //     // Initial update to render the tree
// //     update(root);

// //     // Animate zoom-out to fit the tree
// //     svg
// //       .transition()
// //       .duration(2000)
// //       .call(
// //         zoom.transform,
// //         d3.zoomIdentity.translate(width / 2, 50).scale(0.8),
// //         d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
// //       );

// //     // Cleanup function
// //     return () => {
// //       svg.selectAll("*").remove();
// //     };
// //   }, [data, darkMode]);

// //   return (
// //     <div>
// //       {/* Dark Mode Toggle */}
// //       <button
// //         onClick={() => setDarkMode((prev) => !prev)}
// //         style={{
// //           position: "absolute",
// //           top: 10,
// //           right: 10,
// //           zIndex: 1,
// //           padding: "10px 20px",
// //           cursor: "pointer",
// //         }}
// //       >
// //         {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
// //       </button>
// //       <svg ref={svgRef} width="100vw" height="100vh">
// //         <style>{`
// //           .node rect {
// //             cursor: pointer;
// //             stroke-width: 1.5px;
// //           }
// //           .node text {
// //             font-size: 12px;
// //             font-family: sans-serif;
// //           }
// //           .link {
// //             fill: none;
// //             stroke-width: 1.5px;
// //           }
// //         `}</style>
// //       </svg>
// //     </div>
// //   );
// // };

// // export default Dendrogram;


// // // import React, { useRef, useEffect } from "react";
// // // import * as d3 from "d3";

// // // const COLORS = {
// // //   depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
// // //   text: {
// // //     primary: "#1a237e",
// // //     secondary: "#2e7d32",
// // //     tertiary: "#1565c0"
// // //   },
// // //   link: "rgba(85, 85, 85, 0.4)"
// // // };

// // // const NODE_CONFIG = {
// // //   baseWidth: 130,
// // //   baseHeight: 70,
// // //   cornerRadius: 10,
// // //   textTruncateLength: 15
// // // };

// // // const Dendrogram = ({ data }) => {
// // //   const svgRef = useRef();

// // //   useEffect(() => {
// // //     if (!svgRef.current) return;

// // //     const svg = d3.select(svgRef.current);
// // //     const width = window.innerWidth;
// // //     const height = window.innerHeight;

// // //     const tree = d3.tree()
// // //       .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
// // //       .separation((a, b) => (a.parent === b.parent ? 1.2 : 2.4));

// // //     // Create hierarchy and STORE initial children state
// // //     const root = d3.hierarchy(data);
// // //     root.x0 = 0;
// // //     root.y0 = 0;
    
// // //     // Store initial children state for ALL nodes
// // //     root.descendants().forEach(d => {
// // //       d._children = d.children;  // Backup the initial children
// // //       d.x0 = 0;                 // Set initial positions
// // //       d.y0 = 0;
// // //     });

// // //     const g = svg.append("g");

// // //     const zoom = d3.zoom()
// // //       .scaleExtent([0.1, 2])
// // //       .on("zoom", (event) => g.attr("transform", event.transform));
// // //     svg.call(zoom);

// // //     function update(source) {
// // //       tree(root);

// // //       const nodes = root.descendants();
// // //       const links = root.links();

// // //       // Update the nodes
// // //       const node = g.selectAll("g.node")
// // //         .data(nodes, d => d.data.file);

// // //       // Enter new nodes at parent's previous position
// // //       const nodeEnter = node.enter().append("g")
// // //         .attr("class", "node")
// // //         .attr("transform", d => `translate(${source.x0},${source.y0})`);

// // //       // Add Node Rectangle
// // //       nodeEnter.append("rect")
// // //         .attr("x", -NODE_CONFIG.baseWidth / 2)
// // //         .attr("y", -NODE_CONFIG.baseHeight / 2)
// // //         .attr("width", NODE_CONFIG.baseWidth)
// // //         .attr("height", NODE_CONFIG.baseHeight)
// // //         .attr("rx", NODE_CONFIG.cornerRadius)
// // //         .style("fill", d => {
// // //           const depth = Math.min(d.depth, COLORS.depths.length - 1);
// // //           return COLORS.depths[depth];
// // //         });

// // //       // Add Click Handler
// // //       nodeEnter.on("click", (event, d) => {
// // //         if (d.children) {
// // //           d._children = d.children;
// // //           d.children = null;
// // //         } else {
// // //           d.children = d._children;
// // //           d._children = null;
// // //         }
// // //         update(d);
// // //       });

// // //       // Add text group
// // //       const textGroup = nodeEnter.append("g")
// // //         .attr("class", "text-group");

// // //       // Add file name
// // //       textGroup.append("text")
// // //         .attr("y", -NODE_CONFIG.baseHeight / 4)
// // //         .attr("text-anchor", "middle")
// // //         .style("fill", COLORS.text.primary)
// // //         .text(d => {
// // //           const fileName = d.data.file || "Unnamed";
// // //           return fileName.length > NODE_CONFIG.textTruncateLength
// // //             ? fileName.substring(0, NODE_CONFIG.textTruncateLength - 3) + "..."
// // //             : fileName;
// // //         });

// // //       // Add component type
// // //       textGroup.append("text")
// // //         .attr("y", 0)
// // //         .attr("text-anchor", "middle")
// // //         .style("fill", COLORS.text.secondary)
// // //         .text(d => d.data.type || "Unknown");

// // //       // Add state count
// // //       textGroup.append("text")
// // //         .attr("y", NODE_CONFIG.baseHeight / 4)
// // //         .attr("text-anchor", "middle")
// // //         .style("fill", COLORS.text.tertiary)
// // //         .text(d => `State: ${d.data.state ? d.data.state.length : 0}`);

// // //       // Update all nodes to new position with transition
// // //       const nodeUpdate = nodeEnter.merge(node);
// // //       nodeUpdate.transition()
// // //         .duration(750)
// // //         .attr("transform", d => `translate(${d.x},${d.y})`);

// // //       // Remove old nodes
// // //       const nodeExit = node.exit()
// // //         .transition()
// // //         .duration(750)
// // //         .attr("transform", d => `translate(${source.x},${source.y})`)
// // //         .remove();

// // //       // Update the links
// // //       const link = g.selectAll("path.link")
// // //         .data(links, d => d.target.data.file);

// // //       // Enter new links at parent's previous position
// // //       const linkEnter = link.enter().insert("path", "g")
// // //         .attr("class", "link")
// // //         .attr("d", d3.linkVertical()
// // //           .x(d => d.x)
// // //           .y(d => d.y));

// // //       // Update link positions with transition
// // //       link.merge(linkEnter)
// // //         .transition()
// // //         .duration(750)
// // //         .attr("d", d3.linkVertical()
// // //           .x(d => d.x)
// // //           .y(d => d.y));

// // //       // Remove old links with transition
// // //       link.exit()
// // //         .transition()
// // //         .duration(750)
// // //         .attr("d", d3.linkVertical()
// // //           .x(() => source.x)
// // //           .y(() => source.y))
// // //         .remove();

// // //       // Store the old positions for transition
// // //       nodes.forEach(d => {
// // //         d.x0 = d.x;
// // //         d.y0 = d.y;
// // //       });
// // //     }

// // //     // Initial render
// // //     update(root);

// // //     // Initial position
// // //     const initialTransform = d3.zoomIdentity
// // //       .translate(width / 2, height / 4)
// // //       .scale(0.8);
// // //     svg.call(zoom.transform, initialTransform);

// // //     // Cleanup
// // //     return () => svg.selectAll("*").remove();
// // //   }, [data]);

// // //   return (
// // //     <svg
// // //       ref={svgRef}
// // //       width="100vw"
// // //       height="100vh"
// // //       style={{ background: "#f0f0f0" }}
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
// // //       `}</style>
// // //     </svg>
// // //   );
// // // };

// // // export default Dendrogram;

// // // // import React, { useRef, useEffect } from "react";
// // // // import * as d3 from "d3";

// // // // // Visual styling constants
// // // // const COLORS = {
// // // //   depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
// // // //   text: {
// // // //     primary: "#1a237e",    // Component names
// // // //     secondary: "#2e7d32",  // Component types
// // // //     tertiary: "#1565c0"    // State info
// // // //   },
// // // //   link: "rgba(85, 85, 85, 0.4)"
// // // // };

// // // // // Node layout configuration
// // // // const NODE_CONFIG = {
// // // //   baseWidth: 130,
// // // //   baseHeight: 70,
// // // //   cornerRadius: 10,
// // // //   textTruncateLength: 15,
// // // // };

// // // // const Dendrogram = ({ data }) => {
// // // //   const svgRef = useRef();

// // // //   useEffect(() => {
// // // //     if (!svgRef.current) return;

// // // //     // Set up SVG container
// // // //     const svg = d3.select(svgRef.current);
// // // //     const width = window.innerWidth;
// // // //     const height = window.innerHeight;

// // // //     // Configure tree layout
// // // //     const tree = d3.tree()
// // // //       .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
// // // //       .separation((a, b) => (a.parent === b.parent ? 1.2 : 2.4));

// // // //     // Create hierarchy and store initial children state
// // // //     const root = d3.hierarchy(data);
// // // //     root.descendants().forEach(d => {
// // // //       d._children = d.children;
// // // //     });

// // // //     // Create main group for zooming
// // // //     const g = svg.append("g");

// // // //     // Set up zoom behavior
// // // //     const zoom = d3.zoom()
// // // //       .scaleExtent([0.1, 2])
// // // //       .on("zoom", (event) => g.attr("transform", event.transform));
// // // //     svg.call(zoom);

// // // //     function update(source) {
// // // //       // Compute the new tree layout
// // // //       tree(root);
// // // //       const nodes = root.descendants();
// // // //       const links = root.links();

// // // //       // Update links
// // // //       const link = g.selectAll(".link")
// // // //         .data(links, d => d.target.data.file);

// // // //       link.enter()
// // // //         .append("path")
// // // //         .attr("class", "link")
// // // //         .attr("d", d3.linkVertical()
// // // //           .x(d => d.x)
// // // //           .y(d => d.y)
// // // //         );

// // // //       link.exit().remove();

// // // //       // Update nodes
// // // //       const node = g.selectAll(".node")
// // // //         .data(nodes, d => d.data.file);

// // // //       const nodeEnter = node.enter()
// // // //         .append("g")
// // // //         .attr("class", "node")
// // // //         .attr("transform", d => `translate(${source.x0 || d.x},${source.y0 || d.y})`)
// // // //         .on("click", (event, d) => {
// // // //           if (d.children) {
// // // //             d._children = d.children;
// // // //             d.children = null;
// // // //           } else {
// // // //             d.children = d._children;
// // // //             d._children = null;
// // // //           }
// // // //           update(d);
// // // //         });

// // // //       // Add visual elements to nodes
// // // //       nodeEnter.each(function(d) {
// // // //         const depth = Math.min(d.depth, COLORS.depths.length - 1);
        
// // // //         // Add rectangle background
// // // //         d3.select(this)
// // // //           .append("rect")
// // // //           .attr("x", -NODE_CONFIG.baseWidth / 2)
// // // //           .attr("y", -NODE_CONFIG.baseHeight / 2)
// // // //           .attr("width", NODE_CONFIG.baseWidth)
// // // //           .attr("height", NODE_CONFIG.baseHeight)
// // // //           .attr("rx", NODE_CONFIG.cornerRadius)
// // // //           .style("fill", COLORS.depths[depth]);

// // // //         // Add text elements
// // // //         const textGroup = d3.select(this)
// // // //           .append("g")
// // // //           .attr("class", "text-group");

// // // //         // Component name
// // // //         const fileName = d.data.file || "Unnamed";
// // // //         const truncatedName = fileName.length > NODE_CONFIG.textTruncateLength
// // // //           ? `${fileName.slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
// // // //           : fileName;

// // // //         textGroup.append("text")
// // // //           .attr("y", -NODE_CONFIG.baseHeight / 4)
// // // //           .attr("text-anchor", "middle")
// // // //           .style("fill", COLORS.text.primary)
// // // //           .text(truncatedName);

// // // //         // Add tooltip for truncated names
// // // //         if (truncatedName !== fileName) {
// // // //           textGroup.append("title").text(fileName);
// // // //         }

// // // //         // Component type
// // // //         textGroup.append("text")
// // // //           .attr("y", 0)
// // // //           .attr("text-anchor", "middle")
// // // //           .style("fill", COLORS.text.secondary)
// // // //           .text(d.data.type || "Unknown");

// // // //         // State count
// // // //         textGroup.append("text")
// // // //           .attr("y", NODE_CONFIG.baseHeight / 4)
// // // //           .attr("text-anchor", "middle")
// // // //           .style("fill", COLORS.text.tertiary)
// // // //           .text(`State: ${d.data.state ? d.data.state.length : 0}`);
// // // //       });

// // // //       // Update node positions with transition
// // // //       const nodeUpdate = nodeEnter.merge(node);
// // // //       nodeUpdate.transition()
// // // //         .duration(750)
// // // //         .attr("transform", d => `translate(${d.x},${d.y})`);

// // // //       // Store node positions for transitions
// // // //       nodes.forEach(d => {
// // // //         d.x0 = d.x;
// // // //         d.y0 = d.y;
// // // //       });

// // // //       node.exit().remove();
// // // //     }

// // // //     // Initial render
// // // //     update(root);

// // // //     // Set initial view position
// // // //     const initialTransform = d3.zoomIdentity
// // // //       .translate(width / 2, height / 4)
// // // //       .scale(0.8);
// // // //     svg.call(zoom.transform, initialTransform);

// // // //     return () => {
// // // //       svg.selectAll("*").remove();
// // // //     };
// // // //   }, [data]);

// // // //   return (
// // // //     <svg
// // // //       ref={svgRef}
// // // //       width="100vw"
// // // //       height="100vh"
// // // //       style={{ background: "#f0f0f0" }}
// // // //     >
// // // //       <style>{`
// // // //         .link {
// // // //           fill: none;
// // // //           stroke: ${COLORS.link};
// // // //           stroke-width: 1.5px;
// // // //         }
// // // //         .node text {
// // // //           font-size: 12px;
// // // //           font-weight: 500;
// // // //         }
// // // //       `}</style>
// // // //     </svg>
// // // //   );
// // // // };

// // // // export default Dendrogram;

// // // // // /*
// // // // // DENDROGRAM VISUALIZATION COMPONENT
// // // // // ================================
// // // // // Features:
// // // // // - Interactive node collapsing/expanding
// // // // // - Dark mode toggle
// // // // // - Zoom and pan functionality
// // // // // - Automatic color depth changes
// // // // // - File name truncation with tooltips
// // // // // */

// // // // // import React, { useRef, useEffect, useState } from "react";
// // // // // import * as d3 from "d3";

// // // // // // Visual styling constants
// // // // // const COLORS = {
// // // // //   initial: "#ff69b4",  // Initial pink color
// // // // //   // Color gradient for different tree depths
// // // // //   depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
// // // // //   text: {
// // // // //     primary: "#1a237e",    // Component names
// // // // //     secondary: "#2e7d32",  // Type indicators
// // // // //     tertiary: "#1565c0"    // State information
// // // // //   },
// // // // //   link: "rgba(85, 85, 85, 0.4)",  // Connection lines
// // // // //   truncation: "#e91e63"    // Truncation indicators
// // // // // };

// // // // // // Node layout configuration
// // // // // const NODE_CONFIG = {
// // // // //   baseWidth: 130,         // Width of each node
// // // // //   baseHeight: 70,         // Height of each node
// // // // //   depthScale: 0.9,        // Size reduction per level
// // // // //   minScale: 0.6,          // Minimum node size
// // // // //   cornerRadius: 10,       // Node corner rounding
// // // // //   textTruncateLength: 15, // Max text length before truncation
// // // // //   verticalSpacing: 120,   // Space between levels
// // // // //   horizontalSpacing: 40   // Space between siblings
// // // // // };

// // // // // const Dendrogram = ({ data, appName }) => {
// // // // //   const svgRef = useRef();
// // // // //   const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

// // // // //   useEffect(() => {
// // // // //     if (!svgRef.current) return;

// // // // //     // Initialize D3 visualization
// // // // //     const svg = d3.select(svgRef.current);
// // // // //     const width = window.innerWidth;
// // // // //     const height = window.innerHeight;

// // // // //     // Configure tree layout
// // // // //     const tree = d3.tree()
// // // // //       .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
// // // // //       .separation((a, b) => (a.parent === b.parent ? 1.2 : 2.4));

// // // // //     // Create hierarchy and container
// // // // //     const root = d3.hierarchy(data);
// // // // //     const g = svg.append("g"); // Group for zooming

// // // // //     // Set up zoom behavior
// // // // //     const zoom = d3.zoom()
// // // // //       .scaleExtent([0.1, 2])
// // // // //       .on("zoom", (event) => g.attr("transform", event.transform));
// // // // //     svg.call(zoom);

// // // // //     // Update function - handles rendering and transitions
// // // // //     function update(source) {
// // // // //       tree(root);
// // // // //       const nodes = root.descendants();
// // // // //       const links = root.links();

// // // // //       // Update links
// // // // //       const link = g.selectAll(".link")
// // // // //         .data(links, d => d.target.data.file);

// // // // //       link.enter()
// // // // //         .append("path")
// // // // //         .attr("class", "link")
// // // // //         .attr("d", d3.linkVertical()
// // // // //           .x(d => d.x)
// // // // //           .y(d => d.y)
// // // // //         )
// // // // //         .style("stroke", COLORS.link)
// // // // //         .style("fill", "none")
// // // // //         .style("stroke-width", 1.5);

// // // // //       link.exit().remove();

// // // // //       // Update nodes
// // // // //       const node = g.selectAll(".node")
// // // // //         .data(nodes, d => d.data.file);

// // // // //       const nodeEnter = node.enter()
// // // // //         .append("g")
// // // // //         .attr("class", "node")
// // // // //         .attr("transform", d => `translate(${source.x0 || d.x},${source.y0 || d.y})`)
// // // // //         .on("click", (event, d) => {
// // // // //           d.children = d.children ? null : d._children;
// // // // //           update(d);
// // // // //         });

// // // // //       // Add visual elements to nodes
// // // // //       nodeEnter.each(function(d) {
// // // // //         const depth = Math.min(d.depth, COLORS.depths.length - 1);
// // // // //         d3.select(this).append("rect")
// // // // //           .attr("x", -NODE_CONFIG.baseWidth / 2)
// // // // //           .attr("y", -NODE_CONFIG.baseHeight / 2)
// // // // //           .attr("width", NODE_CONFIG.baseWidth)
// // // // //           .attr("height", NODE_CONFIG.baseHeight)
// // // // //           .attr("rx", NODE_CONFIG.cornerRadius)
// // // // //           .style("fill", COLORS.depths[depth]);

// // // // //         const textGroup = d3.select(this).append("g").attr("class", "text-group");
// // // // //         const fileName = d.data.file || "Unnamed";
// // // // //         const truncatedName = fileName.length > NODE_CONFIG.textTruncateLength
// // // // //           ? `${fileName.slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
// // // // //           : fileName;

// // // // //         // Add filename
// // // // //         textGroup.append("text")
// // // // //           .attr("y", -NODE_CONFIG.baseHeight / 4)
// // // // //           .attr("text-anchor", "middle")
// // // // //           .style("fill", COLORS.text.primary)
// // // // //           .text(truncatedName);

// // // // //         // Add tooltip for truncated names
// // // // //         if (truncatedName !== fileName) {
// // // // //           textGroup.append("title").text(fileName);
// // // // //         }

// // // // //         // Add component type
// // // // //         textGroup.append("text")
// // // // //           .attr("y", 0)
// // // // //           .attr("text-anchor", "middle")
// // // // //           .style("fill", COLORS.text.secondary)
// // // // //           .text(d.data.type || "Unknown");

// // // // //         // Add state count
// // // // //         textGroup.append("text")
// // // // //           .attr("y", NODE_CONFIG.baseHeight / 4)
// // // // //           .attr("text-anchor", "middle")
// // // // //           .style("fill", COLORS.text.tertiary)
// // // // //           .text(`State: ${d.data.state ? d.data.state.length : 0}`);
// // // // //       });

// // // // //       // Handle transitions
// // // // //       const nodeUpdate = nodeEnter.merge(node);
// // // // //       nodeUpdate.transition()
// // // // //         .duration(750)
// // // // //         .attr("transform", d => `translate(${d.x},${d.y})`);

// // // // //       // Store positions for transitions
// // // // //       nodes.forEach(d => {
// // // // //         d.x0 = d.x;
// // // // //         d.y0 = d.y;
// // // // //       });

// // // // //       node.exit().remove();
// // // // //     }

// // // // //     // Initial render
// // // // //     update(root);

// // // // //     // Set initial view position
// // // // //     const initialTransform = d3.zoomIdentity
// // // // //       .translate(width / 2, height / 4)
// // // // //       .scale(0.8);
// // // // //     svg.call(zoom.transform, initialTransform);

// // // // //     // Cleanup on unmount
// // // // //     return () => svg.selectAll("*").remove();
// // // // //   }, [data]);

// // // // //   // Calculate theme-based styles
// // // // //   const backgroundColor = isDarkMode ? "#1a1a1a" : "#ffffff";
// // // // //   const textColor = isDarkMode ? "#ffffff" : "#333333";

// // // // //   // Render component
// // // // //   return (
// // // // //     <div style={{ position: "relative" }}>
// // // // //       {/* Dark Mode Toggle */}
// // // // //       <button
// // // // //         onClick={() => setIsDarkMode(prev => !prev)}
// // // // //         style={{
// // // // //           position: "absolute",
// // // // //           top: 20,
// // // // //           right: 20,
// // // // //           padding: "10px 20px",
// // // // //           backgroundColor: isDarkMode ? "#333" : "#ddd",
// // // // //           color: isDarkMode ? "#eee" : "#111",
// // // // //           border: "none",
// // // // //           borderRadius: "5px",
// // // // //           cursor: "pointer"
// // // // //         }}
// // // // //       >
// // // // //         Toggle Dark Mode
// // // // //       </button>

// // // // //       {/* Title Display */}
// // // // //       <h1
// // // // //         style={{
// // // // //           position: "absolute",
// // // // //           top: 20,
// // // // //           left: 20,
// // // // //           color: textColor,
// // // // //           fontSize: "24px",
// // // // //           fontFamily: "Arial, sans-serif"
// // // // //         }}
// // // // //       >
// // // // //         {appName || "React Component Tree"}
// // // // //       </h1>

// // // // //       {/* Main SVG Container */}
// // // // //       <svg 
// // // // //         ref={svgRef} 
// // // // //         width="100vw" 
// // // // //         height="100vh"
// // // // //         style={{ backgroundColor }}
// // // // //       >
// // // // //         <style>{`
// // // // //           .link { stroke: ${COLORS.link}; stroke-width: 1.5px; }
// // // // //           .node text { font-size: 12px; font-weight: 500; fill: ${textColor}; }
// // // // //         `}</style>
// // // // //       </svg>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Dendrogram;

// // // // // // /*
// // // // // // DENDROGRAM COMPONENT
// // // // // // ===================
// // // // // // PURPOSE: Provides interactive visualization of React component hierarchy.
// // // // // // Features: Collapsible nodes, zoom/pan, dynamic sizing, node status information.

// // // // // // TREE INTERACTION:
// // // // // // ---------------
// // // // // // - Click: Expand/collapse nodes
// // // // // // - Drag: Pan visualization
// // // // // // - Scroll/Pinch: Zoom in/out
// // // // // // */

// // // // // // import React, { useRef, useEffect } from "react";
// // // // // // import * as d3 from "d3";

// // // // // // // Visual styling configuration
// // // // // // const COLORS = {
// // // // // //   initial: "#ff69b4",
// // // // // //   depths: ["#ffb74d", "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00"],
// // // // // //   text: {
// // // // // //     primary: "#1a237e",    // File names
// // // // // //     secondary: "#2e7d32",  // Component types
// // // // // //     tertiary: "#1565c0"    // State counts
// // // // // //   },
// // // // // //   link: "rgba(85, 85, 85, 0.4)",
// // // // // //   truncation: "#e91e63"
// // // // // // };

// // // // // // // Node layout settings
// // // // // // const NODE_CONFIG = {
// // // // // //   baseWidth: 130,
// // // // // //   baseHeight: 70,
// // // // // //   depthScale: 0.9,
// // // // // //   minScale: 0.6,
// // // // // //   cornerRadius: 10,
// // // // // //   textTruncateLength: 15,
// // // // // //   verticalSpacing: 120,
// // // // // //   horizontalSpacing: 40
// // // // // // };

// // // // // // const Dendrogram = ({ data }) => {
// // // // // //   const svgRef = useRef();

// // // // // //   useEffect(() => {
// // // // // //     if (!svgRef.current) return;

// // // // // //     // Set up SVG container
// // // // // //     const svg = d3.select(svgRef.current);
// // // // // //     const width = window.innerWidth;
// // // // // //     const height = window.innerHeight;

// // // // // //     // Configure tree layout
// // // // // //     const tree = d3.tree()
// // // // // //       .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
// // // // // //       .separation((a, b) => (a.parent === b.parent ? 1.2 : 2.4));

// // // // // //     // Create hierarchy and store initial children state
// // // // // //     const root = d3.hierarchy(data);
// // // // // //     root.descendants().forEach(d => {
// // // // // //       d._children = d.children;
// // // // // //     });

// // // // // //     // Set up zoom behavior
// // // // // //     const g = svg.append("g");
// // // // // //     const zoom = d3.zoom()
// // // // // //       .scaleExtent([0.1, 2])
// // // // // //       .on("zoom", (event) => g.attr("transform", event.transform));
// // // // // //     svg.call(zoom);

// // // // // //     // Update function for rendering tree
// // // // // //     function update(source) {
// // // // // //       tree(root);
// // // // // //       const nodes = root.descendants();
// // // // // //       const links = root.links();

// // // // // //       // Update links
// // // // // //       const link = g.selectAll(".link")
// // // // // //         .data(links, d => d.target.data.file);

// // // // // //       const linkEnter = link.enter()
// // // // // //         .append("path")
// // // // // //         .attr("class", "link")
// // // // // //         .attr("d", d3.linkVertical()
// // // // // //           .x(d => d.x)
// // // // // //           .y(d => d.y)
// // // // // //         );

// // // // // //       link.merge(linkEnter)
// // // // // //         .transition()
// // // // // //         .duration(750)
// // // // // //         .attr("d", d3.linkVertical()
// // // // // //           .x(d => d.x)
// // // // // //           .y(d => d.y)
// // // // // //         );

// // // // // //       link.exit()
// // // // // //         .transition()
// // // // // //         .duration(750)
// // // // // //         .remove();

// // // // // //       // Update nodes
// // // // // //       const node = g.selectAll(".node")
// // // // // //         .data(nodes, d => d.data.file);

// // // // // //       const nodeEnter = node.enter()
// // // // // //         .append("g")
// // // // // //         .attr("class", "node")
// // // // // //         .attr("transform", d => `translate(${source.x0 || source.x},${source.y0 || source.y})`)
// // // // // //         .on("click", (event, d) => {
// // // // // //           if (d.children) {
// // // // // //             d._children = d.children;
// // // // // //             d.children = null;
// // // // // //           } else {
// // // // // //             d.children = d._children;
// // // // // //             d._children = null;
// // // // // //           }
// // // // // //           update(d);
// // // // // //         });

// // // // // //       // Add node visuals
// // // // // //       nodeEnter.each(function(d) {
// // // // // //         const depth = Math.min(d.depth, COLORS.depths.length - 1);
        
// // // // // //         // Add rectangle background
// // // // // //         d3.select(this)
// // // // // //           .append("rect")
// // // // // //           .attr("x", -NODE_CONFIG.baseWidth / 2)
// // // // // //           .attr("y", -NODE_CONFIG.baseHeight / 2)
// // // // // //           .attr("width", NODE_CONFIG.baseWidth)
// // // // // //           .attr("height", NODE_CONFIG.baseHeight)
// // // // // //           .attr("rx", NODE_CONFIG.cornerRadius)
// // // // // //           .style("fill", COLORS.depths[depth]);

// // // // // //         // Add text elements
// // // // // //         const textGroup = d3.select(this)
// // // // // //           .append("g")
// // // // // //           .attr("class", "text-group");

// // // // // //         // Handle filename display
// // // // // //         const fileName = d.data.file || "Unnamed";
// // // // // //         const truncatedName = fileName.length > NODE_CONFIG.textTruncateLength
// // // // // //           ? `${fileName.slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
// // // // // //           : fileName;

// // // // // //         textGroup.append("text")
// // // // // //           .attr("y", -NODE_CONFIG.baseHeight / 4)
// // // // // //           .attr("text-anchor", "middle")
// // // // // //           .style("fill", COLORS.text.primary)
// // // // // //           .text(truncatedName);

// // // // // //         if (truncatedName !== fileName) {
// // // // // //           textGroup.append("title").text(fileName);
// // // // // //         }

// // // // // //         // Component type
// // // // // //         textGroup.append("text")
// // // // // //           .attr("y", 0)
// // // // // //           .attr("text-anchor", "middle")
// // // // // //           .style("fill", COLORS.text.secondary)
// // // // // //           .text(d.data.type || "Unknown");

// // // // // //         // State count
// // // // // //         textGroup.append("text")
// // // // // //           .attr("y", NODE_CONFIG.baseHeight / 4)
// // // // // //           .attr("text-anchor", "middle")
// // // // // //           .style("fill", COLORS.text.tertiary)
// // // // // //           .text(`State: ${d.data.state ? d.data.state.length : 0}`);
// // // // // //       });

// // // // // //       // Update node positions
// // // // // //       const nodeUpdate = nodeEnter.merge(node);
// // // // // //       nodeUpdate
// // // // // //         .transition()
// // // // // //         .duration(750)
// // // // // //         .attr("transform", d => `translate(${d.x},${d.y})`);

// // // // // //       // Store positions for transitions
// // // // // //       nodes.forEach(d => {
// // // // // //         d.x0 = d.x;
// // // // // //         d.y0 = d.y;
// // // // // //       });

// // // // // //       // Remove old nodes
// // // // // //       node.exit()
// // // // // //         .transition()
// // // // // //         .duration(750)
// // // // // //         .remove();
// // // // // //     }

// // // // // //     // Initial render
// // // // // //     update(root);

// // // // // //     // Set initial view position
// // // // // //     const initialTransform = d3.zoomIdentity
// // // // // //       .translate(width / 2, height / 4)
// // // // // //       .scale(0.8);
// // // // // //     svg.call(zoom.transform, initialTransform);

// // // // // //     // Clean up
// // // // // //     return () => {
// // // // // //       svg.selectAll("*").remove();
// // // // // //     };
// // // // // //   }, [data]);

// // // // // //   return (
// // // // // //     <svg
// // // // // //       ref={svgRef}
// // // // // //       width="100vw"
// // // // // //       height="100vh"
// // // // // //       style={{ background: "#f0f0f0" }}
// // // // // //     >
// // // // // //       <style>{`
// // // // // //         .link {
// // // // // //           fill: none;
// // // // // //           stroke: ${COLORS.link};
// // // // // //           stroke-width: 1.5px;
// // // // // //         }
// // // // // //         .node text {
// // // // // //           font-size: 12px;
// // // // // //           font-weight: 500;
// // // // // //         }
// // // // // //         .text-group text {
// // // // // //           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
// // // // // //         }
// // // // // //       `}</style>
// // // // // //     </svg>
// // // // // //   );
// // // // // // };

// // // // // // export default Dendrogram;

// // // // // // // /*
// // // // // // // VISUALIZATION CONFIGURATION:
// // // // // // // --------------------------
// // // // // // // 1. Node Display:
// // // // // // //    - Rounded rectangles with dynamic sizing based on depth
// // // // // // //    - Smart text truncation for names > 15 characters
// // // // // // //    - Hover tooltips for full names
// // // // // // //    - Visual indicators for truncated names
// // // // // // //    - Depth-based colors for distinguishing levels

// // // // // // // 2. Layout:
// // // // // // //    - Designed for trees up to 5+ levels deep
// // // // // // //    - Handles 2-10 siblings per level smoothly
// // // // // // //    - Dynamic spacing for visually clear separation

// // // // // // // 3. Color Scheme:
// // // // // // //    - Transition from pink to orange with increasing depth
// // // // // // //    - High contrast text
// // // // // // //    - Light shadows to enhance depth perception

// // // // // // // 4. Interactive Features:
// // // // // // //    - Dark/Light mode toggle
// // // // // // //    - Zoom and pan navigation
// // // // // // //    - Collapsible node trees
// // // // // // //    - Smooth transitions

// // // // // // // 5. Performance:
// // // // // // //    - Optimized for trees with 50+ nodes
// // // // // // //    - Efficient re-rendering
// // // // // // //    - Memory cleanup on unmount
// // // // // // // */

// // // // // // // import React, { useRef, useEffect, useState } from "react";
// // // // // // // import * as d3 from "d3";

// // // // // // // // **STYLE CONFIGURATION:** Set color and sizing for node and link visuals
// // // // // // // const COLORS = {
// // // // // // //   initial: "#ff69b4",    // Start with pink, transitioning to orange for deeper nodes
// // // // // // //   depths: [
// // // // // // //     "#ffb74d",          // Root level (warmest)
// // // // // // //     "#ffa726",          // Level 1
// // // // // // //     "#ff9800",          // Level 2
// // // // // // //     "#fb8c00",          // Level 3
// // // // // // //     "#f57c00",          // Level 4
// // // // // // //     "#ef6c00"           // Deepest level (coolest)
// // // // // // //   ],
// // // // // // //   text: {
// // // // // // //     primary: "#1a237e",   // Filename color (dark blue for contrast)
// // // // // // //     secondary: "#2e7d32", // Component type color (green for distinction)
// // // // // // //     tertiary: "#1565c0"   // State info color (blue for information)
// // // // // // //   },
// // // // // // //   link: "rgba(85, 85, 85, 0.4)", // Semi-transparent connections for visual hierarchy
// // // // // // //   truncation: "#e91e63"          // Pink indicator for truncated text
// // // // // // // };

// // // // // // // // **NODE LAYOUT CONFIGURATION:** Customize dimensions and spacing for nodes
// // // // // // // const NODE_CONFIG = {
// // // // // // //   baseWidth: 130,              // Standard node width
// // // // // // //   baseHeight: 70,              // Standard node height
// // // // // // //   depthScale: 0.9,            // Nodes shrink 10% per level
// // // // // // //   minScale: 0.6,              // Prevents nodes from becoming too small
// // // // // // //   cornerRadius: 10,           // Rounded corners for softer appearance
// // // // // // //   textTruncateLength: 15,     // Max characters before truncation
// // // // // // //   verticalSpacing: 120,       // Vertical distance between levels
// // // // // // //   horizontalSpacing: 40       // Horizontal distance between siblings
// // // // // // // };

// // // // // // // // **THEME CONFIGURATION:** Dark mode color adjustments
// // // // // // // const THEME = {
// // // // // // //   light: {
// // // // // // //     background: "#ffffff",
// // // // // // //     text: "#333333",
// // // // // // //     button: "#dddddd",
// // // // // // //     buttonText: "#111111"
// // // // // // //   },
// // // // // // //   dark: {
// // // // // // //     background: "#1a1a1a",
// // // // // // //     text: "#ffffff",
// // // // // // //     button: "#333333",
// // // // // // //     buttonText: "#eeeeee"
// // // // // // //   }
// // // // // // // };

// // // // // // // // **DENDROGRAM COMPONENT:** Main visualization component
// // // // // // // const Dendrogram = ({ data, appName }) => {
// // // // // // //   const svgRef = useRef();                              // References SVG container
// // // // // // //   const [isDarkMode, setIsDarkMode] = useState(false);  // Controls theme / Dark mode state

// // // // // // //   useEffect(() => {
// // // // // // //     if (!svgRef.current) return;

// // // // // // //     const svg = d3.select(svgRef.current);
// // // // // // //     const width = window.innerWidth;
// // // // // // //     const height = window.innerHeight;

// // // // // // //     const tree = d3.tree()
// // // // // // //       .nodeSize([NODE_CONFIG.baseHeight * 1.5, NODE_CONFIG.baseWidth * 2])
// // // // // // //       .separation((a, b) => (a.parent === b.parent ? 1.2 : 2.4));

// // // // // // //     const root = d3.hierarchy(data);
// // // // // // //     const g = svg.append("g"); // Group element to allow for zooming

// // // // // // //     const zoom = d3.zoom()
// // // // // // //       .scaleExtent([0.1, 2])
// // // // // // //       .on("zoom", (event) => g.attr("transform", event.transform));
// // // // // // //     svg.call(zoom);

// // // // // // //     function update(source) {
// // // // // // //       tree(root);
// // // // // // //       const nodes = root.descendants();
// // // // // // //       const links = root.links();

// // // // // // //       const link = g.selectAll(".link")
// // // // // // //         .data(links, d => d.target.data.file);

// // // // // // //       link.enter()
// // // // // // //         .append("path")
// // // // // // //         .attr("class", "link")
// // // // // // //         .attr("d", d3.linkVertical()
// // // // // // //           .x(d => d.x)
// // // // // // //           .y(d => d.y)
// // // // // // //         )
// // // // // // //         .style("stroke", COLORS.link)
// // // // // // //         .style("fill", "none")
// // // // // // //         .style("stroke-width", 1.5);

// // // // // // //       link.exit().remove();

// // // // // // //       const node = g.selectAll(".node")
// // // // // // //         .data(nodes, d => d.data.file);

// // // // // // //       const nodeEnter = node.enter()
// // // // // // //         .append("g")
// // // // // // //         .attr("class", "node")
// // // // // // //         .attr("transform", d => `translate(${source.x0 || d.x},${source.y0 || d.y})`)
// // // // // // //         .on("click", (event, d) => {
// // // // // // //           d.children = d.children ? null : d._children;
// // // // // // //           update(d);
// // // // // // //         });

// // // // // // //       nodeEnter.each(function(d) {
// // // // // // //         const depth = Math.min(d.depth, COLORS.depths.length - 1);
// // // // // // //         d3.select(this).append("rect")
// // // // // // //           .attr("x", -NODE_CONFIG.baseWidth / 2)
// // // // // // //           .attr("y", -NODE_CONFIG.baseHeight / 2)
// // // // // // //           .attr("width", NODE_CONFIG.baseWidth)
// // // // // // //           .attr("height", NODE_CONFIG.baseHeight)
// // // // // // //           .attr("rx", NODE_CONFIG.cornerRadius)
// // // // // // //           .style("fill", COLORS.depths[depth]);

// // // // // // //         const textGroup = d3.select(this).append("g").attr("class", "text-group");
// // // // // // //         const fileName = d.data.file || "Unnamed";
// // // // // // //         const truncatedName = fileName.length > NODE_CONFIG.textTruncateLength
// // // // // // //           ? `${fileName.slice(0, NODE_CONFIG.textTruncateLength - 3)}...`
// // // // // // //           : fileName;

// // // // // // //         textGroup.append("text")
// // // // // // //           .attr("y", -NODE_CONFIG.baseHeight / 4)
// // // // // // //           .attr("text-anchor", "middle")
// // // // // // //           .style("fill", COLORS.text.primary)
// // // // // // //           .text(truncatedName);

// // // // // // //         if (truncatedName !== fileName) {
// // // // // // //           textGroup.append("title").text(fileName);
// // // // // // //         }

// // // // // // //         textGroup.append("text")
// // // // // // //           .attr("y", 0)
// // // // // // //           .attr("text-anchor", "middle")
// // // // // // //           .style("fill", COLORS.text.secondary)
// // // // // // //           .text(d.data.type || "Unknown");

// // // // // // //         textGroup.append("text")
// // // // // // //           .attr("y", NODE_CONFIG.baseHeight / 4)
// // // // // // //           .attr("text-anchor", "middle")
// // // // // // //           .style("fill", COLORS.text.tertiary)
// // // // // // //           .text(`State: ${d.data.state ? d.data.state.length : 0}`);
// // // // // // //       });

// // // // // // //       const nodeUpdate = nodeEnter.merge(node);
// // // // // // //       nodeUpdate.transition().duration(750).attr("transform", d => `translate(${d.x},${d.y})`);
// // // // // // //       nodes.forEach(d => {
// // // // // // //         d.x0 = d.x;
// // // // // // //         d.y0 = d.y;
// // // // // // //       });
// // // // // // //       node.exit().remove();
// // // // // // //     }

// // // // // // //     update(root);

// // // // // // //     const initialTransform = d3.zoomIdentity.translate(width / 2, height / 4).scale(0.8);
// // // // // // //     svg.call(zoom.transform, initialTransform);

// // // // // // //     setTimeout(() => {
// // // // // // //       svg.transition()
// // // // // // //         .duration(2000)
// // // // // // //         .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 6).scale(0.4));
// // // // // // //     }, 1000);

// // // // // // //     return () => svg.selectAll("*").remove();
// // // // // // //   }, [data]);

// // // // // // //   // **DARK MODE STYLES**
// // // // // // //   const backgroundColor = isDarkMode ? "#1a1a1a" : "#ffffff";
// // // // // // //   const textColor = isDarkMode ? "#ffffff" : "#333333";

// // // // // // //   return (
// // // // // // //     <div style={{ position: "relative" }}>
// // // // // // //       <button
// // // // // // //         onClick={() => setIsDarkMode(prev => !prev)}
// // // // // // //         style={{
// // // // // // //           position: "absolute",
// // // // // // //           top: 20,
// // // // // // //           right: 20,
// // // // // // //           padding: "10px 20px",
// // // // // // //           backgroundColor: isDarkMode ? "#333" : "#ddd",
// // // // // // //           color: isDarkMode ? "#eee" : "#111",
// // // // // // //           border: "none",
// // // // // // //           borderRadius: "5px",
// // // // // // //           cursor: "pointer"
// // // // // // //         }}
// // // // // // //       >
// // // // // // //         Toggle Dark Mode
// // // // // // //       </button>

// // // // // // //       <h1
// // // // // // //         style={{
// // // // // // //           position: "absolute",
// // // // // // //           top: 20,
// // // // // // //           left: 20,
// // // // // // //           color: textColor,
// // // // // // //           fontSize: "24px",
// // // // // // //           fontFamily: "Arial, sans-serif"
// // // // // // //         }}
// // // // // // //       >
// // // // // // //         {appName || "React Component Tree"}
// // // // // // //       </h1>

// // // // // // //       <svg 
// // // // // // //         ref={svgRef} 
// // // // // // //         width="100vw" 
// // // // // // //         height="100vh"
// // // // // // //         style={{ backgroundColor }}
// // // // // // //       >
// // // // // // //         <style>{`
// // // // // // //           .link { stroke: ${COLORS.link}; stroke-width: 1.5px; }
// // // // // // //           .node text { font-size: 12px; font-weight: 500; fill: ${textColor}; }
// // // // // // //         `}</style>
// // // // // // //       </svg>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default Dendrogram;


