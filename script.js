import { fetchAllData } from './api.js';
import { renderStockList, renderChart, renderSummary } from './ui.js';

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
      const [chartData, summaryData, statsData] = await fetchAllData();

      this.fullApiResponse = chartData;
      this.summaryData = summaryData;
      this.stockStatsData = statsData;

      renderStockList(Stocks, this.stockStatsData, this.currentStock);
      this.handleEvents();

      if (this.fullApiResponse) {
        this.updateUI();
      }
    },

    // A single function to update all relevant UI parts.
    updateUI: function() {
      const chartDataForRender = this.fullApiResponse?.stocksData?.[0]?.[this.currentStock]?.[this.currentTimeRange];
      renderChart(chartDataForRender, this.currentStock, this.currentTimeRange);
      renderSummary(this.summaryData, this.stockStatsData, this.currentStock);
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
          this.updateUI();
        });
      }

      if (timeSelector) {
        timeSelector.addEventListener('click', (event) => {
          const clickedSpan = event.target.closest('span');
          if (!clickedSpan) return;

          timeSelector.querySelector('span.active-time')?.classList.remove('active-time');
          clickedSpan.classList.add('active-time');

          this.currentTimeRange = clickedSpan.dataset.range;
          
          const chartDataForRender = this.fullApiResponse?.stocksData?.[0]?.[this.currentStock]?.[this.currentTimeRange];
          renderChart(chartDataForRender, this.currentStock, this.currentTimeRange);
        });
      }
    }
  };

  // Start the application.
  stockApp.init();
});