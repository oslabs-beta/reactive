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
    popup: {
      background: "#ffffff",
      border: "#1565c0",
      text: "#1a237e",
    }
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
    popup: {
      background: "#424242",
      border: "#90caf9",
      text: "#bbdefb",
    }
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

    // Helper function to remove state popup
    function removeStatePopup() {
      g.selectAll(".state-details").remove();
    }

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
        .text((d) => `State: ${d.data.state ? d.data.state.length : 0}`)
        .on("click", (event, d) => {
          event.stopPropagation();
          removeStatePopup();

          if (!d.data.state || d.data.state.length === 0) return;

          const stateDetails = g
            .append("g")
            .attr("class", "state-details")
            .attr("transform", `translate(${d.x + 100},${d.y - 30})`);

          const padding = 10;
          const itemHeight = 20;
          const width = 200;
          const height = Math.min(d.data.state.length * itemHeight + padding * 2, 300);

          // Popup background
          stateDetails
            .append("rect")
            .attr("x", -padding)
            .attr("y", -padding)
            .attr("width", width)
            .attr("height", height)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", colorScheme.popup.background)
            .style("stroke", colorScheme.popup.border)
            .style("stroke-width", "1px");

          // Close button
          stateDetails
            .append("text")
            .attr("x", width - 25)
            .attr("y", 5)
            .text("×")
            .style("fill", colorScheme.popup.text)
            .style("cursor", "pointer")
            .style("font-size", "16px")
            .on("click", removeStatePopup);

          // Create scrollable container for state items
          const stateContainer = stateDetails
            .append("g")
            .attr("class", "state-container")
            .attr("clip-path", "url(#state-clip)");

          // Add state items
          d.data.state.forEach((item, i) => {
            stateContainer
              .append("text")
              .attr("x", 5)
              .attr("y", i * itemHeight + 15)
              .text(item)
              .style("fill", colorScheme.popup.text)
              .style("font-size", "12px");
          });
        });

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
            .state-details {
            pointer-events: all;
          }
          .state-details text {
            user-select: none;
          }
        `}</style>
      </svg>
    </div>
  );
};

export default Dendrogram;
