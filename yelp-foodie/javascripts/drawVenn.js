/**
 * Created by kpbhatt on 3/15/2015.
 */
var tooltip;
var div;
var setNameArray;
var cuisines;
var opts = {
    lines: 13, // The number of lines to draw
    length: 17, // The length of each line
    width: 8, // The line thickness
    radius: 21, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 58, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 0.9, // Rounds per second
    trail: 100, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};
var selectedCircleRadius, selectedCircleCx, selectedCircleCy, currentSelectedObj;
var spinner = new Spinner(opts);

function startDrawingVenn(sendRequest) {
    if (tooltip !=  null)
        tooltip.remove();

    var chart = venn.VennDiagram()
        .width(1000)
        .height(1000);

    div = d3.select("#venn")
    div.datum(sets).call(chart);

    tooltip = d3.select("body").append("div")
        .attr("class", "venntooltip");

    div.selectAll("path")
        .style("stroke-opacity", 0)
        .style("stroke", "#fff")
        .style("stroke-width", 0);

    div.selectAll("g")
        .on("mouseover", function (d, i) {

            // sort all the areas relative to the current item
            venn.sortAreas(div, d);

            var tempStr = "";
            for (var i = 0; i < d.sets.length; i++) {
                var index = d.sets[i];
                tempStr += foodJson[index].label + " & "
            }
            tempStr = tempStr.substring(0, tempStr.length - 2);

            // Display a tooltip with the current size
            tooltip.transition().duration(400).style("opacity", .9);
            tooltip.text(tempStr);

            // highlight the current path
                var selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("stroke-width", 3)
                    .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                    .style("stroke-opacity", 1);

        })

        .on("mousemove", function () {
            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })

        .on("mouseout", function (d, i) {
            tooltip.transition().duration(400).style("opacity", 0);
        if (this != currentSelectedObj) {
            var selection = d3.select(this).transition("tooltip").duration(400);
            selection.select("path")
                .style("stroke-width", 0)
                .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                .style("stroke-opacity", 0);
        }
        })
        .on("click", function (d, i) {
            if (currentSelectedObj != null) {
                d3.select(currentSelectedObj).select("path").style("stroke", "white")
                    .style("stroke-width", 0)
                    .style("stroke-opacity", 0);
            }

            cuisines = "";
            venn.sortAreas(div, d);
            setNameArray = null;
            var className = d3.select(this)[0][0].getAttribute("class");
            if (className.indexOf("circle") > -1) {
                selectedCircleRadius = d3.select(this)[0][0].getBBox().width/2;
                selectedCircleCx = selectedCircleRadius + d3.select(this)[0][0].getBBox().x;
                selectedCircleCy = selectedCircleRadius + d3.select(this)[0][0].getBBox().y;

            } else {
                var setName = className.substring(38);
                setNameArray = setName.split("_");
                selectedCircleCx = d3.select(this)[0][0].getBBox().width / 2 + d3.select(this)[0][0].getBBox().x;
                selectedCircleCy = d3.select(this)[0][0].getBBox().height / 2 + d3.select(this)[0][0].getBBox().y;
            }

            currentSelectedObj = this;
            d3.select(this).select("path").style("stroke", "red");

            for (var i = 0; i < d.sets.length; i++) {
                var index = d.sets[i];
                cuisines += foodJson[index].label + ","
            }

            cuisines = cuisines.substring(0, cuisines.length - 1);
            getRestaurantList(cuisines);
        });


    if (sendRequest) {

        if (selectedCuisines.length == 1) {
            selectedCircleRadius = 485;
            setNameArray = null;
        } else {
            setNameArray = [];
        }
        selectedCircleCx = 500;
        if (selectedCuisines.length == 3) {
            selectedCircleCy = 479;
        } else
            selectedCircleCy = 500;
        cuisines = selectedCuisines.toString();
        getRestaurantList(cuisines);
    }
}
