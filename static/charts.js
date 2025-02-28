document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById("csvFile");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById("myChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: data
        });
    })
    .catch(error => console.error("Error:", error));
});
