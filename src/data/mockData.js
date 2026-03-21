export const revenueSeries = [34, 48, 42, 61, 55, 73, 68]
export const usersSeries = [20, 24, 28, 35, 38, 44, 47]

const statuses = ['Active', 'Pending', 'Paused']
const plans = ['Starter', 'Growth', 'Enterprise']

export const tableRows = Array.from({ length: 80 }, (_, index) => {
  const rowNumber = index + 1
  return {
    id: rowNumber,
    company: `Client ${String(rowNumber).padStart(2, '0')}`,
    region: ['North America', 'Europe', 'APAC', 'LATAM'][index % 4],
    status: statuses[index % statuses.length],
    plan: plans[index % plans.length],
    revenue: 4000 + rowNumber * 137,
  }
})

export const defaultSettings = {
  currency: 'USD',
  timezone: 'UTC',
  notifications: true,
  theme: 'light',
}
