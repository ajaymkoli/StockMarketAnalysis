//Dynamically builds the stock list table from the Stocks array.
export function renderStockList(stocks, statsData, currentStock) {
  const tableBody = document.querySelector('.stock-table tbody');
  if (!tableBody || !statsData?.stocksStatsData) return;

  const stats = statsData.stocksStatsData[0];
  let tableHTML = '';

  stocks.forEach(stockSymbol => {
    const stockStats = stats[stockSymbol] || { bookValue: 'N/A', profit: 0 };
    const profitClass = stockStats.profit >= 0 ? 'positive' : 'negative';

    tableHTML += `
      <tr class="${stockSymbol === currentStock ? 'selected' : ''}">
        <td>${stockSymbol}</td>
        <td>$${stockStats.bookValue}</td>
        <td class="profit ${profitClass}">${stockStats.profit.toFixed(2)}%</td>
      </tr>
    `;
  });

  tableBody.innerHTML = tableHTML;
}

//Renders the Plotly chart for the selected stock and time range.
export function renderChart(chartData, currentStock, currentTimeRange) {
  const chartDisplayDiv = document.querySelector('.chart-display');
  // --- NEW FEATURE CODE START ---
  const chartStatsDiv = document.querySelector('.chart-stats');

  // If data is not available, clear both the chart and the stats display.
  if (!chartData || !chartData.value || !chartData.value.length === 0) {
    chartDisplayDiv.innerHTML = `<p style="text-align:center; color:#8a93a2;">Chart data not available.</p>`;
    chartStatsDiv.innerHTML = '';
    return;
  }

  // Calculating the peak (high) and low values from the data array.
  const peakValue = Math.max(...chartData.value);
  const lowValue = Math.min(...chartData.value);

  // Creating the HTML content for the stats.
  chartStatsDiv.innerHTML = `
    <div class="stat">
      <div class="stat-label">High</div>
      <div class="stat-value">$${peakValue.toFixed(2)}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Low</div>
      <div class="stat-value">$${lowValue.toFixed(2)}</div>
    </div>
  `;
  // --- NEW FEATURE CODE END ---

  const trace = {
    x: chartData.timeStamp.map(ts => new Date(ts * 1000).toLocaleDateString()),
    y: chartData.value,
    type: 'scatter', mode: 'lines', line: { color: '#28a745', width: 2 }
  };

  const layout = {
    title: { text: `${currentStock} - ${currentTimeRange.toUpperCase()}`, font: { color: '#eaecef' } },
    paper_bgcolor: '#1f2428', plot_bgcolor: '#1f2428',
    font: { color: '#eaecef' },
    xaxis: { gridcolor: '#3a414b' }, yaxis: { gridcolor: '#3a414b' }
  };

  Plotly.newPlot(chartDisplayDiv, [trace], layout, { responsive: true });
}

// Rendering the summary for the currently selected stock.
export function renderSummary(summaryData, statsData, currentStock) {
  const summaryDiv = document.querySelector('.summary');
  // Checking if both required data sources are available.
  if (!summaryData?.stocksProfileData?.length || !statsData?.stocksStatsData?.length) {
    summaryDiv.innerHTML = '<p>Required data is not available.</p>';
    return;
  }

  // Getting data from the 'profile' source for the summary text.
  const stockProfile = summaryData.stocksProfileData[0][currentStock];
  // Getting data from the 'stats' source for the numbers.
  const stockStats = statsData.stocksStatsData[0][currentStock];

  // We need both objects to build the complete summary.
  if (stockProfile && stockStats) {
    const summaryText = stockProfile.summary || "No summary description available.";
    // Use the data from stockStats for bookValue and profit.
    const numBookValue = parseFloat(stockStats.bookValue);
    const bookValue = !isNaN(numBookValue) ? `$${numBookValue.toFixed(2)}` : "N/A";
    const numProfit = parseFloat(stockStats.profit);
    const profit = !isNaN(numProfit) ? `${numProfit.toFixed(2)}%` : "N/A";

    summaryDiv.innerHTML = `
      <p><strong>Name:</strong> ${currentStock}</p>
      <p><strong>Profit:</strong> ${profit}</p>
      <p><strong>Book Value:</strong> ${bookValue}</p>
      <p><strong>Summary:</strong> ${summaryText}</p>
    `;
  } else {
    summaryDiv.innerHTML = `<p>No summary available for ${currentStock}.</p>`;
  }
}