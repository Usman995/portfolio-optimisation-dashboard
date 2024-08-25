import React, { useState } from 'react';
import './Dashboard.css'
import StockChart from './StockChart';
import { fetchMarketData } from '../services/marketDataService';



function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

function Dashboard(){
    const [marketData, setMarketData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        ticker: '',
        buyDate: getTodayDate
    });

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'ticker' ? value.toUpperCase() : value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setMarketData(null);
        try {
            console.log('submitting form with data:', formData)
            const data = await fetchMarketData(formData.ticker, formData.buyDate);
            if (data.resultsCount === 0) {
                setError('No data available for the selected date range.');
            } else {
                setMarketData(data);
            }
        } catch (err) {
            console.error('Detailed error in handleSubmit:', err);
            setError(`Failed to fetch data: ${err.message}`);
        }
        finally{
            setIsLoading(false);
        }
    };

    return (
        <div className='dashboard-container'>
          <div className='dashboard-content'>
            <div className='form-section'>
              <h1>Market Ticker Data</h1>
              <form onSubmit={handleSubmit} className="dashboard-form">
                <div className="form-group">
                  <label htmlFor="ticker">Stock Ticker:</label>
                  <input
                    type="text"
                    id="ticker"
                    name="ticker"
                    value={formData.ticker}
                    onChange={handleInputChange}
                    placeholder="e.g., AAPL"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="buyDate">Buy Date:</label>
                  <input
                    type="date"
                    id="buyDate"
                    name="buyDate"
                    value={formData.buyDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">Fetch Data</button>
              </form>
            </div>
            
            <div className='results-section'>
              {isLoading && <p>Loading...</p>}
              {error && <p className="error">{error}</p>}
              {marketData && (
                <div>
                  <h2>Data for {marketData.ticker}</h2>
                  <StockChart data={marketData} />
                  {marketData.results && marketData.results.length > 0 ? (
                    <div>
                      <p>Open: {marketData.results[0].o}</p>
                      <p>Close: {marketData.results[marketData.results.length - 1].c}</p>
                      <p>Highest: {Math.max(...marketData.results.map(r => r.h))}</p>
                      <p>Lowest: {Math.min(...marketData.results.map(r => r.l))}</p>
                    </div>
                  ) : (
                    <p>No results found for this date range.</p>
                  )}
                  <details>
                    <summary>Raw Data</summary>
                    <pre>{JSON.stringify(marketData, null, 2)}</pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      );
}

export default Dashboard