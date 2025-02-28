document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById("csvFile");
    const formData = new FormData();

    if (fileInput.files.length === 0) {
        alert("Please select a file first.");
        return;
    }

    formData.append("file", fileInput.files[0]);

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
            return;
        }

        // Store data for visualization
        window.chartData = data;

        // Show the Visualize button after successful upload
        const visualizeBtn = document.getElementById("visualize-btn");
        visualizeBtn.style.display = "block";

        console.log("File uploaded. Visualize button is now visible.");
    })
    .catch(error => console.error("Error:", error));
});

// Handle visualization separately
document.getElementById("visualize-btn").addEventListener("click", function() {
    if (!window.chartData) {
        alert("Please upload a CSV file first.");
        return;
    }

    const chartType = document.getElementById("chartType").value;
    const ctx = document.getElementById("myChart").getContext("2d");

    // Destroy previous chart instance if exists
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Create new chart
    window.myChart = new Chart(ctx, {
        type: chartType,  // Use the selected chart type
        data: {
            labels: window.chartData.labels,
            datasets: window.chartData.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    console.log("Chart displayed successfully.");
});
