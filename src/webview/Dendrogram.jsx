// TODO for Micah to build out

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const dummyData = {
  name: "Colin",
  children: [
    {
      name: "T Rex monster",
      children: [
        { name: "TBD 1.1" },
        { name: "TBD 1.2" }
      ]
    },
    {
      name: "Gizmo",
      children: [
        { name: "Stripe" },
        { name: "MoHawk" }
      ]
    }
  ]
};

const Dendrogram = () => {
  const svgRef = useRef();

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current) // create SVG element
      const margin = { top: 50, right: 20, bottom: 20, left: 20 };
      const width = 600 - margin.left - margin.right;
      const height = 600 - margin.top - margin.bottom;

      // create tree with designated dimensions 
      const tree = d3.tree().size([height, width - 100]);
      const root = d3.hierarchy(dummyData); // create hierarchy based on passed in data 
      const links = tree(root).links(); // create dendrogram links
      const nodes = root.descendants();

      svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical() // vertical layout 
          .x(d => d.x)
          .y(d => d.y));

      // create dendrogram nodes  
      const node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

      // append circles to nodes
      node.append("circle")
        .attr("r", 40)
        .style("fill", "yellow"); // pass in func as second arg to conditionally render diff color


      // append text to nodes
      node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".31em")
        // .attr("x", d => d.children ? -8 : 8)
        // .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .style("fill", "blue");
    }
  }, []);

  return (
    <svg ref={svgRef} width="600" height="600" viewBox="-50 -20 600 600"> 
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