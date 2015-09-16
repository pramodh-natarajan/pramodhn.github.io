(function(){
  //UI configuration
  var itemSize = 18,
    cellSize = itemSize-1,
    width = 800,
    height = 500,
    hwidth1= 420,
    hwidth2 = 500,
    hheight = 300,
    margin = {top:20,right:20,bottom:20,left:25};

  //formats
  var hourFormat = d3.time.format('%H'),
    dayFormat = d3.time.format('%j'),
    timeFormat = d3.time.format('%Y-%m-%dT%X'),
    monthDayFormat = d3.time.format('%m.%d'),
    dateFormat = d3.time.format('%d');

  //data vars for rendering
  var dateExtent = null,
    data = [],
    selectedHour=0, selectedDay=0,
    histHours = [], histDays = [],
    dayOffset = 0,
    colorCalibration = ['#aafaf6','#8BE0FE','#61AEFD','#436DF4','#4F3ED5','#42019E'],
    dailyValueExtent = {};

  //axises and scales
  var axisWidth = 0 ,
    axisHeight = itemSize*24,
    xAxisScale = d3.time.scale(),
    xAxis = d3.svg.axis()
      .orient('top')
      .ticks(d3.time.days,3)
      .tickFormat(monthDayFormat),
    yAxisScale = d3.scale.linear()
      .range([0,axisHeight])
      .domain([0,24]),
    yAxis = d3.svg.axis()
      .orient('left')
      .ticks(5)
      .tickFormat(d3.format('02d'))
      .scale(yAxisScale);

  initCalibration();
  var svg = d3.select('[role="heatmap"]');

  var heatmap = svg
    .attr('width',width)
    .attr('height',height)
  .append('g')
    .attr('width',width-margin.left-margin.right)
    .attr('height',height-margin.top-margin.bottom)
    .attr('transform','translate('+margin.left+','+margin.top+')');

  var h1svg = d3.select('[role="histogram1"]');
  var histogram1 = h1svg
    .attr('width',hwidth1)
    .attr('height',hheight)
    .append('g');

  var h2svg = d3.select('[role="histogram2"]');
  var histogram2 = h2svg
    .attr('width',hwidth2)
    .attr('height',hheight)
    .append('g');

  var rect = [];

  d3.tsv('http://pramodhn.github.io/interactive-viz-learn/01_01_2014-12_31_2014q[1].xls' , function (error, csv_data) {
    var curDate = null;
    csv_data.forEach(function(d){
      //var csv_qid = csv_data.question_id;
      var date = new Date(parseInt(d["creation_date"]) * 1000);
      date.setMinutes(0,0,0);
      if(curDate == null || curDate.getTime() != date.getTime()){
        data.push({date:date, count:1});
        curDate = date;
      } else {
        ++data[data.length - 1].count;
      }
    });
  });
  d3.tsv('http://pramodhn.github.io/interactive-viz-learn/01_01_2014-12_31_2014q[2].xls' , function (error, csv_data) {
    var curDate = null;
    csv_data.forEach(function(d){
      //var csv_qid = csv_data.question_id;
      var date = new Date(parseInt(d["creation_date"]) * 1000);
      date.setMinutes(0,0,0);
      if(curDate == null || curDate.getTime() != date.getTime()){
        data.push({date:date, count:1});
        curDate = date;
      } else {
        ++data[data.length - 1].count;
      }
    });
  });
  d3.tsv('http://pramodhn.github.io/interactive-viz-learn/01_01_2014-12_31_2014q[3].xls' , function (error, csv_data) {
    var curDate = null;
    csv_data.forEach(function(d){
      //var csv_qid = csv_data.question_id;
      var date = new Date(parseInt(d["creation_date"]) * 1000);
      date.setMinutes(0,0,0);
      if(curDate == null || curDate.getTime() != date.getTime()){
        data.push({date:date, count:1});
        curDate = date;
      } else {
        ++data[data.length - 1].count;
      }
    });

    dateExtent = d3.extent(data, function(d){
      return d.date;
    });
    countExtent = d3.extent(data, function(d){
      return d.count;
    });
    axisWidth = itemSize*(dayFormat(dateExtent[1])-dayFormat(dateExtent[0])+1);

    //render axises
    xAxis.scale(xAxisScale.range([0,axisWidth]).domain([dateExtent[0],dateExtent[1]]));
    svg.append('g')
      .attr('transform','translate('+margin.left+','+margin.top+')')
      .attr('class','x axis')
      .call(xAxis)
    .append('text')
      .text('date')
      .attr('transform','translate('+(axisWidth)+',-10)');

    svg.append('g')
      .attr('transform','translate(0,'+margin.top+')')
      .attr('class','y axis')
      .call(yAxis)
    .append('text')
      .text('time')
      .attr('transform','translate(-10,'+axisHeight+') rotate(-90)');

  var hist1XAxis = d3.svg.axis()
      .orient('bottom')
      .ticks(d3.time.days,3)
      .tickFormat(dateFormat),
    hist1YAxisScale = d3.scale.linear()
      .range([0,cellSize*15])
      .domain([60,0]),
    hist1YAxis = d3.svg.axis()
      .orient('left')
      .ticks(5)
      .scale(hist1YAxisScale);

  hist1XAxis.scale(xAxisScale.range([0,(cellSize*(dayFormat(dateExtent[1])-dayFormat(dateExtent[0])+1))])
      .domain([dateExtent[0],dateExtent[1]]));

  h1svg.append('g')
      .attr('transform','translate('+margin.left*2+','+(margin.top+(cellSize*15))+')')
      .attr('class','x axis')
      .call(hist1XAxis)
    .append('text')
      .text('date')
      .attr('transform','translate('+(axisWidth-margin.left+5)+',5)');
  h1svg.append('g')
      .attr('transform','translate('+margin.left*2+','+(margin.top)+')')
      .attr('class','y axis')
      .call(hist1YAxis)
    .append('text')
      .text('count')
      .attr('transform','translate(-25,'+(cellSize*8)+') rotate(-90)')
  h1svg.append('g')
    .append('text')
      .text('Count on each day for selected hour')
      .attr('transform','translate('+axisWidth/3+','+(cellSize*1)+')');

  var hist2XAxis = d3.svg.axis()
      .orient('bottom')
      .ticks(12)
      .tickFormat(d3.format('2d')),
    hist2YAxisScale = d3.scale.linear()
      .range([0,cellSize*15])
      .domain([60,0]),
    hist2YAxis = d3.svg.axis()
      .orient('left')
      .ticks(5)
      .scale(hist2YAxisScale);

  hist2XAxis.scale(xAxisScale.range([0,cellSize*24])
      .domain([0,23]));

  h2svg.append('g')
      .attr('transform','translate('+margin.left*2+','+(margin.top+(cellSize*15))+')')
      .attr('class','x axis')
      .call(hist2XAxis)
    .append('text')
      .text('hour')
      .attr('transform','translate('+(margin.left*2+axisWidth)+',5)');
  h2svg.append('g')
      .attr('transform','translate('+margin.left*2+','+(margin.top)+')')
      .attr('class','y axis')
      .call(hist2YAxis)
    .append('text')
      .text('count')
      .attr('transform','translate(-25,'+(cellSize*8)+') rotate(-90)');

  h2svg.append('g')
    .append('text')
      .text('Count for each hour on selected day')
      .attr('transform','translate('+axisWidth/2+','+(cellSize*1)+')');
    var i;

    for(i=0; i<(dayFormat(dateExtent[1])-dayFormat(dateExtent[0])+1); i++){
      dailyValueExtent[i] = 0;
    }
    for(i=0; i<data.length; i++) {
      if(dailyValueExtent[dayFormat(data[i].date)-dayFormat(dateExtent[0])] < data[i].count)
        dailyValueExtent[dayFormat(data[i].date)-dayFormat(dateExtent[0])] = data[i].count;
    }

    dayOffset = dayFormat(dateExtent[0]);
    rect = heatmap.selectAll('rect')
      .data(data)
    .enter().append('rect')
      .attr('width',cellSize)
      .attr('height',cellSize)
      .attr('x',function(d){
        return itemSize*(dayFormat(d.date)-dayOffset);
      })
      .attr('y',function(d){
        return hourFormat(d.date)*itemSize;
      })
      .attr('fill','#ffffff')
      .on('click', function(d){
        selectedDay = dayFormat(d.date);
        selectedHour = hourFormat(d.date);
        selectRowAndCol();
      });

    rect.filter(function(d){ return d.count>0;})
      .append('title')
      .text(function(d){
        return monthDayFormat(d.date)+' '+d.count;
      });

    renderColor();
  });

  function initCalibration(){
    d3.select('[role="calibration"] [role="example"]').select('svg')
      .selectAll('rect').data(colorCalibration).enter()
    .append('rect')
      .attr('width',cellSize)
      .attr('height',cellSize)
      .attr('x',function(d,i){
        return i*itemSize;
      })
      .attr('fill',function(d){
        return d;
      });

    //bind click event
    d3.selectAll('[role="calibration"] [name="displayType"]').on('click',function(){
      renderColor();
    });
  }

  function renderColor(){
    var renderByCount = document.getElementsByName('displayType')[0].checked;
    var calibrationSize;

    rect
      .filter(function(d){
        return (d.count>=0);
      })
      .transition()
      .delay(function(d){
        return (dayFormat(d.date)-dayOffset)*15;
      })
      .duration(500)
      .attrTween('fill',function(d,i,a){
        //choose color dynamicly
        if(renderByCount == true) {
          calibrationSize = (countExtent[1] - countExtent[0])/6;
          for(j=0; j<colorCalibration.length; j++){
            if(d.count <= ((countExtent[0])+(calibrationSize*(j+1)))){
              colorID = colorCalibration[j];
              break;
            }
          }
        } else {
          calibrationSize = (dailyValueExtent[dayFormat(d.date)-dayFormat(dateExtent[0])])/6;
          for(j=0; j<colorCalibration.length; j++){
            if(d.count <= (calibrationSize*(j+1)) ) {
              colorID = colorCalibration[j];
              break;
            }
          }
        }

        return d3.interpolate(a,colorID);
      });
  }
  function selectRowAndCol() {
    histDays = [];
    histHours = [];
    rect
      .filter(function(d){
        return (d.count>=0);
      })
      .attr('opacity', function(d){
        if(hourFormat(d.date) == selectedHour && dayFormat(d.date) == selectedDay) {
          histDays.push({date:d.date, count:d.count});
          histHours.push({date:d.date, count:d.count});
          return 0.5;
        } else if(hourFormat(d.date) == selectedHour) {
          histDays.push({date:d.date, count:d.count});
          return 0.5;
        } else if(dayFormat(d.date) == selectedDay) {
          histHours.push({date:d.date, count:d.count});
          return 0.5;
        }
        return 1;
      });
    var i,less;

    histHours.sort(compareHours);
    histDays.sort(compareDays);

    if(dayFormat(histDays[0].date) > dayFormat(dateExtent[0]) ) {
      histDays.push({date:dateExtent[0], count:0});
      for(i=histDays.length-1; i>0; i--){
        histDays[i].date = histDays[i-1].date;
        histDays[i].count = histDays[i-1].count;
      }
      histDays[0].date = dateExtent[0];
      histDays[0].count = 0;
    }

    if(hourFormat(histHours[0].date) > 0) {
      var j = histHours.length;
      for(i=0; i< 24-j; i++){
        histHours.push({date:dateExtent[0], count:0});
      }

      for(i=23; i>(24-j); i--) {
        histHours[i].date = histHours[i-24+j].date;
        histHours[i].count = histHours[i-24+j].count;
      }

      for(j=i-1; j>=0; j--) {
      histHours[j].date = dateExtent[0];
      histHours[j].count = 0;
      }
    }

// Histogram 1

  histogram1.selectAll('rect').remove();

  var chart1 = histogram1.selectAll('rect')
      .data(histDays)
      .enter()
      .append('rect')
      .attr('fill', function(d) {
        if(dayFormat(d.date) == selectedDay)
          return "black";
        else
          return "gray";
      })
      .attr('width',cellSize)
      .attr('height', function(d) {
        return d.count*cellSize/4;
      })
      .attr('x', function(d, i) {
        return (margin.left*2) + (i*cellSize);
      })
      .attr('y', function(d) {
        return margin.top + (cellSize*15) - (d.count*cellSize/4 );
      });


// Histogram 2

  histogram2.selectAll('rect').remove();

  var chart2 = histogram2.selectAll('rect')
      .data(histHours)
      .enter()
      .append('rect')
      .attr('fill', function(d) {
        if(hourFormat(d.date) == selectedHour)
          return "black";
        else
          return "gray";
      })
      .attr('width',cellSize)
      .attr('height', function(d) {
        return d.count*cellSize/4;
      })
      .attr('x', function(d, i) {
        return (margin.left*2) + (i*cellSize);
      })
      .attr('y', function(d) {
        return margin.top + (cellSize*15) - (d.count*cellSize/4 );
      });

  }

function compareHours(a,b) {
  if (hourFormat(a.date) < hourFormat(b.date))
     return -1;
  if (hourFormat(a.date) > hourFormat(b.date))
    return 1;
  return 0;
}

function compareDays(a,b) {
  if (dayFormat(a.date) < dayFormat(b.date))
     return -1;
  if (dayFormat(a.date) > dayFormat(b.date))
    return 1;
  return 0;
}

  //extend frame height in `http://bl.ocks.org/`
  d3.select(self.frameElement).style("height", "600px");
})();
