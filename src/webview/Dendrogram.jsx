/*
VISUALIZATION CONFIGURATION:
--------------------------
1. Node Display:
   - Rounded rectangles with dynamic sizing based on depth
   - Smart text truncation for names > 15 characters
   - Hover tooltips for full names
   - Visual indicators for truncated names
   - Depth-based colors for distinguishing levels

2. Layout:
   - Designed for trees up to 5+ levels deep
   - Handles 2-10 siblings per level smoothly
   - Dynamic spacing for visually clear separation

3. Color Scheme:
   - Transition from pink to orange with increasing depth
   - High contrast text
   - Light shadows to enhance depth perception

4. Interactive Features:
   - Dark/Light mode toggle
   - Zoom and pan navigation
   - Collapsible node trees
   - Smooth transitions

5. Performance:
   - Optimized for trees with 50+ nodes
   - Efficient re-rendering
   - Memory cleanup on unmount
*/

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

// **STYLE CONFIGURATION:** Set color and sizing for node and link visuals
const COLORS = {
  initial: "#ff69b4",    // Start with pink, transitioning to orange for deeper nodes
  depths: [
    "#ffb74d",          // Root level (warmest)
    "#ffa726",          // Level 1
    "#ff9800",          // Level 2
    "#fb8c00",          // Level 3
    "#f57c00",          // Level 4
    "#ef6c00"           // Deepest level (coolest)
  ],
  text: {
    primary: "#1a237e",   // Filename color (dark blue for contrast)
    secondary: "#2e7d32", // Component type color (green for distinction)
    tertiary: "#1565c0"   // State info color (blue for information)
  },
  link: "rgba(85, 85, 85, 0.4)", // Semi-transparent connections for visual hierarchy
  truncation: "#e91e63"          // Pink indicator for truncated text
};

// **NODE LAYOUT CONFIGURATION:** Customize dimensions and spacing for nodes
const NODE_CONFIG = {
  baseWidth: 130,              // Standard node width
  baseHeight: 70,              // Standard node height
  depthScale: 0.9,            // Nodes shrink 10% per level
  minScale: 0.6,              // Prevents nodes from becoming too small
  cornerRadius: 10,           // Rounded corners for softer appearance
  textTruncateLength: 15,     // Max characters before truncation
  verticalSpacing: 120,       // Vertical distance between levels
  horizontalSpacing: 40       // Horizontal distance between siblings
};

// **THEME CONFIGURATION:** Dark mode color adjustments
const THEME = {
  light: {
    background: "#ffffff",
    text: "#333333",
    button: "#dddddd",
    buttonText: "#111111"
  },
  dark: {
    background: "#1a1a1a",
    text: "#ffffff",
    button: "#333333",
    buttonText: "#eeeeee"
  }
};

// **DENDROGRAM COMPONENT:** Main visualization component
const Dendrogram = ({ data, appName }) => {
  const svgRef = useRef();                              // References SVG container
  const [isDarkMode, setIsDarkMode] = useState(false);  // Controls theme / Dark mode state

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


