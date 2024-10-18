// TODO for micah to build out

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const dummyData = {
  name: "Root",
  children: [
    {
      name: "Child 1",
      children: [
        { name: "Grandchild 1.1" },
        { name: "Grandchild 1.2" }
      ]
    },
    {
      name: "Child 2",
      children: [
        { name: "Grandchild 2.1" },
        { name: "Grandchild 2.2" }
      ]
    }
  ]
};

const Dendrogram = () => {
  const svgRef = useRef();

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = 600;
      const height = 400;

      const tree = d3.tree().size([height, width - 100]);
      const root = d3.hierarchy(dummyData);
      const links = tree(root).links();
      const nodes = root.descendants();

      svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x));

      const node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

      node.append("circle")
        .attr("r", 4);

      node.append("text")
        .attr("dy", ".31em")
        .attr("x", d => d.children ? -8 : 8)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);
    }
  }, []);

  return (
    <svg ref={svgRef} width="600" height="400">
      <style>{`
        .link {
          fill: none;
          stroke: #555;
          stroke-opacity: 0.4;
          stroke-width: 1.5px;
        }
        .node circle {
          fill: #999;
        }
        .node text {
          font-size: 12px;
        }
      `}</style>
    </svg>
  );
};

export default Dendrogram;