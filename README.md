# CSV Data Visualization

## Project Overview
This project is a web-based CSV data visualization tool that allows users to upload CSV files, select specific columns, and generate various interactive charts using Chart.js. The user-friendly interface ensures an easy and seamless experience for exploring data visually.

## Features
- Upload CSV files and parse data
- Select chart types (Bar, Line, Pie, Doughnut, Radar, Polar Area, Bubble, Scatter)
- Choose specific columns for visualization
- Generate multiple charts dynamically
- Responsive UI with a structured container layout

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **Visualization**: Chart.js

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/csv-visualization.git
   ```
2. Navigate to the project directory:
   ```bash
   cd csv-visualization
   ```
3. Install dependencies:
   ```bash
   pip install flask pandas
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```
5. Open the browser and go to:
   ```
   http://127.0.0.1:5000
   ```

## Usage
1. Upload a CSV file.
2. Select the type of chart you want to generate.
3. Choose the columns to be visualized.
4. Click "Add Chart" to render the graph.

## Folder Structure
```
project-root/
│── static/
│   ├── index.css      # Styles for the web page
│   ├── charts.js      # JavaScript file for handling chart generation
│── templates/
│   ├── index.html     # Main UI template
│── app.py             # Flask backend
│── requirements.txt   # List of dependencies
│── README.md          # Project documentation
```

## License
This project is open-source and available under the MIT License.

## Contributors
- [Sharvari2318](https://github.com/Sharvari2318)
- [Manjosh-Lilhare](https://github.com/Manjosh-Lilhare)
- [Shreniknil09](https://github.com/Shreniknil09)
- [ShivamAdmane](https://github.com/ShivamAdmane)

Feel free to contribute by opening issues or submitting pull requests!

