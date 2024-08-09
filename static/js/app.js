// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    let filtered  = metadata.filter(sampleData => sampleData.id === parseInt(sample));
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadata_panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metadata_panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let keys = Object.keys(filtered[0]);
    let values = Object.values(filtered[0]);
    for (let i = 0; i < keys.length; i++) {
      // generate metadata string to display
      let line_string = `${keys[i].toUpperCase()}: ${values[i]}`
      // display metadata as tags in metadata div
      metadata_panel.append('p').text(line_string);
    }
    console.log(`Metadata updated for sample: ${sample}`);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    let bact_samples = data.samples;
    // Filter the samples for the object with the desired sample number
    let filtered = bact_samples.filter(sampleData => sampleData.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    // bubble: x-val, colors
    // bar: y-val
    let otu_ids = filtered.otu_ids;
    // bubble: y-val, size
    // bar: x-val
    let sample_values = filtered.sample_values;
    // bubble: hover text
    // bar: hover text
    let otu_labels = filtered.otu_labels;

    // Build a Bubble Chart
    let bubble_data = [{ 
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: 'scatter',
      mode: 'markers',
      marker:{
        size: sample_values,
        color: otu_ids,
        sizeref: 1.5
      }
    }];

    let bubble_layout = {
      title : "Bacteria Culture Per Sample",
      xaxis : {
        title: "OTU ID",
        range: [-200, 3500]
      },
      yaxis: {
        title: "Number of Bacteria",
        range: [-25, 250]
      }
    };

    // Render the Bubble Chart  
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_data = [{
      type: 'bar',
      orientation: 'h',
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      transforms: [{
        type: 'sort',
        target: 'x',
        order: 'descending'
      }]
    }];

    let bar_layout = {
      title : "Top 10 Bacteria Cultures Found",
      xaxis : {
        title: "Number of Bacteria"
      }
    };

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart
    Plotly.newPlot("bar", bar_data, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_ids = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sample_ids.forEach(id => {
      dropdown.append('option').attr('value', id).attr('label', id);
    });

    // Get the first sample from the list
    let first_sample = dropdown.select('option').property("value");
    // Build charts and metadata panel with the first sample
    optionChanged(first_sample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  console.log(`Sample ${newSample} selected`);
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

d3.select('#selDataset').on('change', optionChanged(this));

// Initialize the dashboard
init();