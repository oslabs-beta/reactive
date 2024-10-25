// TODO for Micah to build out

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// const dummyData = {
//   "file": "App.jsx",
//   "type": "functional",
//   "state": [],
//   "children": [
//     {
//       "file": "Nav.jsx",
//       "type": "functional",
//       "state": [],
//       "children": []
//     },
//     {
//       "file": "Home.jsx",
//       "type": "functional",
//       "state": [],
//       "children": []
//     },
//     {
//       "file": "Search.jsx",
//       "type": "functional",
//       "state": [],
//       "children": [
//         {
//           "file": "InputForm.jsx",
//           "type": "functional",
//           "state": [],
//           "children": []
//         },
//         {
//           "file": "ShowImages.jsx",
//           "type": "functional",
//           "state": [],
//           "children": []
//         }
//       ]
//     },
//     {
//       "file": "Login.jsx",
//       "type": "functional",
//       "state": [],
//       "children": []
//     },
//     {
//       "file": "SignUp.jsx",
//       "type": "functional",
//       "state": [],
//       "children": []
//     },
//     {
//       "file": "About.jsx",
//       "type": "functional",
//       "state": [],
//       "children": []
//     },
//     {
//       "file": "Background.jsx",
//       "type": "functional",
//       "state": [],
//       "children": []
//     },
//     {
//       "file": "SecretCloset.jsx",
//       "type": "functional",
//       "state": [],
//       "children": []
//     },
//     {
//       "file": "Upload.jsx",
//       "type": "functional",
//       "state": [],
//       "children": [
//         {
//           "file": "ImageForm.jsx",
//           "type": "functional",
//           "state": [],
//           "children": []
//         },
//         {
//           "file": "ShowImages.jsx",
//           "type": "functional",
//           "state": [],
//           "children": []
//         },
//         {
//           "file": "KidPix.jsx",
//           "type": "functional",
//           "state": [],
//           "children": []
//         }
//       ]
//     }
//   ]
// };


const dummyData = {
  name: "Colin",
  children: [
    {
      name: "T Rex monster",
      children: [{ name: "TBD 1.1" }, { name: "TBD 1.2" }],
    },
    {
      name: "Gizmo",
      children: [{ name: "Stripe" }, { name: "MoHawk" }],
    },
  ],
};

const Dendrogram = () => {
  const svgRef = useRef();

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current); // create SVG element
      const margin = { top: 50, right: 20, bottom: 20, left: 20 };
      const width = 600 - margin.left - margin.right;
      const height = 600 - margin.top - margin.bottom;

      // create tree 
      const tree = d3.tree().size([height, width - 100]); // define tree dimensions 
      const root = d3.hierarchy(dummyData); // create hierarchy based on passed in data
      const links = tree(root).links(); // create dendrogram links
      const nodes = root.descendants();

      const link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
          "d",
          d3
            .linkVertical() // vertical layout
            .x((d) => d.x)
            .y((d) => d.y)
        );

      // create dendrogram nodes
      const node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .on("click", (event, d) => {
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          } // toggles children view
          update(root); // renders updated dendrogram
        });

      // append circles to nodes
      node.append("circle")
        .attr("r", 40)
        .style("fill", "yellow"); // pass in func as second arg to conditionally render diff color

      // append text to nodes
      node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", "middle") // centers text in node
        // .attr("x", d => d.children ? -8 : 8)
        // .style("text-anchor", d => d.children ? "end" : "start")
        .text((d) => d.data.name)
        .style("fill", "blue");

      function update(root) {
        const node = svg.selectAll(".node")
          .data(root.descendants(), (d) => d.data.name);

        const nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", (d) => `translate(${d.x},${d.y})`)
          .on("click", (event, d) => {
            // toggles children view
            if (d.children) {
              d._children = d.children; // stores children in case node gets expanded later
              d.children = null; // removes children to collapse node
            } else {
              d.children = d._children; // retores children to expand node 
              d._children = null; // resets stored children 
            } 
            update(root); // renders updated dendrogram
          });

        nodeEnter.append("circle")
          .attr("r", 40)
          .style("fill", "yellow");
          ;
          
        nodeEnter.append("text")
          .attr("dy", ".31em")
          .attr("text-anchor", "middle")
          .text((d) => d.data.name)
          .style("fill", "blue");


        node.transition()
          .duration(750)
          .attr("transform", (d) => `translate(${d.x},${d.y})`);

        node.exit().remove();

        const links = svg.selectAll(".link")
          // .data(links)
          .data(root.links().filter(link => !link.source._children), d => d.source.data.name + "-" + d.target.data.name)
          
          links.enter()
          .append("path")
          .attr("class", "link")
          .attr("d", d => {
            const o = { x: d.source.x, y: d.source.y};
            return vertical({source: o, target: o});
          })
            // d3.linkVertical() // vertical layout
            //   .x((d) => d.x)
            //   .y((d) => d.y))
          .transition()
          .duration(750)
          .attr("d", d => vertical(d))

          links.transition()
            .duration(750)
            .attr("d", d => vertical(d))

          // links.exit().remove();

          const vertical = d3.linkVertical() // vertical layout
          .x((d) => d.x)
          .y((d) => d.y);
      }
    }
  }, []);

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
