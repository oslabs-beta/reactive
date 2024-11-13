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
console.log("inside dendrogram at top"); // logs
const { useRef, useEffect } = require('react');
const d3 = __importStar(require("d3"));
window.addEventListener('message', event => {
    console.log("I hear an event!"); // logs
    console.log("event.data.type: " + event.data.type);
    if (event.data.type === 'testMessage') {
        console.log('Received message:', event.data.payload); // logs
    }
    if (event.data.type === 'astData') {
        console.log('astData: ' + event.data.payload); // logs
        const astData = event.data.payload;
        Dendrogram(astData);
    }
});
const Dendrogram = (data) => {
    console.log("inside dendrogram. this is the passed in data: ", data); // does not log
    const svgRef = useRef();
    //const [tree, setTree] = useState({});
    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current);
            const width = 600;
            const height = 400;
            const tree = d3.tree().size([height, width - 100]);
            const root = d3.hierarchy(data);
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
    return (React.createElement("svg", { ref: svgRef, width: "600", height: "400" },
        React.createElement("style", null, `
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
      `)));
};
exports.default = Dendrogram;
//# sourceMappingURL=Dendrogram.js.map