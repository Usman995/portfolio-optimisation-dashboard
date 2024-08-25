import React, { useState } from 'react';
import './Dashboard.css';
// import StockChart from './StockChart';
import PortfolioPieChart from './PortfolioPieChart';
import { fetchMarketData } from '../services/marketDataService';

function Dashboard() {
  const [assets, setAssets] = useState([
    { ticker: '', amount: '', buyDate: new Date().toISOString().split('T')[0] },
  ]);
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newAssets = [...assets];
    newAssets[index][name] = value;
    setAssets(newAssets);
  };

  const addAsset = () => {
    setAssets([
      ...assets,
      {
        ticker: '',
        amount: '',
        buyDate: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const removeAsset = (index) => {
    const newAssets = assets.filter((_, i) => i !== index);
    setAssets(newAssets);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMarketData(null);
    setShowResults(false);

    try {
      const totalValue = assets.reduce(
        (sum, asset) => sum + Number(asset.amount),
        0
      );

      const assetData = await Promise.all(
        assets.map(async (asset) => {
          const data = await fetchMarketData(asset.ticker, asset.buyDate);
          return {
            ...data,
            amount: Number(asset.amount),
            percentage: (Number(asset.amount) / totalValue) * 100,
          };
        })
      );

      setMarketData({
        assets: assetData,
        totalValue: totalValue,
      });
      setShowResults(true);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="content-wrapper">
        <div className="dashboard-content">
          <h1>Portfolio Optimization Dashboard</h1>
          <div className="form-section">
            <form onSubmit={handleSubmit} className="dashboard-form">
              {assets.map((asset, index) => (
                <div key={index} className="asset-input">
                  <div className="form-group">
                    <label htmlFor={`ticker-${index}`}>Stock Ticker:</label>
                    <input
                      type="text"
                      id={`ticker-${index}`}
                      name="ticker"
                      value={asset.ticker}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="e.g., AAPL"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`amount-${index}`}>
                      Amount Invested ($):
                    </label>
                    <input
                      type="number"
                      id={`amount-${index}`}
                      name="amount"
                      value={asset.amount}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="e.g., 1000"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`buyDate-${index}`}>Buy Date:</label>
                    <input
                      type="date"
                      id={`buyDate-${index}`}
                      name="buyDate"
                      value={asset.buyDate}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </div>
                  {assets.length > 1 && (
                    <button type="button" onClick={() => removeAsset(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addAsset}>
                Add Asset
              </button>
              <button type="submit" className="submit-button">
                Display Portfolio
              </button>
            </form>
          </div>
        </div>

        <div className={`results-container ${showResults ? 'show' : ''}`}>
          {isLoading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {marketData && (
            <div className="portfolio-summary">
              <h2>Portfolio Summary</h2>
              <PortfolioPieChart data={marketData} />
              <ul>
                {marketData.assets.map((asset, index) => (
                  <li key={index}>
                    {asset.symbol}: ${asset.amount.toFixed(2)} (
                    {asset.percentage.toFixed(2)}%) - Current Price: $
                    {asset.close}
                  </li>
                ))}
              </ul>
              <p>Total Portfolio Value: ${marketData.totalValue.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
