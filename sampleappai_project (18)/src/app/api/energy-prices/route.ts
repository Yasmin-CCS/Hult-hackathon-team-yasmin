import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `https://api.eia.gov/v2/electricity/rto/region-data/data/?api_key=${process.env.EIA_API_KEY}&frequency=local-hourly&data[0]=value&facets[respondent][]=CAL&start=2025-02-01T00-08%3A00&end=2025-02-02T00-08%3A00&sort[0][column]=period&sort[0][direction]=asc&offset=0&length=5000`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Filter for only DF type data
    const filteredData = data.response.data.filter((item: any) => item.type === 'DF');
    
    return NextResponse.json({
      response: {
        data: filteredData
      }
    });
  } catch (error) {
    console.error('Error fetching energy prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch energy prices' },
      { status: 500 }
    );
  }
}
