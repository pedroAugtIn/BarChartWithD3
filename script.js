fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(response => response.json())
        .then(data => {
            const dataset = data.data;

            const w = 1100;
            const h = 660;
            const padding = 50; 
            const barWidth = (w - 2 * padding) / dataset.length; 

            const maxGDP = d3.max(dataset, d => d[1]);

            const xScale = d3.scaleTime()
                .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
                .range([padding, w - padding]);

            const yScale = d3.scaleLinear()
                .domain([0, maxGDP])
                .range([h - padding, padding]);

            const svg = d3.select('body')
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            let tooltip = d3
                .select('body')
                .append('div')
                .attr('id', 'tooltip')
                .style('opacity', 0)
                .attr("data-date", ""); 

            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", (d, i) => xScale(new Date(d[0])))
                .attr("y", d => yScale(d[1]))
                .attr("width", barWidth)
                .attr("height", d => h - padding - yScale(d[1]))
                .attr("fill", "navy")
                .attr("class", "bar")
                .attr("data-date", d => d[0]) 
                .attr("data-gdp", d => d[1]) 
                .on("mouseover", function(event, d) {
                    const rect = this.getBoundingClientRect(); 
                    const xPosition = rect.x + rect.width / 2; 
                    const yPosition = rect.y - 10; 

                    const dataDate = d3.select(this).attr("data-date");
                    const dataValue = d3.select(this).attr("data-gdp");
                    tooltip.transition()
                        .style("opacity", .9);
                    tooltip.html(`${dataDate}<br>$ ${dataValue} Billion.`)
                        .style("left", (xPosition) + "px")
                        .style("top", (yPosition) + "px")
                        .attr("data-date", dataDate); 

                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            svg.append("g")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .attr("id", "x-axis")
                .call(xAxis);

            svg.append("g")
                .attr("transform", "translate(" + padding + ",0)")
                .attr("id", "y-axis")
                .call(yAxis);

            svg.append("text")
                .attr("x", w / 2)
                .attr("y", padding / 2)
                .attr("text-anchor", "middle")
                .attr("id", "title")
                .text("Gross Domestic Product (GDP) for the United States")
                .attr("font-size", 20);
        });