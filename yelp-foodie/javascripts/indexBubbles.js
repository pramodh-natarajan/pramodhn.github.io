var diameter = 500,
    attrCount = 0;

var selectedAttributes = [];

var pack = d3.layout.pack()
    .size([diameter - 4, diameter - 4])
    .sort( function(a, b) {
        return -(a.value - b.value);
    })
    .value(function(d) { return d.size; });

var svg = d3.select("#indexBubbles").append("svg")
    .attr("width", diameter)
    .attr("height", diameter);

var data = getData();

var vis = svg.datum(data).selectAll(".node")
    .data(pack.nodes)
    .enter()
    .append("g")
    .on("click", function(d, i) { if (d.name != "Root") updateVis(d, i);});


var circles = vis.append("circle")
    .style("fill", function(d, i) { if (d.name == "Root") return "beige"; else return "#bdbdbd"; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.r; });


var circleTexts = vis.append("text")
    .attr("dy", ".3em")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .style("text-anchor", "middle")
    .text(function(d) {  if (d.name == "Root") return ""; else return d.name });

function updateVis(d, i) {

    pack.value(function (xd) {
        return getSize(xd, d.name)
    });

    var data1 = pack.nodes(data);

    circles.transition()
        .duration(1500)
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.r
        })
        .style("fill", function (xD) {
            var color = "";
            if (d.name == xD.name && selectedAttributes.indexOf(xD.name.toLowerCase()) >= 0)
                color =  "#62CC8E";
            else if (d.name != xD.name && selectedAttributes.indexOf(xD.name.toLowerCase()) >= 0)
                color =  "#62CC8E";
            else  if (xD.name == "Root")
                color =  "beige";
            else
                color =  "#bdbdbd";
            return color;
        })
        .each('end',function(xD){
            if (attrCount == 3) {
                if (xD.name == d.name)
                    window.open("dataViz.html?attributes="+selectedAttributes, "_self");
            }
        });

    circleTexts.transition()
        .duration(1500)
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });

};

function getSize(xd, name) {
    // Selected node
    if (xd.name == name) {
        var index = selectedAttributes.indexOf(xd.name.toLowerCase());

        if (index == -1) {
            selectedAttributes.push(xd.name.toLowerCase());
            attrCount++;
            return xd.size * 3;
        } else {
            selectedAttributes.splice(index, 1);
            attrCount--;
            return xd.size;
        }
    } else {
        var index = selectedAttributes.indexOf(xd.name.toLowerCase());

        if (index == -1) {
            return xd.size;
        } else {
            return xd.size * 3;
        }

    }
}

function getData() {
    return {
        "name": "Root",
        "children": [
            {"name":"Accurate", "size":500, "color":""},
            {"name":"Ambience", "size":500, "color":""},
            {"name":"Best", "size":500, "color":""},
            {"name":"Commitment", "size":500, "color":""},
            {"name":"Confidence", "size":500, "color":""},
            {"name":"Delivery", "size":500, "color":""},
            {"name":"Different", "size":500, "color":""},
            {"name":"Economy", "size":500, "color":""},
            {"name":"Enormous", "size":500, "color":""},
            {"name":"Excellent", "size":500, "color":""},
            {"name":"Fantastic", "size":500, "color":""},
            {"name":"Filling", "size":500, "color":""},
            {"name":"Flavor", "size":500, "color":""},
            {"name":"Fresh", "size":500, "color":""},
            {"name":"Friendly", "size":500, "color":""},
            {"name":"Grow", "size":500, "color":""},
            {"name":"Happy", "size":500, "color":""},
            {"name":"Honest", "size":500, "color":""},
            {"name":"Hot", "size":500, "color":""},
            {"name":"Love", "size":500, "color":""},
            {"name":"Memorable", "size":500, "color":""},
            {"name":"Neighborhood", "size":500, "color":""},
            {"name":"New", "size":500, "color":""},
            {"name":"Pleasant", "size":500, "color":""},
            {"name":"Price", "size":500, "color":""},
            {"name":"Quality", "size":500, "color":""},
            {"name":"Quick", "size":500, "color":""},
            {"name":"Reasonable", "size":500, "color":""},
            {"name":"Recommend", "size":500, "color":""},
            {"name":"Service", "size":500, "color":""},
            {"name":"Special", "size":500, "color":""},
            {"name":"Stuff", "size":500, "color":""},
            {"name":"Sturdy", "size":500, "color":""},
            {"name":"Surprise", "size":500, "color":""},
            {"name":"Taste", "size":500, "color":""},
            {"name":"Together", "size":500, "color":""},
            {"name":"Worth", "size":500, "color":""},
        ]

    };
}


  