console.log("inside dendrogram at top") // logs
const { useRef, useEffect, useState } = require('react');
async function loadD3Module() {
  const d3 = await import('d3');

  window.addEventListener('message', event => {
    console.log("I hear an event!") // logs
    console.log("event.data.type: " + event.data.type)
    if(event.data.type === 'testMessage'){
      //console.log('Received message:', event.data.payload); // logs
    }

    if(event.data.type === 'astData') {
      console.log('astData: ' + event.data.payload) // logs
      const astData = event.data.payload;
      Dendrogram(astData)
    }
  });

const Dendrogram = (data) => {
  //console.log("inside dendrogram. this is the passed in data: ", data) // does not log
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
}
loadD3Module();

module.exports ={loadD3Module};