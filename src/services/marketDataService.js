
export async function fetchMarketData(ticker, buyDate){
    try{
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${buyDate}/${today}?apiKey=u59NmolOYzONIBXRfbNka2vptx7wjp71`;
        console.log('Fetching data from:' , url)
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();
        console.log('Recieved data:', data);
        return data;
    }
    catch(error)
    {
        console.error("There was a problem fetching market data", error);
        throw error;
    }
}

