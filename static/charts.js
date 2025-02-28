document.getElementById("visualize-btn").addEventListener("click", function() {
    if (!window.chartData) {
        alert("Please upload a CSV file first.");
        return;
    }

    const chartType = document.getElementById("chartType").value;
    const ctx = document.getElementById("myChart").getContext("2d");

    console.log("Creating chart with data:", window.chartData);

    // 🔴 FIX: Check if a chart instance exists before destroying it
    if (window.myChart instanceof Chart) {
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
