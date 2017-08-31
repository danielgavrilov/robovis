import d3 from "d3";

import frontIR from "./frontIR";
import sideIR from "./sideIR";
import voltages from "./voltages";

export default function(element) {

  let selection = d3.select(element);

  let margin = {top: 20, bottom: 20, left: 80, right: 20},
      width = 960 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  let svgRoot = selection.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  let domainLimit = [0, 4*60*1e3];

  let x = d3.scale.linear()
      .domain(domainLimit)
      .range([0, width]);

  let svg = svgRoot.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let zoom = d3.behavior.zoom()
      .on("zoom", zoomed)
      .on("zoomstart", function() { d3.select(this).style("cursor", "move"); })
      .on("zoomend",   function() { d3.select(this).style("cursor", ""); })
      .x(x);

  let timeBar = svgRoot.append("rect")
      .attr("class", "time-bar")
      .attr("x", 0)
      .attr("y", 15)
      .attr("height", height)
      .attr("width", 1)

  let interactionArea = svgRoot.append("rect")
      .attr("class", "interaction-area")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(zoom);

  let formatTime = d3.time.format("%M:%S"),
      formatMinutes = (d) => formatTime(new Date(2012,0,1,0,0,0,d));

  let xAxis = d3.svg.axis()
      .scale(x)
      .orient("top")
      .tickFormat(formatMinutes)
      .tickSize(-height);

  let xAxisElem = svg.append("g")
     .attr("class", "x axis")
     .attr("transform", `translate(0,${-margin.top + 10})`)
     .call(xAxis);

  let container = svg.append("g")
      .attr("class", "container");

  let front = frontIR({ container, x, width, height: 80, offsetTop: 0 });
  let side  = sideIR({ container, x, width, height: 55, offsetTop: 110 });
  let voltagesGraph  = voltages({ container, x, width, height: 60, offsetTop: 200 });

  function zoomed() {
    redraw();
  }

  function updateDomain(extent) {
    x.domain(extent);
    zoom.x(x);
    redraw();
  }

  function redraw() {
    front.redraw();
    side.redraw();
    voltagesGraph.redraw();
    xAxisElem.call(xAxis);
  }

  return {
    frontIR: front,
    sideIR: side,
    voltages: voltagesGraph,
    onTimeChange: function(f) {
      svgRoot.on("mousemove", function() {
        let p = d3.mouse(svg.node());
        timeBar.attr("transform", `translate(${p[0] + margin.left}, 0)`);
        f(x.invert(p[0]));
      });
    },
    domain: updateDomain
  };

}

// auto x domain?
