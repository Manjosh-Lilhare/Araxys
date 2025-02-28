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
    columnSelect.innerHTML = ""; // Clear previous options

    // Create a dropdown container
    let dropdown = document.createElement("div");
    dropdown.classList.add("dropdown");

    // Create a button to show options
    let dropdownButton = document.createElement("button");
    dropdownButton.textContent = "Select Columns ▼";
    dropdownButton.classList.add("dropdown-btn");

    // Create a container for checkboxes
    let dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdown-content");
    dropdownContent.style.display = "none"; // Hidden initially

    columns.forEach((col) => {
        let label = document.createElement("label");
        label.style.display = "block";
        label.style.cursor = "pointer";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = col;
        checkbox.name = "columns";

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + col));
        dropdownContent.appendChild(label);
    });

    // Toggle dropdown visibility on button click
    dropdownButton.addEventListener("click", function () {
        dropdownContent.style.display = dropdownContent.style.display === "none" ? "block" : "none";
    });

    // Append elements
    dropdown.appendChild(dropdownButton);
    dropdown.appendChild(dropdownContent);
    columnSelect.appendChild(dropdown);
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
        backgroundColor: columns.map(() => getRandomColor()),
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
        backgroundColor: columns.map(() => getRandomColor()),
      },
    ];
  } else {
    dataset = [
        {
            label: "Dataset",
            data: columns.map(() => Math.random() * 100),
            backgroundColor: columns.map(() => getRandomColor()), // Generate a unique color for each column
            // borderColor: columns.map(() => getRandomColor(true)), // Darker border color
            borderWidth: 2
        }
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
function getRandomColor(border = false) {
    let colors = [
        "rgba(255, 99, 132, 0.8)",  // Bright Red
        "rgba(54, 162, 235, 0.8)",  // Vivid Blue
        "rgba(255, 206, 86, 0.8)",  // Bright Yellow
        "rgba(75, 192, 192, 0.8)",  // Cyan Green
        "rgba(153, 102, 255, 0.8)", // Vibrant Purple
        "rgba(255, 159, 64, 0.8)",  // Strong Orange
        "rgba(0, 255, 127, 0.8)",   // Neon Green
        "rgba(220, 20, 60, 0.8)",   // Crimson
        "rgba(0, 191, 255, 0.8)",   // Deep Sky Blue
        "rgba(255, 140, 0, 0.8)"    // Dark Orange
    ];
    let color = colors[Math.floor(Math.random() * colors.length)];
    return border ? color.replace("0.8", "1") : color;
}

