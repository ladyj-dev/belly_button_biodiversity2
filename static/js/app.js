// create a function called buildMetadata
function buildMetadata(sample) {
  // grab data using d3.json and use then method to chain
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // filter data using key id wittles down entire list to id by using double = it gives you more flexibility than === exactly equal to
    var sampleObject = metadata.filter(
      (sampleObject) => sampleObject.id == sample
    );
    console.log(sampleObject[0]);
    var result = sampleObject[0];
    // grab panel from index html panel class (can be seen inside inspect) by grabing sample metadata id
    var Panel = d3.select("#sample-metadata");
    // clear html in the panel
    Panel.html("");

    // Object.entries (use for each to pull out key values and add h tag to each value pair)
    Object.entries(result).forEach(([key, value]) => {
      Panel.append("h5")
        // use a h tag to append above (uppercase method)
        .text(`${key.toUpperCase()}:${value}`);
    });
  });
}

function buildCharts(sample) {
  // grab data
  d3.json("samples.json").then((data) => {
    /*Use sample_values as the values for the bar chart.
    Use otu_ids as the labels for the bar chart.
    Use otu_labels as the hovertext for the chart.
     */
    var samples = data.samples.filter(
      (samplesObject) => samplesObject.id == sample
    )[0];
    console.log(samples);

    // ############################################################

    // build bar chart; using plotly.com/javascript documentation as guide
    // reaching into samples from json to pull out items desired
    var ylabel = samples.otu_ids.slice(0,10).map(otuID => `OTU ${(otuID)}`).reverse();

    var barData = [
      {
        y: ylabel,
        type: "bar",
        x: samples.sample_values.slice(0, 10).reverse(),
        text: samples.otu_labels.slice(0, 10).reverse(),
        orientation: "h",
        marker: {
          color: "#C8A2C8",
          width: 0.5,
        },
      },
    ];
    var barLayout = {
      title: "Top Ten Operational Taxonomic Units",
      font: { size: 14 },
    };
    // var config = {responsive: true}

    Plotly.newPlot("bar", barData, barLayout);

    // #############################################

    // build bubble chart
    /*Use otu_ids for the x values.

    Use sample_values for the y values.

    Use sample_values for the marker size.

    Use otu_ids for the marker colors.

    Use otu_labels for the text values.
    */
    var bubbleData = [{
        x: samples.otu_ids,
        y: samples.sample_values,
        text: samples.otu_labels,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids,
            colorscale:"Picnic"
        }
    }];

    var bubbleLayout = {
        title: "Bacteria Per Sample",
        hovermode:   "closest",
        xaxis: {title:  "OTU ID"}
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });
}

//  single angular gauge chart
// var gaugeData = [
//     {
//     domain: {x: [0, 1], y: [0, 1]},
//     title: {text: "Belly Button Washing Frequency Per Week"},
//     type: "indicator",
//     mode: "gauge+number",
//     gauge: { axis: {range: [0-1, 8-9]}}
//     }
// ];

// var gaugeLayout = { width : 600, height: 400};
// Plotly.newPlot("gauge", gaugeData, gaugeLayout);
//
// ################################################################################
// event listener from html file:<select id="selDataset" onchange="optionChanged(this.value)"></select>
// build optionChanged function (nextSample = this value)

function optionChanged(testSample) {
  // grab the data from selector; build using value
  buildMetadata(testSample);
  console.log(testSample);
  buildCharts(testSample);
}

// create an init function
function init() {
  console.log("start of init");
  // get a reference to selDataset
  var selector = d3.select("#selDataset");

  // create a dropdown menu with names
  d3.json("samples.json").then((data) => {
    // .names refers to key in json object
    var sampleNames = data.names;
    console.log(sampleNames);
    // check in live server/inspect should see sample names called
    // use forEach to grab out each sample name(w3 school on change provided resource for onchange Event and connection to line 26 of my index.html file)
    // remember to always use two parens with foreach
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // call functions;

    // grab initial value - sample #947 (testSample)
    var testSample = sampleNames[0];

    // buildMetadata(testSample)
    buildMetadata(testSample);

    // buildCharts(testSample)
    buildCharts(testSample);
  });
}

//call init function
init();
