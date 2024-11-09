"use strict";
// TODO for Micah to build out
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
const react_1 = __importStar(require("react"));
const d3 = __importStar(require("d3"));
const dummyData = {
    name: "Colin",
    children: [
        {
            name: "T Rex monster",
            children: [
                { name: "JARED" },
                { name: "NICK" }
            ]
        },
        {
            name: "Testing",
            children: [
                { name: "SARA" },
                { name: "ELIZABETH" }
            ]
        }
    ]
};
const Dendrogram = () => {
    const svgRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
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
    return (react_1.default.createElement("svg", { ref: svgRef, width: "600", height: "400" },
        react_1.default.createElement("style", null, `
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