document.addEventListener('DOMContentLoaded', () => {
  // Predefined list of stocks to display in the application.
  const Stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "PYPL", "TSLA", "JPM", "NVDA", "NFLX", "DIS"];

  //Main application object to encapsulate all logic.
  const stockApp = {
    // --- STATE ---
    fullApiResponse: null,
    summaryData: null,
    stockStatsData: null,
    currentStock: 'AAPL',
    currentTimeRange: '1mo',

    // --- METHODS ---
    // Main entry point for the application.
    init: async function () {
      // All three data sources fetched concurrently for better performance.
      const [chartData, summaryData, statsData] = await Promise.all([
        this.fetchData('https://stock-market-api-k9vl.onrender.com/api/stocksdata'),
        this.fetchData('https://stock-market-api-k9vl.onrender.com/api/profiledata'),
        this.fetchData('https://stock-market-api-k9vl.onrender.com/api/stocksstatsdata') // New API call
      ]);

      this.fullApiResponse = chartData;
      this.summaryData = summaryData;
      this.stockStatsData = statsData;

      this.renderStockList(); // New: Render the dynamic stock list
      this.handleEvents();

      if (this.fullApiResponse) {
        this.renderChart();
        this.renderSummary();
      }
    },

    // Reusable function to fetch data from any URL.
    fetchData: async function (url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
        return await response.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    //Dynamically builds the stock list table from the Stocks array.
    renderStockList: function () {
      const tableBody = document.querySelector('.stock-table tbody');
      if (!tableBody || !this.stockStatsData?.stocksStatsData) return;

      const stats = this.stockStatsData.stocksStatsData[0];
      let tableHTML = '';

      Stocks.forEach(stockSymbol => {
        const stockStats = stats[stockSymbol] || { bookValue: 'N/A', profit: 0 };
        const profitClass = stockStats.profit >= 0 ? 'positive' : 'negative';

        tableHTML += `
          <tr class="${stockSymbol === this.currentStock ? 'selected' : ''}">
            <td>${stockSymbol}</td>
            <td>$${stockStats.bookValue}</td>
            <td class="profit ${profitClass}">${stockStats.profit.toFixed(2)}%</td>
          </tr>
        `;
      });

      tableBody.innerHTML = tableHTML;
    },

    //Renders the Plotly chart for the selected stock and time range.
    renderChart: function () {
      const data = this.fullApiResponse?.stocksData?.[0]?.[this.currentStock]?.[this.currentTimeRange];
      const chartDisplayDiv = document.querySelector('.chart-display');


      // --- NEW FEATURE CODE START ---
      const chartStatsDiv = document.querySelector('.chart-stats');

      // If data is not available, clear both the chart and the stats display.
      if (!data || !data.value || data.value.length === 0) {
        chartDisplayDiv.innerHTML = `<p style="text-align:center; color:#8a93a2;">Chart data not available.</p>`;
        chartStatsDiv.innerHTML = '';
        return;
      }

      // Calculating the peak (high) and low values from the data array.
      const peakValue = Math.max(...data.value);
      const lowValue = Math.min(...data.value);

      // Creating the HTML content for the stats.
      const statsHTML = `
        <div class="stat">
          <div class="stat-label">High</div>
          <div class="stat-value">$${peakValue.toFixed(2)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Low</div>
          <div class="stat-value">$${lowValue.toFixed(2)}</div>
        </div>
      `;
      // Injecting the stats HTML into its container.
      chartStatsDiv.innerHTML = statsHTML;
      // --- NEW FEATURE CODE END ---

      const trace = {
        x: data.timeStamp.map(timestamp => {
          let new_timestamp = new Date(timestamp * 1000).toLocaleDateString();
          return new_timestamp;
        }), y: data.value,
        type: 'scatter', mode: 'lines', line: { color: '#28a745', width: 2 }
      };

      const layout = {
        title: { text: `${this.currentStock} - ${this.currentTimeRange.toUpperCase()}`, font: { color: '#eaecef' } },
        paper_bgcolor: '#1f2428', plot_bgcolor: '#1f2428',
        font: { color: '#eaecef' },
        xaxis: { gridcolor: '#3a414b' }, yaxis: { gridcolor: '#3a414b' }
      };

      Plotly.newPlot(chartDisplayDiv, [trace], layout, { responsive: true });
    },

    // Rendering the summary for the currently selected stock.
    renderSummary: function () {
      const summaryDiv = document.querySelector('.summary');

      // Checking if both required data sources are available.
      if (!this.summaryData?.stocksProfileData?.length || !this.stockStatsData?.stocksStatsData?.length) {
        summaryDiv.innerHTML = '<p>Required data is not available.</p>';
        return;
      }

      // Getting data from the 'profile' source for the summary text.
      const stockProfile = this.summaryData.stocksProfileData[0][this.currentStock];

      // Getting data from the 'stats' source for the numbers.
      const stockStats = this.stockStatsData.stocksStatsData[0][this.currentStock];

      // We need both objects to build the complete summary.
      if (stockProfile && stockStats) {
        const summaryText = stockProfile.summary || "No summary description available.";

        // Use the data from stockStats for bookValue and profit.
        const numBookValue = parseFloat(stockStats.bookValue);
        const bookValue = !isNaN(numBookValue) ? `$${numBookValue.toFixed(2)}` : "N/A";

        const numProfit = parseFloat(stockStats.profit);
        const profit = !isNaN(numProfit) ? `${numProfit.toFixed(2)}%` : "N/A";

        const summaryContent = `
          <p><strong>Name:</strong> ${this.currentStock}</p>
          <p><strong>Profit:</strong> ${profit}</p>
          <p><strong>Book Value:</strong> ${bookValue}</p>
          <p><strong>Summary:</strong> ${summaryText}</p>
        `;
        summaryDiv.innerHTML = summaryContent;
      } else {
        summaryDiv.innerHTML = `<p>No summary available for ${this.currentStock}.</p>`;
      }
    },

    //Set up for all the event listeners for user interaction.
    handleEvents: function () {
      const listContainer = document.querySelector('.list');
      const timeSelector = document.querySelector('.time-selector');

      if (listContainer) {
        listContainer.addEventListener('click', (event) => {
          const clickedRow = event.target.closest('tr');
          if (!clickedRow) return;

          listContainer.querySelector('tr.selected')?.classList.remove('selected');
          clickedRow.classList.add('selected');

          this.currentStock = clickedRow.querySelector('td:first-child').textContent;

          this.renderChart();
          this.renderSummary();
        });
      }

      if (timeSelector) {
        timeSelector.addEventListener('click', (event) => {
          const clickedSpan = event.target.closest('span');
          if (!clickedSpan) return;

          timeSelector.querySelector('span.active-time')?.classList.remove('active-time');
          clickedSpan.classList.add('active-time');

          this.currentTimeRange = clickedSpan.dataset.range;

          this.renderChart();
        });
      }
    }
  };

  // Start the application.
  stockApp.init();
});