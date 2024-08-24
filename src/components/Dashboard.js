import React, { useState, useEffect } from 'react';
import { fetchMarketData } from '../services/marketDataService';

function Dashboard(){
    const [marketData, setMarketData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getMarketData() {
            try{
                const data = await fetchMarketData();
                setMarketData(data);
            }
            catch(err){
                setError(err.message);
            }
        }

        getMarketData();
    }, []);

    if(error) return <div>Error: ${error}</div>;
    if(!marketData) return <div>Loaing...</div>;

    return(
        <div>
            <h1>Market Data Dashboard</h1>
            <pre>{JSON.stringify(marketData, null, 2)}</pre>
        </div>
    );
}

export default Dashboard