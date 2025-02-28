document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    console.log("Upload form submitted! ✅");  // 🔴 Check if this logs

    const fileInput = document.getElementById("csvFile");
    if (fileInput.files.length === 0) {
        console.error("No file selected! ❌");
        alert("Please select a CSV file before uploading.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    console.log("Uploading file:", fileInput.files[0].name);  // 🔴 Check if file is detected

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Upload Error:", data.error);
            alert("Error: " + data.error);
            return;
        }

        console.log("File uploaded successfully:", data);  // 🔴 Verify this appears in Console
        window.chartData = data;
        document.getElementById("visualize-btn").disabled = false;
        console.log("Visualize button enabled. ✅");
    })
    .catch(error => console.error("Upload Failed:", error));
});
