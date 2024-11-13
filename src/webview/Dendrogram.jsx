/*
QUICK MODIFICATION GUIDE:
------------------------
1. Node Rectangle Size:
   - Find nodeEnter.append("rect")
   - Modify these attributes:
     * width: 140 (increase for wider rectangles)
     * height: 60 (increase for taller rectangles)
     * x: -40 (adjust to center the rectangle, usually -width/2)
     * y: -20 (adjust to center vertically)

2. Text Size and Position:
   - Find .node text in the CSS or style attributes
   - Modify font-size (default: 12px)
   - Adjust text y positions:
     * First text (filename): y: -5
     * Second text (type): y: 10
     * Third text (state): y: 25

3. Colors:
   - Modify the COLORS object to update the color scheme
   - Ensure sufficient contrast for accessibility
   - Consider using color-blind friendly palettes

4. Animation Timing:
   - Initial delay: 1000ms (1 second)
   - Transition duration: 2000ms (2 seconds)
   - Node update duration: 750ms

5. Zoom Levels:
   - Initial zoom: scale(2)
   - Final zoom: scale(0.2)
   - Zoom limits: scaleExtent([0.05, 4])

6. Tree Layout:
   - Node spacing: nodeSize([200, 200])
   - Sibling separation: separation((a, b) => (a.parent === b.parent ? 1.5 : 2))

PSEUDO CODE OVERVIEW:
-------------------
1. Initialize:
   ```
   Create SVG container
   Define margins and dimensions
   Configure tree layout
   Setup zoom behavior
   ```

2. Data Processing:
   ```
   Receive hierarchical data
   Create d3 hierarchy
   Store children for expand/collapse
   ```

3. Tree Rendering:
   ```
   For each node:
     Create group element
     Add rectangle background
     Add text elements (filename, type, state)
     Setup click handlers
   
   For each link:
     Create path between nodes
     Configure path styling
   ```

4. Animation Sequence:
   ```
   Start:
     Set initial zoom level (2x)
     Set initial teal color
   
   After 1 second:
     Begin color transition to coral
     Begin zoom out to 0.2x
     Duration: 2 seconds
   ```

5. Interaction Handlers:
   ```
   On node click:
     Toggle children visibility
     Update tree layout
   
   On state click:
     Show popup with state details
     Enable popup close button
   
   On zoom:
     Update transform
     Maintain smooth transitions
   ```
*/

import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import * as d3 from "d3";

// Color scheme configuration
const COLORS = {
  initialNode: "#ff69b4",    // Starting pink
  finalNode: "#ffeb3b",      // Bright yellow
  fileName: "#000000",       // Black for main filename
  typeText: "#2e7d32",      // Dark green for type
  stateText: "#1565c0",     // Dark blue for state
  link: "#555555",          // Dark grey for connections
  statePopupBg: "#FFFFFF",  // White background
  statePopupBorder: "#1565c0", // Blue border
  statePopupText: "#000000"  // Black text in popup
};

window.addEventListener("message", (event) => {
  if (event.data.type === "testMessage") {
    //console.log("Received message:", event.data.payload);
  }

  if (event.data.type === "astData") {
    const astData = event.data.payload;
    const container = document.getElementById("root");
    const root = createRoot(container);
    root.render(<Dendrogram data={astData} />);
  }
});

const Dendrogram = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 50, right: 20, bottom: 20, left: 20 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;

    // Configure tree layout with improved spacing
    const tree = d3
      .tree()
      .size([height, width - 100])
      .nodeSize([200, 200])
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

    const root = d3.hierarchy(data);
    root.descendants().forEach((d) => (d._children = d.children));
    
    // Configure zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.05, 4])
      .on("zoom", redraw);
    
    svg.call(zoom);

    const g = svg.append("g");

    function redraw(event) {
      g.attr("transform", event.transform);
    }

    function update(source) {
      tree(root);
      const nodes = root.descendants();
      const links = root.links();

      // Handle links
      const link = g
        .selectAll(".link")
        .data(links, (d) => d.source.data.file + "-" + d.target.data.file);

      link
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
          "d",
          d3
            .linkVertical()
            .x((d) => d.x)
            .y((d) => d.y)
        )
        .merge(link)
        .transition()
        .duration(750)
        .attr(
          "d",
          d3
            .linkVertical()
            .x((d) => d.x)
            .y((d) => d.y)
        );

      link.exit().remove();

      // Handle nodes
      const node = g.selectAll(".node").data(nodes, (d) => d.data.file);

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr(
          "transform",
          (d) => `translate(${source.x0 || d.x},${source.y0 || d.y})`
        )
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

      nodeEnter
        .append("rect")
        .attr("x", -40)
        .attr("y", -20)
        .attr("width", 140)
        .attr("height", 60)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", COLORS.initialNode)
        .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))");

      nodeEnter
        .append("text")
        .attr("y", -5)
        .attr("x", 20)
        .attr("text-anchor", "middle")
        .text((d) => d.data.file)
        .style("fill", COLORS.fileName);

      nodeEnter
        .append("text")
        .attr("y", 10)
        .attr("x", 20)
        .attr("text-anchor", "middle")
        .text((d) => `${d.data.type}`)
        .style("fill", COLORS.typeText);

      nodeEnter
        .append("text")
        .attr("y", 25)
        .attr("x", 20)
        .attr("text-anchor", "middle")
        .text((d) => `State: ${d.data.state.length} items`)
        .style("fill", COLORS.stateText)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          event.stopPropagation();
          g.selectAll(".state-details").remove();

          const stateDetails = g
            .append("g")
            .attr("class", "state-details")
            .attr("transform", `translate(${d.x + 100},${d.y - 30})`);

          stateDetails
            .append("rect")
            .attr("x", -170)
            .attr("y", 80)
            .attr("width", 150)
            .attr("height", d.data.state.length * 20 + 20)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", COLORS.statePopupBg)
            .style("stroke", COLORS.statePopupBorder)
            .style("stroke-width", "1px")
            .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.1))");

          stateDetails
            .append("text")
            .attr("x", -35)
            .attr("y", 95)
            .text("×")
            .style("fill", COLORS.statePopupText)
            .style("cursor", "pointer")
            .style("font-size", "16px")
            .on("click", () => stateDetails.remove());

          d.data.state.forEach((item, i) => {
            stateDetails
              .append("text")
              .attr("x", -160)
              .attr("y", i * 20 + 100)
              .text(item)
              .style("fill", COLORS.statePopupText)
              .style("font-size", "12px");
          });
        });

      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate
        .transition()
        .duration(750)
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      node
        .exit()
        .transition()
        .duration(750)
        .attr("transform", (d) => `translate(${source.x},${source.y})`)
        .remove();

      return nodes;
    }

    // Initial update and get nodes
    const nodes = update(root);

    // Find the target node (root node)
    const targetNode = nodes[0];
    
    // Initial zoomed in transform
    const initialTransform = d3.zoomIdentity
      .translate(width / 2 - targetNode.x, height / 2 - targetNode.y)
      .scale(2);

    // Apply initial transform
    svg.call(zoom.transform, initialTransform);

    // After 1 second, zoom out and transition colors
    setTimeout(() => {
      // Start color transition
      g.selectAll("rect")
        .transition()
        .duration(2000)
        .style("fill", COLORS.finalNode);

      // Zoom out
      svg.transition()
        .duration(2000)
        .call(zoom.transform, d3.zoomIdentity
          .translate(width / 2 - targetNode.x, height / 2 - targetNode.y)
          .scale(0.2)
        );
    }, 1000);

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return (
    <svg ref={svgRef} width="95vw" height="90vh">
      <style>{`
        .link {
          fill: none;
          stroke: ${COLORS.link};
          stroke-opacity: 0.6;
          stroke-width: 1.5px;
        }
        .node text {
          font-size: 12px;
          font-weight: 500;
        }
        .state-details {
          pointer-events: all;
        }
        .state-details text {
          user-select: none;
          fill: ${COLORS.statePopupText};
        }
      `}</style>
    </svg>
  );
};

export default Dendrogram;