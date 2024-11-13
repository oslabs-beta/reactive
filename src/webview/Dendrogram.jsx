// TODO SVG is centered but zoomed out too far, see lines around line 236-249 
// TODO tweak the node size line 123

// Event listeners for receiving data from VS Code extension
import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import * as d3 from "d3";

/*
PSEUDOCODE/EXPLANATION OF CHANGES:
1. State Display Strategy:
   - Initially only show count of state items in node
   - Add click handler to state text
   - When clicked, show popup with full state details
   - Popup includes close button and all state items

2. Main Changes:
   - Modified node sizing and separation
   - Changed from circles to rounded rectangles
   - Added collapsible state display
   - Added popup mechanism for state details
   - Added event propagation control
   - Improved text positioning and styling

3. Key Components:
   - Main node: Shows file, type, and state count
   - State popup: Shows detailed state array
   - Event handlers: For node collapse and state display
*/

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
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const margin = { top: 50, right: 20, bottom: 20, left: 20 };
      // const width = 600 - margin.left - margin.right;
      const width = window.innerWidth - margin.left - margin.right;
      // const height = 1000 - margin.top - margin.bottom;
      const height = window.innerHeight - margin.top - margin.bottom;

      // Configure tree layout with improved spacing
      const tree = d3
        .tree()
        .size([height, width - 100])
        .nodeSize([200, 200])
        .separation((a, b) => (a.parent === b.parent ? 1.5 : 2)); // separation of nodes

      const root = d3.hierarchy(data);
      root.descendants().forEach((d) => (d._children = d.children));
      // controls the min max zoom levels
      const zoom = d3.zoom().scaleExtent([0.5, 24]).on("zoom", redraw);
      svg.call(zoom);

      const g = svg.append("g");

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

        // Node rectangle
        nodeEnter
          .append("rect")
          .attr("x", -40)
          .attr("y", -20)
          .attr("width", 140) // Adjusted width for longer file names
          .attr("height", 60)
          .attr("rx", 10)
          .attr("ry", 10)
          .style("fill", "yellow");

        // File name text
        nodeEnter
          .append("text")
          .attr("y", -5)
          .attr("x", 20)
          .attr("text-anchor", "middle")
          .text((d) => d.data.file)
          .style("fill", "blue");

        // Component type text
        nodeEnter
          .append("text")
          .attr("y", 10)
          .attr("x", 20)
          .attr("text-anchor", "middle")
          .text((d) => `${d.data.type}`)
          .style("fill", "green");

        // State text with popup functionality
        nodeEnter
          .append("text")
          .attr("y", 25)
          .attr("x", 20)
          .attr("text-anchor", "middle")
          .text((d) => `State: ${d.data.state.length} items`)
          .style("fill", "purple")
          .style("cursor", "pointer")
          .on("click", (event, d) => {
            event.stopPropagation(); // Prevent node collapse

            // Remove any existing state details
            g.selectAll(".state-details").remove();

            // Create state details popup
            const stateDetails = g
              .append("g")
              .attr("class", "state-details")
              .attr("transform", `translate(${d.x + 100},${d.y - 30})`);

            // Popup background
            stateDetails
              .append("rect")
              .attr("x", -170)
              .attr("y", 80)
              .attr("width", 150)
              .attr("height", d.data.state.length * 20 + 20)
              .attr("rx", 5)
              .attr("ry", 5)
              .style("fill", "white")
              .style("stroke", "purple")
              .style("stroke-width", "1px");

            // Close button
            stateDetails
              .append("text")
              .attr("x", -35)
              .attr("y", 95)
              .text("×")
              .style("fill", "purple")
              .style("cursor", "pointer")
              .style("font-size", "16px")
              .on("click", () => stateDetails.remove());

            // State items list
            d.data.state.forEach((item, i) => {
              stateDetails
                .append("text")
                .attr("x", -160)
                .attr("y", i * 20 + 100)
                .text(item)
                .style("fill", "purple")
                .style("font-size", "12px");
            });
          });

        // Handle node updates
        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate
          .transition()
          .duration(750)
          .attr("transform", (d) => `translate(${d.x},${d.y})`);

        // Store node positions for transitions
        nodes.forEach((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });

        // Remove exiting nodes
        node
          .exit()
          .transition()
          .duration(750)
          .attr("transform", (d) => `translate(${source.x},${source.y})`)
          .remove();
      }

      function redraw(event) {
        g.attr("transform", event.transform);
      }

      update(root);
      // const xExtent = d3.extent(root.descendants(), d => d.x); const yExtent = d3.extent(root.descendants(), d => d.y); svg.attr("viewBox", `${yExtent[0] - 50} ${xExtent[0] - 50} ${yExtent[1] - yExtent[0] + 100} ${xExtent[1] - xExtent[0] + 100}`);
      const xExtent = d3.extent(root.descendants(), (d) => d.x);
      const yExtent = d3.extent(root.descendants(), (d) => d.y);

      // Calculate the total width and height of the content
      const treeWidth = yExtent[1] - yExtent[0]; 
      const treeHeight = xExtent[1] - xExtent[0]; // stuck on this, TODO

      // Add some padding to the viewBox to ensure everything is visible
      const padding = 50; // You can adjust this value to increase the margin around the tree
      svg.attr(
        "viewBox",
        `${yExtent[0] - padding} ${xExtent[0] - padding} ${
          treeWidth + 2 * padding
        } ${treeHeight + 2 * padding}`
      );
    }
  }, [data]);

  return (
    <svg ref={svgRef} width="95vw" height="90vh">
      <style>{`
        .link {
          fill: none;
          stroke: #555;
          stroke-opacity: 0.4;
          stroke-width: 1.5px;
        }
        .node rect {
          fill: yellow;
        }
        .node text {
          font-size: 12px;
          fill: blue;
        }
        .state-details {
          pointer-events: all;
        }
        .state-details text {
          user-select: none;
        }
      `}</style>
    </svg>
  );
};

export default Dendrogram;
