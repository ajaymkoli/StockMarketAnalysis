# Stock Market Dashboard



A dynamic, single-page stock market analysis dashboard that provides real-time chart data, company profiles, and key financial statistics for a curated list of top stocks. This project is built with vanilla JavaScript, HTML, and CSS, and it leverages multiple APIs to deliver a rich and interactive user experience.



![Project Dashboard Screenshot](https://raw.githubusercontent.com/ajaymkoli/StockMarketAnalysis/main/Project_Dashboard.png)

---



## Key Features



-   **Dynamic Stock List**: Displays a predefined list of top stocks (AAPL, MSFT, GOOGL, etc.).

-   **Interactive Charts**: Visualizes historical stock performance using Plotly.js.

-   **Selectable Time Ranges**: Users can view stock data for different time periods (1 Month, 3 Months, 1 Year, 5 Years).

-   **Detailed Company Summaries**: Shows a descriptive summary, book value, and profit margin for the selected stock.

-   **API Integration**: Fetches and consolidates data from three different real-time financial data APIs.

-   **Responsive & Modern UI**: A clean, dark-themed interface designed for a professional look and feel.

-   **Pure JavaScript**: Built without any frameworks, focusing on modern vanilla JavaScript (ES6+), async/await, and event handling.



---



## Technologies Used



-   **Frontend**: HTML5, CSS3, JavaScript (ES6+)

-   **Charting Library**: [Plotly.js](https://plotly.com/javascript/)

-   **APIs**:

    -   Stock Chart Data API

    -   Stock Profile/Summary API

    -   Stock Statistics API



---



## Setup and Installation



To run this project locally, follow these simple steps:



1.  **Clone the repository:**

    ```bash

    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)

    ```



2.  **Navigate to the project directory:**

    ```bash

    cd your-repo-name

    ```



3.  **Open `index.html` in your browser:**

    -   You can simply double-click the `index.html` file.

    -   For a better experience, use a live server extension (like "Live Server" in VS Code) to prevent potential CORS issues with local file access.



---



## File Structure



The project is organized into three main files:



-   `index.html`: Contains the HTML structure and layout of the dashboard.

-   `style.css`: Provides all the styling, including the grid layout, dark theme, and responsive design.

-   `script.js`: The core of the application, handling all logic:

    -   API data fetching and consolidation.

    -   Dynamic rendering of the stock list, chart, and summary.

    -   Event handling for all user interactions.



---



## How It Works



The application logic is encapsulated within a single object, `stockApp`, in `script.js`.



1.  **Initialization (`init`)**: On page load, the application fetches data from all three required APIs concurrently using `Promise.all()`.

2.  **State Management**: The application maintains a state with the `currentStock` and `currentTimeRange`.

3.  **Rendering**:

    -   The stock list is dynamically built from a predefined array and data from the stats API.

    -   The chart is rendered using Plotly.js based on the current state.

    -   The summary section is populated with data from both the profile and stats APIs.

4.  **Event Handling**:

    -   Clicking a stock in the list updates the `currentStock` state and re-renders the chart and summary.

    -   Clicking a time-selector button updates the `currentTimeRange` state and re-renders the chart.



---



This project demonstrates a strong understanding of modern JavaScript, asynchronous programming, API integration, and dynamic DOM manipulation to create a functional and visually appealing web application.

