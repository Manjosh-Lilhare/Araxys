let uploadedColumns = [];

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
    let canvas = document.createElement("canvas");
    chartContainer.appendChild(canvas);

    new Chart(canvas, {
        type: chartType,
        data: {
            labels: columns,
            datasets: [{ label: "Dataset", data: columns.map(() => Math.random() * 100) }]
        }
    });
}
