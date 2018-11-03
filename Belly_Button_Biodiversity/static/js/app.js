function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    //debugger

    var url = `/metadata/${sample}`
    var metadata = d3.select('#sample-metadata')  
    //clear existing meta data
    metadata.html("")

    d3.json(url).then((d)=>{
    console.log("metadata",d)  

    Object.entries(d).forEach((k,v)=>{
      metadata.append("p")
              .text(k)
      })
    })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`
  d3.json(url).then((response)=>{
    // @TODO: Build a Bubble Chart using the sample data
    console.log(response)
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      marker: {
        size: response.sample_values,
        color:  response.otu_ids
      },
      text: response.otu_labels
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Marker Size',
      showlegend: false,
      height: 500,
      width: 1500
    };
    console.log(data)
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    //convert response to dictionary
    var dict = []
    for (i=0;i<response.otu_ids.length;i++){
      r ={
        'sample_values':response.sample_values[i],
        'otu_ids':response.otu_ids[i],
        'otu_labels':response.otu_labels[i]
      }
      dict.push(r)
    }
    //console.log(dict)
    //sort by sample values
    sortedData=dict.sort((a,b)=> (b.sample_values - a.sample_values));
    //console.log('sorted response...')
    console.log(sortedData)
    //slice the top 10 values
    top10_data=sortedData.slice(0,10)
    console.log(top10_data.map(d=>d.sample_values))
    console.log("*************")
    //build trace for pie chart
    var piedata = [{
      values: top10_data.map(d=>d.sample_values),
      labels: top10_data.map(d=>d.otu_labels),
      type: 'pie'
    }]

    console.log("pie data",piedata)
    
    var pielayout = {
      height: 400,
      width: 500,
      legend:{orientation:'h'}
    }
    
    Plotly.newPlot('pie', piedata, pielayout);

  })  
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
  console.log(`new option selected: ${newSample}`)
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
