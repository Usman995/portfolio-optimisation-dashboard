
async function fetchMarketData(){
    try{
        const response = await fetch("https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?apiKey=u59NmolOYzONIBXRfbNka2vptx7wjp71");

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();
        return data;
    }
    catch(error)
    {
        console.error("There was a problem fetching market data", error);
        throw error;
    }
}

export {fetchMarketData};