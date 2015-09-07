var foodJson = [
    {sets: [0], label:"Bars", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [1], label:"Irish", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [2], label:"Chinese", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [3], label:"Italian", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [4], label:"Fast Food", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [5], label:"Pizza", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [6], label:"German", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [7], label:"Indian", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [8], label:"Mexican", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [9], label:"Thai", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [10], label:"French", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [11], label:"Arabian", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [12], label:"Burgers", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [13], label:"Sandwiches", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [14], label:"Vegan", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [15], label:"Bakeries", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [16], label:"Japanese", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [17], label:"Nightlife", initX: 0, initY: 0, size: 3000, color: "#fff"},
    {sets: [18], label:"Coffee & Tea", initX: 0, initY: 0, size: 3000, color: "#fff"}]
    , color = ["#EBC157", "#84EC74", "#B3B5F0" ];

var w = 1000;
var h = 150;
var bubbleHeight = 168;
var indexAttributes = parseURLParams(window.location.href);
var nTop, oR;

var svgContainer = d3.select("#cuisine-svg-container")
    .style("height", h+"px");

var cuisineSvg = d3.select("#cuisine-svg-container").append("svg")
    .attr("class", "mainBubbleSVG")
    .attr("width", w)
    .attr("height",h);

drawCuisineBubbles(foodJson);

function drawCuisineBubbles(data) {
    var bubbleObj = cuisineSvg.selectAll(".topBubble")
        .data(data)
        .enter().append("g")
        .attr("id", function(d,i) {return "topBubbleAndText_" + i})
        .on("click", function(d,i) {handleCuisineBubbleClick(d,i);});

    nTop = data.length + sets.length;
    oR = 32;

    var colVals = d3.scale.category20();

    bubbleObj.append("circle")
        .attr("class", "topBubble")
        .attr("id", function(d,i) {return "topBubble" + i;})
        .attr("r", function(d) { return oR; })
        .attr("cx", function(d, i) {d.initX = getCx(d,i); return d.initX;})
        .attr("cy", function (d, i) {d.initY = getCy(d,i); return d.initY})
        .style("fill", function(d,i) {d.color = colVals(i); return d.color;}) // #1f77b4
        .style("opacity",0.7);


    bubbleObj.append("text")
        .attr("class", "topBubbleText")
        .attr("x", function(d, i) {return getCx(d,i);})
        .attr("y", function (d, i) {return getCy(d,i);})
        .style("fill", "black")//function(d,i) {d.color = colVals(i); return d.color;}) // #1f77b4
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(d) {return d.label});
}

var selectedCuisines = [];
function handleCuisineBubbleClick(d, i) {
    var size = selectedCuisines.length;
    var index = selectedCuisines.indexOf(d.label);
    // Element was not previously selected, thus add it
    if (size == 4 && index < 0) {
        alert("Max Cuisines Selected!");
    } else {
        if (index < 0) {
            selectedCuisines.push(d.label);
            addElementToVenSet(d);
        } else {
            selectedCuisines.splice(index, 1);
            removeElementFrmVenSet(d);
        }

        removeBubblesOnVenn();
        inflateBubble(d,i);
        startDrawingVenn(true);
    }
}

function inflateBubble(d, i, index) {
    var t = cuisineSvg.transition()
        .duration(d3.event.altKey ? 7500 : 350);

    t.selectAll(".topBubble")
        .attr("r", function (d, ii) {
            if (selectedCuisines.indexOf(d.label) >= 0 )
                return oR * 1.5;
            else
                return oR;
        });

    t.selectAll(".topBubbleText")
        .attr("font-size", function (d, ii) {
            if (selectedCuisines.indexOf(d.label) >= 0 )
                return 10 * 1.5;
            else
                return 10;
        });
}

function addElementToVenSet(d) {
    // First element in the sets.
    sets.push(d);

    var localArray=[];
    for (var i = 0; i < sets.length; i++) {
        if (sets[i].label) {
            localArray.push(sets[i].sets[0]);
        }
    }

    var localCombo = combine(localArray, 2);

    for (var i = 0; i < localCombo.length; i++) {
        if (localCombo[i].length > 1)
            sets.push({sets: localCombo[i], size:1000});
    }
}

function removeElementFrmVenSet(info) {
    var localSets=[];
    for (var i = 0; i < sets.length; i++) {
        var index = sets[i].sets.indexOf(info.sets[0]);
        if (index < 0)
            localSets.push(sets[i]);
    }
    sets = localSets;
}

function getCy(d, i) {
    if (i % 2 == 0)
        return (bubbleHeight + oR) / 4;
    else
        return (bubbleHeight + oR) / 2;
}

function getCx(d, i) {
    return oR*(3*(1.0+(i/2))-1);
}

var combine = function(a, min) {
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms.attributes[0];
}

var jsonResponse;

function getRestaurantList(cuisines) {

    if (selectedLocation == null || selectedLocation == "") {
        alert("Select a location");
        return;
    }

    if (cuisines == null || cuisines == "") {
        alert("Select cuisines");
        return;
    }

    if (indexAttributes == null || indexAttributes == "") {
        alert("Go back to home page and select attributes");
        return;
    }

    var localColor = "red";
    if (singleAttrName == null) {

        var link = "https://yelp-reco-dv.herokuapp.com/recommend?location=" + selectedLocation + "&categories=" + cuisines + "&preferences=" + indexAttributes;
    } else {
        localColor = bgColor;
        var link = "https://yelp-reco-dv.herokuapp.com/recommendOne?location=" + selectedLocation + "&categories=" + cuisines + "&preferences=" + singleAttrName.toLowerCase();
    }
    httpGet(link, localColor, cuisines.split(",").length);
}

function httpGet(url, givenColor, cLength)
{
    var target = document.getElementById('venn');
    spinner.spin(target);
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }
    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        jsonResponse = JSON.parse(text);

        if (jsonResponse != null)
            drawCircleOnVenn(givenColor, cLength);

    };

    xhr.onerror = function(e) {
        console.log(e);
    };
    xhr.send();

}

function createCORSRequest(method, url) {

    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}


window.onload = function() {
    var attrs = indexAttributes.split(",");
    for (var i = 0; i < color.length; i++) {
        var btnId = "btn" + (i + 1);
        document.getElementById(btnId).innerHTML = capitalizeFirstLetter(attrs[i]);
        document.getElementById(btnId).style.background = "#bdbdbd";
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var prevAttSelected;
var singleAttrName;
var counter = 0;
var bgColor = "";

$('body').on('click', '.btn-group-horizontal button', function (e) {
    document.getElementById("catList").innerHTML = "";
    if (average_aces != null)
        average_aces.hide();

    if (rating_Donut != null)
        rating_Donut.hide();

    if (prevAttSelected != null ) {

        if (prevAttSelected == this) {
            if (this.style.background == "rgb(189, 189, 189)") {
                this.style.background = "#84EC74";
                singleAttrName = e.target.textContent.trim();
                var link = "https://yelp-reco-dv.herokuapp.com/recommendOne?location=" + selectedLocation + "&categories=" + cuisines + "&preferences=" + singleAttrName.toLowerCase();
                httpGet(link, "#84EC74", cuisines.split(",").length);
                return;
            } else {
                prevAttSelected.style.background = "#bdbdbd";
            }

            singleAttrName = null;
            if (bubObject != null) {
                bubObject.remove();

                var link = "https://yelp-reco-dv.herokuapp.com/recommend?location=" + selectedLocation + "&categories=" + cuisines + "&preferences=" + indexAttributes;
                httpGet(link, "red", cuisines.split(",").length);
            }
        } else {
            prevAttSelected.style.background = "#bdbdbd";
        }
    }

    if (prevAttSelected != this) {
        prevAttSelected = this;

        counter++;
        if (counter%2 == 0)
            bgColor = "#EBC157";
        else
            bgColor = "#84EC74";
        this.style.background = bgColor;
        singleAttrName = e.target.textContent.trim();

        if (selectedLocation == null || selectedLocation == "") {
            alert("Select a location");
            return;
        }

        if (cuisines == null || cuisines == "") {
            alert("Select region on venn diagram");
            return;
        }

        if (singleAttrName == null || singleAttrName == "") {
            alert("Go back to home page and select attributes");
            return;
        }

        var link = "https://yelp-reco-dv.herokuapp.com/recommendOne?location=" + selectedLocation + "&categories=" + cuisines + "&preferences=" + singleAttrName.toLowerCase();
        httpGet(link, bgColor, cuisines.split(",").length);
    }


    $(this).addClass('active');
    $(this).siblings().removeClass('active');
});
