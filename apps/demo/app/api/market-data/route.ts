import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

const marketData = [
  {
    country: 'Brazil',
    gdpGrowth: 2.3,
    inflation: 4.8,
    internetPenetration: 81,
    digitalPaymentsGrowth: 17,
    saasAdoption: 42,
    topSectors: ['Fintech', 'E-commerce', 'Healthtech'],
  },
  {
    country: 'Mexico',
    gdpGrowth: 1.8,
    inflation: 4.2,
    internetPenetration: 76,
    digitalPaymentsGrowth: 22,
    saasAdoption: 38,
    topSectors: ['Fintech', 'Logistics', 'Edtech'],
  },
  {
    country: 'Colombia',
    gdpGrowth: 2.1,
    inflation: 5.1,
    internetPenetration: 73,
    digitalPaymentsGrowth: 28,
    saasAdoption: 34,
    topSectors: ['Fintech', 'E-commerce', 'Agrotech'],
  },
  {
    country: 'Argentina',
    gdpGrowth: -1.2,
    inflation: 89,
    internetPenetration: 85,
    digitalPaymentsGrowth: 35,
    saasAdoption: 45,
    topSectors: ['Fintech', 'E-commerce', 'Gaming'],
  },
  {
    country: 'Chile',
    gdpGrowth: 2.5,
    inflation: 3.8,
    internetPenetration: 90,
    digitalPaymentsGrowth: 15,
    saasAdoption: 48,
    topSectors: ['Fintech', 'Retail', 'Mining Tech'],
  },
]

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    region: 'Latin America',
    source: 'Gossipay Market Intelligence (simulated)',
    countries: marketData,
  })
}
