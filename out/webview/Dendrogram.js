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
<<<<<<< HEAD
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
    const svgRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
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
=======
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
>>>>>>> dev
                .data(links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", d3
<<<<<<< HEAD
                .linkVertical() // vertical layout
                .x((d) => d.x)
                .y((d) => d.y));
            // create dendrogram nodes
=======
                .linkVertical()
                .x(d => d.x)
                .y(d => d.y));
            // Render nodes
>>>>>>> dev
            const node = svg.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
<<<<<<< HEAD
                .attr("transform", (d) => `translate(${d.x},${d.y})`)
=======
                .attr("transform", d => `translate(${d.x},${d.y})`)
>>>>>>> dev
                .on("click", (event, d) => {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                }
                else {
                    d.children = d._children;
                    d._children = null;
<<<<<<< HEAD
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
                    }
                    else {
                        d.children = d._children; // retores children to expand node 
                        d._children = null; // resets stored children 
                    }
                    update(root); // renders updated dendrogram
=======
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
                    }
                    else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(root);
>>>>>>> dev
                });
                nodeEnter.append("circle")
                    .attr("r", 40)
                    .style("fill", "yellow");
<<<<<<< HEAD
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
                    .data(root.links().filter(link => !link.source._children), d => d.source.data.name + "-" + d.target.data.name);
=======
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
>>>>>>> dev
                links.enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("d", d => {
                    const o = { x: d.source.x, y: d.source.y };
                    return vertical({ source: o, target: o });
                })
<<<<<<< HEAD
                    // d3.linkVertical() // vertical layout
                    //   .x((d) => d.x)
                    //   .y((d) => d.y))
=======
>>>>>>> dev
                    .transition()
                    .duration(750)
                    .attr("d", d => vertical(d));
                links.transition()
                    .duration(750)
                    .attr("d", d => vertical(d));
<<<<<<< HEAD
                // links.exit().remove();
                const vertical = d3.linkVertical() // vertical layout
                    .x((d) => d.x)
                    .y((d) => d.y);
            }
        }
    }, []);
=======
                const vertical = d3.linkVertical()
                    .x(d => d.x)
                    .y(d => d.y);
            }
        }
    }, [data]);
>>>>>>> dev
    return (react_1.default.createElement("svg", { ref: svgRef, width: "600", height: "600", viewBox: "-70 -50 600 600" },
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