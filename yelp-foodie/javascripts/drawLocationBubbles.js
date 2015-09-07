/**
 * Created by kpbhatt on 4/18/2015.
 */
var locationJson = [
    {label: "Phoenix", state: ", AZ"},
    {label: "Madison", state: ", WI"},
    {label: "LasVegas", state: ", NV"},
    {label: "Pittsburgh", state: ", PA"},
    {label: "Charolette", state: ", NC"},
    {label: "UrbanaChampaign", state: ""},
    {label: "Waterloo", state: ", CAN"},
    {label: "Montreal", state: ", CAN"},
    {label: "Edinburgh", state: ", UK"},
    {label: "Karlsruhe", state: ", GER"}
];

var w = 1000;
var h = 150;
var nTopLocation, radius;
var selectedLocation = null;

var svgContainer = d3.select("#location-svg-container")
    .style("height", h+"px");

var locationSvg = d3.select("#location-svg-container").append("svg")
    .attr("class", "mainBubbleSVG")
    .attr("width", w)
    .attr("height",h);

drawLocationBubbles(locationJson);

function drawLocationBubbles(data) {
    var bubbleObj = locationSvg.selectAll(".topBubble")
        .data(data)
        .enter().append("g")
        .attr("id", function(d,i) {return "topBubbleAndText_" + i})
        .on("click", function(d,i) {handleLocationBubbleClick(d,i);});

    nTopLocation = data.length + sets.length;
    radius = 40;

    var colValues = d3.scale.category20c();

    bubbleObj.append("circle")
        .attr("class", "topBubble")
        .attr("id", function(d,i) {return "topBubble" + i;})
        .attr("r", function(d) { return radius; })
        .attr("cx", function(d, i) {return getCxVal(d,i);})
        .attr("cy", 75)
        .style("fill", function(d,i) {d.color = colValues(i); return d.color;}) // #1f77b4
        .style("opacity",0.7);


    bubbleObj.append("text")
        .attr("class", "topBubbleText")
        .attr("x", function(d, i) {return getCxVal(d,i);})
        .attr("y", 75)
        .style("fill", "black")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(d) {return d.label + d.state});
}

function getCxVal(d, i) {
    return radius*(4.85*(0.52+(i/2))-1);
}

function handleLocationBubbleClick(d, i) {
    if (bubObject != null)
        bubObject.remove();

    if (selectedLocation == null) {
        selectedLocation = d.label;
    } else {
        if (selectedLocation != d.label) {
            selectedLocation = d.label;
        }
    }

    var t = locationSvg.transition()
        .duration(d3.event.altKey ? 7500 : 350);

    t.selectAll(".topBubble")
        .attr("r", function (d, ii) {
            if (selectedLocation == d.label)
                return radius * 1.5;
            else
                return radius;
        });

    t.selectAll(".topBubbleText")
        .attr("font-size", function (d, ii) {
            if (selectedLocation == d.label)
                return 10 * 1.5;
            else
                return 10;
        });
}