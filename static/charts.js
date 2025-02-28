let uploadedColumns = [];

function uploadFile() {
  let fileInput = document.getElementById("fileInput");
  let formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("/upload", { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        alert(data.message);
        uploadedColumns = data.numeric_columns.concat(data.categorical_columns);
        updateColumnDropdown(uploadedColumns);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function updateColumnDropdown(columns) {
  let columnSelect = document.getElementById("columnSelect");
  columnSelect.innerHTML = "";
  columns.forEach((col) => {
    let option = document.createElement("option");
    option.type = "checkbox";
    option.value = col;
    option.textContent = col;
    columnSelect.appendChild(option);
  });
}

function addChart() {
  let chartType = document.getElementById("chartType").value;
  let selectedColumns = Array.from(
    document.getElementById("columnSelect").selectedOptions
  ).map((opt) => opt.value);

  if (selectedColumns.length === 0) {
    alert("Please select at least one column.");
    return;
  }

  fetch("/add_chart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chartType, columns: selectedColumns }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        renderChart(data.chartType, data.columns);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function renderChart(chartType, columns) {
  let chartContainer = document.getElementById("chartsContainer");

  // Create a new canvas element
  let canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  chartContainer.appendChild(canvas);

  let dataset = [];
  if (chartType === "bubble") {
    dataset = [
      {
        label: "Bubble Dataset",
        data: columns.map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          r: Math.random() * 20 + 5, // Bubble size (radius)
        })),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ];
  } else if (chartType === "scatter") {
    dataset = [
      {
        label: "Scatter Dataset",
        data: columns.map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
        })),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ];
  } else {
    dataset = [
      {
        label: "Dataset",
        data: columns.map(() => Math.random() * 100),
        backgroundColor: "rgba(13, 215, 215, 0.5)",
      },
    ];
  }

  new Chart(canvas, {
    type: chartType,
    data: {
      labels: columns,
      datasets: dataset,
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales:
        chartType === "bubble" || chartType === "scatter"
          ? {
              x: { type: "linear", position: "bottom" },
              y: { type: "linear" },
            }
          : {},
    },
  });
}
function generateColors(count, border = false) {
    const colors = [
        "#FF5733", "#33FF57", "#5733FF", "#FFD700", "#FF33A8", "#33D4FF",
        "#D433FF", "#33FFA8", "#A833FF", "#FF8C33", "#33FF8C", "#8C33FF"
    ];
    let generatedColors = [];
    
    for (let i = 0; i < count; i++) {
        let color = colors[i % colors.length]; // Cycle through colors
        generatedColors.push(border ? color.replace(")", ", 1)").replace("rgb", "rgba") : color);
    }
    return generatedColors;
}
