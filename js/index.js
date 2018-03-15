d3.csv("comp6214_cw1.csv", function(data){
    return {
        id: data["Unique Investment Identifier"],
        agency: data["Agency Name"],
        lifecost: +data["Lifecycle Cost"],
        plancost: +data["Planned Cost ($ M)"],
        actualcost: +data["Projected/Actual Cost ($ M)"]
    };
},function(error, data){
    if (error){
        console.log("ERROR: ");
        console.log(error);
        return;
    }

    var margin = { top: 30, right: 30, bottom: 150, left: 50 };
    var width = 960;
    var height = 500;
    var svg = d3.select("body").select(".container")
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

    var totalData = data.filter(function(d){
        return d.id == "Total"; 
    });
    
    console.log(totalData);

    totalData = totalData.sort(function(a, b){return b.lifecost - a.lifecost;})

    var y = d3.scaleLinear()
    .domain([0, d3.max(totalData, function(d){return d.lifecost;})])
    .range([500, 0]);

    var y2 = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){return d.actualcost;})])
    .range(500, 0);

    var x = d3.scaleBand()
    .domain(totalData.map(function(d){return d.agency;}))
    .range([0, width])
    .padding(0.1);

    svg.selectAll(".bar")
    .data(totalData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {return x(d.agency);})
    .attr("width", x.bandwidth())
    .attr("y", function(d) {return y(d.lifecost);})
    .attr("height", function(d){ return height - y(d.lifecost);})
    .attr("fill", "#3498DB")

    svg.append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 6)
        .attr("x", 2)
        .attr("transform", "rotate(80)")
        .style("text-anchor", "start");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .call(d3.axisRight(y2));

    var line = d3.line()
        .x(function(d) { return x(d.agency); })
        .y(function(d) { return y(d.actualcost); });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
});

