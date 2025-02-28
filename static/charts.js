let uploadedColumns = [];
let charts = []; // Store all chart instances globally

function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("/upload", { method: "POST", body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert(data.message);
                uploadedColumns = data.numeric_columns.concat(data.categorical_columns);
                updateColumnDropdown(uploadedColumns);
            }
        })
        .catch(error => console.error("Error:", error));
}

function updateColumnDropdown(columns) {
    let columnSelect = document.getElementById("columnSelect");
    columnSelect.innerHTML = "";
    columns.forEach(col => {
        let option = document.createElement("option");
        option.value = col;
        option.textContent = col;
        columnSelect.appendChild(option);
    });
}

function addChart() {
    let chartType = document.getElementById("chartType").value;
    let selectedColumns = Array.from(document.getElementById("columnSelect").selectedOptions).map(opt => opt.value);

    if (selectedColumns.length === 0) {
        alert("Please select at least one column.");
        return;
    }

    fetch("/add_chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartType, columns: selectedColumns })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            renderChart(data.chartType, data.columns);
        }
    })
    .catch(error => console.error("Error:", error));
}

function renderChart(chartType, columns) {
    let chartContainer = document.getElementById("chartsContainer");
    
    // Create a new canvas element
    let canvas = document.createElement("canvas");
    chartContainer.style.display = "flex";          //ek ke baju ek ni aara
    canvas.width = 500;  // Set width
    canvas.height = 500; // Set height
    canvas.style.width = "500px";
    canvas.style.height = "500px";
    
    chartContainer.appendChild(canvas);

    let chart = new Chart(canvas, {
        type: chartType,
        data: {
            labels: columns,
            datasets: [{ 
                label: "Dataset", 
                data: columns.map(() => Math.random() * 100) 
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    let index = elements[0].index;
                    filterCharts(index);
                }
            }
        }
    });
    
    // Store the chart instance in the global array
    charts.push(chart);
    
}
function filterCharts(index) {
    charts.forEach(chart => {
        chart.data.labels = [chart.data.labels[index]];
        chart.data.datasets.forEach(dataset => {
            dataset.data = [dataset.data[index]];
        });
        chart.update();
    });
}
function showChartSelection() {
    document.getElementById("chartSelectionSection").style.display = "block";
    document.getElementById("chartsContainer").style.display = "none";
}

