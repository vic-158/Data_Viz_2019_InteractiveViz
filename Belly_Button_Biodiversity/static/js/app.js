function range(start, stop, step) {
  if (typeof stop == 'undefined') {
      // one param defined
      stop = start;
      start = 0;
  }

  if (typeof step == 'undefined') {
      step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
      return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
      result.push(i);
  }

  return result;
};

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`
  d3.json(url).then(d =>{
    // Use d3 to select the panel with id of `#sample-metadata`
    var metapanel = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    metapanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var ul = metapanel.append("ul");
    ul.attr('style','list-style: none; padding-left:0;')
    Object.entries(d).forEach(d => {
      var listitem = ul.append("li")
      listitem.text(`${d[0]}: ${d[1]}`);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`
  d3.json(url).then(d=>{
    var otu_ids = d['otu_ids'].slice(0,10);
    var otu_labels = d['otu_labels'].slice(0,10);
    var smpl_vals = d['sample_values'].slice(0,10);
    // @TODO: Build a Bubble Chart using the sample data
    var max_id = otu_ids.reduce((a,b)=>{Math.max(a,b)});
    var bubbletrace = {
      x:otu_ids,
      y:smpl_vals,
      type:'scatter',
      mode:'markers',
      marker: {size:smpl_vals.map(d=>d/2)},
    }
    // @TODO: Build a Pie Chart
    var pietrace = {
      labels: otu_ids,
      values: smpl_vals,
      type: 'pie',
      hoverinfo: 'otu_labels'
    };

    Plotly.newPlot("bubble",[bubbletrace]);
    Plotly.newPlot("pie", [pietrace]);

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
