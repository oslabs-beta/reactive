// //console.log("Inside Dendrogram at top")
import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import * as d3 from "d3";

window.addEventListener("message", event => {
  //console.log("I hear an event!"); // logs
  //console.log("event.data.type: " + event.data.type);

  if (event.data.type === "testMessage") {
    //console.log("Received message:", event.data.payload); // logs
  }

  if (event.data.type === "astData") {
    //console.log("astData: " + event.data.payload); // logs
    const astData = event.data.payload;

    // Use createRoot to render the Dendrogram component
    const container = document.getElementById("root");
    const root = createRoot(container); // Create root once, ideally at the start of the app
    root.render(<Dendrogram data={astData} />);
  }
});

const Dendrogram = ({ data }) => {
  //console.log("inside dendrogram. this is the passed in data: ", data); // logs
  const svgRef = useRef();

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const margin = { top: 50, right: 20, bottom: 20, left: 20 };
      const width = 600 - margin.left - margin.right;
      const height = 600 - margin.top - margin.bottom;

      // Create tree and layout
      const tree = d3.tree().size([height, width - 100]);
      const root = d3.hierarchy(data); // Use the passed-in data as the root of the hierarchy
      const links = tree(root).links();
      const nodes = root.descendants();

      // Render links
      svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
          "d",
          d3
            .linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

      // Render nodes
      const node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .on("click", (event, d) => {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(root);
        });

      node.append("circle")
        .attr("r", 40)
        .style("fill", "yellow");

      node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", "middle")
        .text(d => d.data.file)
        .style("fill", "blue");

      function update(root) {
        const node = svg.selectAll(".node")
          .data(root.descendants(), d => d.data.file);

        const nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", d => `translate(${d.x},${d.y})`)
          .on("click", (event, d) => {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }
            update(root);
          });

        nodeEnter.append("circle")
          .attr("r", 40)
          .style("fill", "yellow");

        nodeEnter.append("text")
          .attr("dy", ".31em")
          .attr("text-anchor", "middle")
          .text(d => d.data.file)
          .style("fill", "blue");

        node.transition()
          .duration(750)
          .attr("transform", d => `translate(${d.x},${d.y})`);

        node.exit().remove();

        const links = svg.selectAll(".link")
          .data(root.links().filter(link => !link.source._children), d => d.source.data.file + "-" + d.target.data.file);

        links.enter()
          .append("path")
          .attr("class", "link")
          .attr("d", d => {
            const o = { x: d.source.x, y: d.source.y };
            return vertical({ source: o, target: o });
          })
          .transition()
          .duration(750)
          .attr("d", d => vertical(d));

        links.transition()
          .duration(750)
          .attr("d", d => vertical(d));

        const vertical = d3.linkVertical()
          .x(d => d.x)
          .y(d => d.y);
      }
    }
  }, [data]);

  return (
    <svg ref={svgRef} width="600" height="600" viewBox="-70 -50 600 600">
      <style>{`
        .link {
          fill: none;
          stroke: #555;
          stroke-opacity: 0.4;
          stroke-width: 1.5px;
        }
        .node circle {
          fill: white;
        }
        .node text {
          font-size: 12px;
        }
      `}</style>
    </svg>
  );
};

export default Dendrogram;
