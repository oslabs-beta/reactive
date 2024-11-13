"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// //console.log("Inside Dendrogram at top")
const react_1 = __importStar(require("react"));
const client_1 = require("react-dom/client");
const d3 = __importStar(require("d3"));
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
        const root = (0, client_1.createRoot)(container); // Create root once, ideally at the start of the app
        root.render(react_1.default.createElement(Dendrogram, { data: astData }));
    }
});
const Dendrogram = ({ data }) => {
    //console.log("inside dendrogram. this is the passed in data: ", data); // logs
    const svgRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current); // create SVG element
            const margin = { top: 50, right: 20, bottom: 20, left: 20 };
            const width = 600 - margin.left - margin.right;
            const height = 1000 - margin.top - margin.bottom;
            // create tree 
            const tree = d3.tree().size([height, width - 100])
                .nodeSize([100, 200])
                .separation((a, b) => (a.parent === b.parent ? 1.5 : 2)); // define tree dimensions 
            const root = d3.hierarchy(data); // create hierarchy based on passed in data
            root.descendants().forEach((d) => (d._children = d.children));
            const links = tree(root).links(); // create dendrogram links
            const nodes = root.descendants();
            const zoom = d3.zoom().scaleExtent([0.5, 15]).on("zoom", redraw);
            svg.call(zoom);
            const g = svg.append("g"); // The group that holds everything (nodes + links)
            g.selectAll(".link")
                .data(links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", d3.linkVertical().x((d) => d.x).y((d) => d.y));
            // create dendrogram nodes
            const node = g
                .selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", (d) => `translate(${d.x},${d.y})`)
                .on("click", (event, d) => {
                // Toggle children on click
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                }
                else {
                    d.children = d._children;
                    d._children = null;
                }
                update(root); // Re-render the tree after toggling
            });
            // append circles to nodes
            node.append("rect")
                .attr("x", -40)
                .attr("y", -20)
                .attr("width", 80)
                .attr("height", 55)
                .attr("rx", 10)
                .attr("ry", 10)
                .style("fill", "yellow"); // pass in func as second arg to conditionally render diff color
            // append text to nodes
            node.append("text")
                .attr("dy", ".31em")
                .attr("text-anchor", "middle") // centers text in node
                // .attr("x", d => d.children ? -8 : 8)
                // .style("text-anchor", d => d.children ? "end" : "start")
                .text((d) => d.data.file)
                .style("fill", "blue");
            // node.append("text")
            // .attr("dy", ".31em")
            // .attr("text-anchor", "end") // centers text in node - TODO: update positioning of text 
            // // .attr("x", d => d.children ? -8 : 8)
            // // .style("text-anchor", d => d.children ? "end" : "start")
            // .text((d) => d.data.type) 
            // .style("fill", "blue");
            // Update function to handle re-rendering of the tree (for collapsibility)
            function update(root) {
                tree(root); // Update tree layout
                const nodes = g.selectAll(".node").data(root.descendants(), (d) => d.data.file);
                // Enter new nodes
                const nodeEnter = nodes.enter().append("g").attr("class", "node").attr("transform", (d) => `translate(${d.x},${d.y})`);
                nodeEnter.append("rect")
                    .attr("x", -40)
                    .attr("y", -20)
                    .attr("width", 80)
                    .attr("height", 55)
                    .attr("rx", 10)
                    .attr("ry", 10)
                    .style("fill", "yellow");
                nodeEnter
                    .append("text")
                    .attr("dy", ".31em")
                    .attr("text-anchor", "middle")
                    .text((d) => d.data.file)
                    .style("fill", "blue");
                // Transition nodes
                nodes.transition().duration(750).attr("transform", (d) => `translate(${d.x},${d.y})`);
                // Remove exiting nodes
                nodes.exit().remove();
                // Update links
                const link = g
                    .selectAll(".link")
                    .data(root.links(), (d) => d.source.data.file + "-" + d.target.data.file);
                link.enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("d", (d) => {
                    const o = { x: d.source.x, y: d.source.y }; // Temporary placeholder for links
                    return d3.linkVertical().x((d) => d.x).y((d) => d.y)({ source: o, target: o });
                })
                    .transition()
                    .duration(750)
                    .attr("d", (d) => d3.linkVertical().x((d) => d.x).y((d) => d.y)(d));
                // Transition links
                link.transition().duration(750).attr("d", (d) => d3.linkVertical().x((d) => d.x).y((d) => d.y)(d));
                // Remove exiting links
                link.exit().remove();
            }
            // Handle zoom behavior
            function redraw(event) {
                // Apply the zoom transformation to the entire <g> element that holds the nodes and links
                g.attr("transform", event.transform);
            }
        }
    }, [data]);
    return (react_1.default.createElement("svg", { ref: svgRef, width: "1400", height: "700", viewBox: "-70 -50 1400 700" },
        react_1.default.createElement("style", null, `
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
      `)));
};
exports.default = Dendrogram;
//# sourceMappingURL=Dendrogram.js.map