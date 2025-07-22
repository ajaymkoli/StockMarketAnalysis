// A reusable function to fetch data from any URL.
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fetching all necessary data for the application from the various endpoints.
export async function fetchAllData() {
  const chartDataUrl = 'https://stock-market-api-k9vl.onrender.com/api/stocksdata';
  const summaryDataUrl = 'https://stock-market-api-k9vl.onrender.com/api/profiledata';
  const statsDataUrl = 'https://stock-market-api-k9vl.onrender.com/api/stocksstatsdata';

  return Promise.all([
    fetchData(chartDataUrl),
    fetchData(summaryDataUrl),
    fetchData(statsDataUrl)
  ]);
}