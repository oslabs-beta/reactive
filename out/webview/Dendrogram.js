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
    const svgRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current);
            const margin = { top: 50, right: 20, bottom: 20, left: 20 };
            const width = 600 - margin.left - margin.right;
            const height = 1000 - margin.top - margin.bottom;
            const tree = d3.tree().size([height, width - 100])
                .nodeSize([100, 200])
                .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));
            const root = d3.hierarchy(data);
            root.descendants().forEach((d) => (d._children = d.children));
            const zoom = d3.zoom().scaleExtent([0.5, 3]).on("zoom", redraw);
            svg.call(zoom);
            const g = svg.append("g");
            function update(source) {
                // Recompute the layout
                tree(root);
                const nodes = root.descendants();
                const links = root.links();
                // Render links
                const link = g.selectAll(".link")
                    .data(links, d => d.source.data.file + "-" + d.target.data.file);
                link.enter().append("path")
                    .attr("class", "link")
                    .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y))
                    .merge(link)
                    .transition().duration(750)
                    .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));
                link.exit().remove();
                // Render nodes
                const node = g.selectAll(".node")
                    .data(nodes, d => d.data.file);
                const nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", d => `translate(${source.x0 || d.x},${source.y0 || d.y})`)
                    .on("click", (event, d) => {
                    d.children = d.children ? null : d._children;
                    update(d);
                });
                // Rectangle for each node
                nodeEnter.append("rect")
                    .attr("x", -40)
                    .attr("y", -20)
                    .attr("width", 80)
                    .attr("height", 55)
                    .attr("rx", 10)
                    .attr("ry", 10)
                    .style("fill", "yellow");
                nodeEnter.append("text")
                    .attr("y", -5)
                    .attr("text-anchor", "middle")
                    .text((d) => d.data.file)
                    .style("fill", "blue");
                // Append text for component type below file name
                nodeEnter.append("text")
                    .attr("y", 10) // Adjust vertical position to be below the file name
                    .attr("text-anchor", "middle")
                    .text((d) => `${d.data.type}`)
                    .style("fill", "green");
                // Append text for state below component type
                nodeEnter.append("text")
                    .attr("y", 25) // Further down to avoid overlap
                    .attr("text-anchor", "middle")
                    .text((d) => `State: [${d.data.state.length ? d.data.state.join(", ") : "None"}]`)
                    .style("fill", "purple")
                    .on("click", (event, d) => {
                    // Create or toggle the floating node with array values when clicked
                    const stateNode = svg.append("g")
                        .attr("class", "stateNode")
                        .attr("transform", `translate(${d.x + 100},${d.y - 40})`);
                });
                const nodeUpdate = nodeEnter.merge(node);
                nodeUpdate.transition().duration(750)
                    .attr("transform", d => `translate(${d.x},${d.y})`);
                nodes.forEach(d => {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
                node.exit().transition().duration(750)
                    .attr("transform", d => `translate(${source.x},${source.y})`)
                    .remove();
            }
            function redraw(event) {
                g.attr("transform", event.transform);
            }
            update(root);
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
        .node rect {
          fill: yellow;
        }
        .node text {
          font-size: 12px;
          fill: blue;
        }
      `)));
};
exports.default = Dendrogram;
//# sourceMappingURL=Dendrogram.js.map