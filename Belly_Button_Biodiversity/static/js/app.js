function buildMetadata(sample) {
  let sampleData = d3.select("#sample-metadata");
      sampleData.html("");
      d3.json("/metadata/"+sample).then(function(obj){
        Object.entries(obj).forEach(function([key,value]){
          console.log(`${key}: ${value}`)
          sampleData
            .append("p")
            .text(`${key}: ${value}`)
        });
      });
    }

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/"+sample).then(function(obj){
  console.log(obj.otu_ids);
// @TODO: Build a Bubble Chart using the sample data
    var xValues = obj.otu_ids;
    var yValues = obj.sample_values;
    var tValues = obj.otu_labels;
    var mSize = obj.sample_values;
    var mClrs = obj.otu_ids;

    var trace_bubble = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: mSize,
        color: mClrs
      }
    };

    var data = [trace_bubble];

    var layout = {
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot('bubble', data, layout);

  });


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json("/samples/"+sample).then(function(obj){
      var pieValue = obj.sample_values.slice(0,10);
      var pielabel = obj.otu_ids.slice(0, 10);
      var pieHover = obj.otu_labels.slice(0, 10);

      var data = [{
        values: pieValue,
        labels: pielabel,
        hovertext: pieHover,
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);
    });
};





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
