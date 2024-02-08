
function buildMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        let metadata = data.metadata;
        // Filter the data 
        let startArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = startArray[0];
        // Use d3 to select 
        let PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // tags for each key-value in the metadata.
        for (let key in result){
            PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
        };
    });
}

function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        let samples = data.samples;
        let startArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = startArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        // Build a Bubble Chart
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };
        let bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        let barData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}

function init() {
    // dropdown option
    let selector = d3.select("#selDataset");

    // list names
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        let sampleNames = data.names;

        for (let i = 0; i < sampleNames.length; i++){
            selector
                .append("option")
                .text(sampleNames[i])
                .property("value", sampleNames[i]);
        };

        // samples for plots 
        let oneSample = sampleNames[0];
        buildCharts(oneSample);
        buildMetadata(oneSample);
    });
}

function optionChanged(newSample) {
    // Fetch the data
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
