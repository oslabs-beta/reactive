const { useMemo } = require('react');
const { tree } = require('./parser.js');
const d3 = require('d3');

const componentTree = tree

// Set dimensions and margins for the SVG
const width = 800;
const height = 600;
const margin = {top: 20, right: 120, bottom: 20, left: 120};

// Append SVG to the body (or wherever you want to insert the visualization)
const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create a hierarchical structure from your component tree JSON
const root = d3.hierarchy(componentTree);

// Define the D3 tree layout
const treeLayout = d3.tree().size([height, width]);

// Apply the layout to the root
treeLayout(root);

// Create links between nodes
const link = svg.selectAll(".link")
  .data(root.links())
  .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

// Create nodes for each component in the tree
const node = svg.selectAll(".node")
  .data(root.descendants())
  .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`);

// Add circles to the nodes
node.append("circle")
    .attr("r", 5);

// Add text labels to the nodes (component names)
node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => d.children ? -10 : 10)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name);

