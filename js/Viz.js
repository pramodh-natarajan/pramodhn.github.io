
  // Open the file
  d3.csv("http://pramodhn.github.io/top3-updated.csv", function(error, data) {
    data.forEach(function(d) {
  });
  var selectedYear = 0, selectedIndex = 0,selectedtennisball,position;

  // Tool tip function
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>"+printTooltipTitle()+": </strong> <span style='color:red'>"+printResponse()+"%</span>";
    });

  // Create SVG element
  var svg = d3.select("body").append("svg").attr("align","center").attr("id","svgMain").attr("height", "506px").attr("width", "1000px").attr("style","background-image: url('img/Court.png')").call(tip);

  // Declare variables to be used in the program
  var net1,net2,first1,first2,return1,return2,netimage1,netimage2,returnimage1,returnimage2,firstimage1,firstimage2,playertext1,playertext2,roundnum,playername1,playername2,playername="",winlossimage;
  
  // Create a structure that will be used to store data based on player and year  
  var responsestruct = [];
  for (var i = 0; i < 7; i++) {
      responsestruct.push({
        round: "",p1: "",p2: "",n1: "",n2: "",r1: "",r2: "",f1: "",f2: "",result:""
      });
  }

  // Create all the elements to be used in the visualization
  winlossimage = svg.append("rect").attr("width",90).attr("height",120).attr("x",455).attr("y",30).style("fill","url(#win)").style("visibility","hidden");
  playername1 = svg.append("text").attr("x",250).attr("y",70).attr("text-anchor","middle").style("font-size","30px");
  playername2 = svg.append("text").attr("x",750).attr("y",70).attr("text-anchor","middle").style("font-size","30px");
  roundnum = svg.append("text").attr("text-anchor","middle").attr("x", 500).attr("y", 30).style("visibility","hidden");

  // All the tennis balls that will have the transitions
  firstimage1 = svg.append("circle").attr("class", "logo").attr("cx", 50).attr("r", 30).style("fill", "transparent").style("fill","url(#tennisball)").attr("cy", 183).style("visibility","hidden").on('mouseover', function(d){selectedtennisball=1;tip.show()}).on('mouseout', function(d){tip.hide()});
  firstimage2 = svg.append("circle").attr("class", "logo").attr("cx", 950).attr("r", 30).style("fill", "transparent").style("fill","url(#tennisball)").attr("cy", 183).style("visibility","hidden").on('mouseover', function(d){selectedtennisball=2;tip.show()}).on('mouseout', function(d){tip.hide()});
  netimage1 = svg.append("circle").attr("class", "logo").attr("cx", 50).attr("r", 30).style("fill", "transparent").style("fill","url(#tennisball)").attr("cy", 253).style("visibility","hidden").on('mouseover', function(d){selectedtennisball=3;tip.show()}).on('mouseout', function(d){tip.hide()});
  netimage2 = svg.append("circle").attr("class", "logo").attr("cx", 950).attr("r", 30).style("fill", "transparent").style("fill","url(#tennisball)").attr("cy", 253).style("visibility","hidden").on('mouseover', function(d){selectedtennisball=4;tip.show()}).on('mouseout', function(d){tip.hide()});
  returnimage1 = svg.append("circle").attr("class", "logo").attr("cx", 50).attr("r", 30).style("fill", "transparent").style("fill","url(#tennisball)").attr("cy", 323).style("visibility","hidden").on('mouseover', function(d){selectedtennisball=5;tip.show()}).on('mouseout', function(d){tip.hide()});
  returnimage2 = svg.append("circle").attr("class", "logo").attr("cx", 950).attr("r", 30).style("fill", "transparent").style("fill","url(#tennisball)").attr("cy", 323).style("visibility","hidden").on('mouseover', function(d){selectedtennisball=6;tip.show()}).on('mouseout', function(d){tip.hide()});

  // Event listener for player selection drop down
  var selectyear = d3.select("#choose-year").on("change", yearChange);
  function yearChange() {
    selectedYear = selectyear.property('selectedIndex');
    if(selectedYear != 0)
      selectedyear = selectedYear + 2003;
    visualize();
  }

  // Event listener for year selection drop down
  var selectplayer = d3.select("#choose-player").on("change", playerChange);
  function playerChange() {
    selectedIndex = selectplayer.property('selectedIndex');
    if(selectedIndex == 1){
      playername = "Roger Federer";
    } else if (selectedIndex == 2) {
      playername = "Rafael Nadal";
    } else if (selectedIndex == 3) {
      playername = "Novak Djokovic";
    } else {
      playername = "";
    }
    visualize();
  }

  // This function sets up the values for 'responsestruct' structure
  function visualize() {
    
    netimage1.style("visibility","hidden");netimage2.style("visibility","hidden");firstimage1.style("visibility","hidden");firstimage2.style("visibility","hidden");returnimage1.style("visibility","hidden");returnimage2.style("visibility","hidden");playername1.style("visibility","hidden");playername2.style("visibility","hidden");roundnum.style("visibility","hidden");winlossimage.style("visibility","hidden");
    
    if(selectedIndex == 0 && selectedYear == 0) { // When neither player nor year are chosen
      d3.select("#selection-comment").html("Select a player and year : ");
    } else if(selectedIndex == 0) { // If player is not chosen
      d3.select("#selection-comment").html("Select player : ");
    } else if (selectedYear == 0) { // If year is not chosen
      d3.select("#selection-comment").html("Select year : ");
    } else { // When both player and year are chosen
      var i,j=0,imageURL;
      for(i=0; i<7; i++) { // Fill responsestruct with empty values in case they already have any
            responsestruct[i].round = "";
            responsestruct[i].p1 = "";
            responsestruct[i].p2 = "";
            responsestruct[i].n1 = "";
            responsestruct[i].n2 = "";
            responsestruct[i].n2 = "";
      }        
      d3.select("#selection-comment").html("");      
      for (i = 0; i < data.length; i++) { 
        if(data[i].year == selectedyear+""){ // If the chosen year matches

          // First manipulate all the percentage values
          net1=data[i].net1+"";
          net1=net1.substring(0,net1.length-1);
          net2=data[i].net2+"";
          net2=net2.substring(0,net2.length-1);
          first1=data[i].firstPointWon1+"";
          first1=first1.substring(0,first1.length-1);
          first2=data[i].firstPointWon2+"";
          first2=first2.substring(0,first2.length-1);
          return1=data[i].return1+"";
          return1=return1.substring(0,return1.length-1);
          return2=data[i].return2+"";
          return2=return2.substring(0,return2.length-1);
          if(Number(net1)*5>450) net1="89";
          if((Number(net2)*5)>450) net2="89";
          if(Number(net1)*5<50) net1="15";
          if(Number(net2)*5<50) net2="15";
          if(Number(first1)*5>450) first1="89";
          if((Number(first2)*5)>450) first2="89";
          if(Number(first1)*5<50) first1="15";
          if(Number(first2)*5<50) first2="15";
          if(Number(return1)*5>450) return1="89";
          if((Number(return2)*5)>450) return2="89";
          if(Number(return1)*5<50) return1="15";
          if(Number(return2)*5<50) return2="15";

          if(data[i].player1 == playername || data[i].player2 == playername){ // If player name matches

            // Update structure values
            responsestruct[data[i].round-1].round = roundname(data[i].round);
            responsestruct[data[i].round-1].p1 = data[i].player1;
            responsestruct[data[i].round-1].p2 = data[i].player2;
            responsestruct[data[i].round-1].n1 = net1;
            responsestruct[data[i].round-1].n2 = net2;
            responsestruct[data[i].round-1].r1 = return1;
            responsestruct[data[i].round-1].r2 = return2;
            responsestruct[data[i].round-1].f1 = first1;
            responsestruct[data[i].round-1].f2 = first2;
            if(data[i].player1 == playername)
              responsestruct[data[i].round-1].result="win";
            else
              responsestruct[data[i].round-1].result="loss";
          }
        }
      }
      if(i>0)
        showTransition(0); // Perform the transition
      if(responsestruct[0].round == "") // If the player has not played any game in that year
        winlossimage.style("visibility","visible").style("fill","url(#dnp)");
    }
  }

  // This function performs the transitions based on values in the 'responsestruct' structure
  // This function repeatedly calls itself until all the values are visualized. (Max no of repeated calls = 7)
  function showTransition(i){
    // Mark the parameters
    svg.append("text").attr("x",30).attr("y",183).attr("text-anchor","left").style("font-size","15px").text("First serve point");
    svg.append("text").attr("x",30).attr("y",253).attr("text-anchor","left").style("font-size","15px").text("Net Approach");
    svg.append("text").attr("x",30).attr("y",323).attr("text-anchor","left").style("font-size","15px").text("Return point");

    if(responsestruct[i].round != "") {
      position = i;
      if(responsestruct[i].result == "win"){
          // Transitions in case of victorious game
          netimage1.style("visibility","visible").transition().attr("cx", Number(responsestruct[i].n1)*5).duration(1500);
          netimage2.style("visibility","visible").transition().attr("cx", 1000-Number(responsestruct[i].n2*5)).duration(1500);
          firstimage1.style("visibility","visible").transition().attr("cx", Number(responsestruct[i].f1)*5).duration(1500);
          firstimage2.style("visibility","visible").transition().attr("cx", 1000-Number(responsestruct[i].f2*5)).duration(1500);
          returnimage1.style("visibility","visible").transition().attr("cx", Number(responsestruct[i].r1)*5).duration(1500);
          returnimage2.style("visibility","visible").transition().attr("cx", 1000-Number(responsestruct[i].r2*5)).duration(1500);
          roundnum.style("visibility","visible").style("font-size","3px").text(responsestruct[i].round).transition().style("font-size","30px").duration(1500);
          playername1.style("visibility","visible").text(responsestruct[i].p1);
          playername2.style("visibility","visible").text(responsestruct[i].p2);
          winlossimage.transition().delay(1000).style("visibility","visible").style("fill","url(#win)");
      } else if(responsestruct[i].result == "loss") {
          // Transitions in case of lost game
          netimage1.style("visibility","visible").transition().attr("cx", Number(responsestruct[i].n2)*5).duration(1500);
          netimage2.style("visibility","visible").transition().attr("cx", 1000-Number(responsestruct[i].n1*5)).duration(1500);
          firstimage1.style("visibility","visible").transition().attr("cx", Number(responsestruct[i].f2)*5).duration(1500);
          firstimage2.style("visibility","visible").transition().attr("cx", 1000-Number(responsestruct[i].f1*5)).duration(1500);
          returnimage1.style("visibility","visible").transition().attr("cx", Number(responsestruct[i].r2)*5).duration(1500);
          returnimage2.style("visibility","visible").transition().attr("cx", 1000-Number(responsestruct[i].r1*5)).duration(1500);
          roundnum.style("visibility","visible").style("font-size","3px").text(responsestruct[i].round).transition().style("font-size","30px").duration(1500);
          playername1.style("visibility","visible").text(responsestruct[i].p2);
          playername2.style("visibility","visible").text(responsestruct[i].p1);
          winlossimage.transition().delay(1000).style("visibility","visible").style("fill","url(#loss)");
      }
      winlossimage.style("visibility","hidden");
    }

    if(i<6 && responsestruct[i].round != "") {
        // Disable the dropdowns while animations are going on
        document.getElementById("choose-player").disabled = true;
        document.getElementById("choose-year").disabled = true;
        setTimeout(function(d){
                i++;
                showTransition(i); // Recursive call to the function every 2 seconds
            },3000);
    } else{
        // Enable the dropdowns after animations are completed
        document.getElementById("choose-player").disabled = false;
        document.getElementById("choose-year").disabled = false;
    }
  }

  // This function returns the name of the round based on the input round number provided
  function roundname(roundnum) {
    if(roundnum==1)
      return "First Round";
    else if(roundnum==2)
      return "Second Round";
    else if(roundnum==3)
      return "Third Round";
    else if(roundnum==4)
      return "Fourth Round";
    else if(roundnum==5)
      return "Quarter Finals";
    else if(roundnum==6)
      return "Semi Finals";
    else if(roundnum==7)
      return "Finals";
    else
      return "NIL";
  }

  // This function gives an appropriate response value for tooltip
  function printResponse() {
    if(selectedtennisball==1)
      return responsestruct[position].f1;
    else if(selectedtennisball==2)
      return responsestruct[position].f2
    else if(selectedtennisball==3)
      return responsestruct[position].n2
    else if(selectedtennisball==4)
      return responsestruct[position].n2
    else if(selectedtennisball==5)
      return responsestruct[position].r2
    else if(selectedtennisball==6)
      return responsestruct[position].r2
  }
  // This function gives an appropriate response title for tooltip  
  function printTooltipTitle() {
    if(selectedtennisball==1||selectedtennisball==2)
      return "First Serve Point";
    else if(selectedtennisball==3||selectedtennisball==4)
      return "Net Approach";
    else if(selectedtennisball==5||selectedtennisball==6)
      return "Return Point";
  }

  });