import { useMemo, useState } from "react";
import { revenueSeries, usersSeries } from "../data/mockData";

const ranges = {
  "7d": { users: 14520, revenue: "$142,950", conversion: "5.8%" },
  "30d": { users: 60210, revenue: "$598,420", conversion: "6.4%" },
  "90d": { users: 169330, revenue: "$1,850,775", conversion: "6.9%" },
};

export function DashboardPage() {
  const [range, setRange] = useState("30d");
  const [refreshCount, setRefreshCount] = useState(0);
  const [exported, setExported] = useState(false);

  const metrics = useMemo(() => ranges[range], [range]);
  const handleRangeChange = (event) => setRange(event.target.value);

  return (
    <section className="page" data-testid="dashboard-container">
      <h1 className="page-title">Dashboard Overview</h1>
      <p className="page-subtitle">
        Track growth, revenue, and conversion from a single cockpit.
      </p>

      <div className="controls-row">
        <select
          data-testid="date-range-filter"
          value={range}
          onChange={handleRangeChange}
          onInput={handleRangeChange}
          aria-label="Date range"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <button
          type="button"
          className="button ghost"
          data-testid="refresh-button"
          onClick={() => {
            setRefreshCount((value) => value + 1);
            setExported(false);
          }}
        >
          Refresh Data
        </button>
        <button
          type="button"
          className="button primary"
          data-testid="export-button"
          onClick={() => setExported(true)}
        >
          Export Data
        </button>
      </div>

      <div className="metric-grid">
        <article className="metric-card" data-testid="metric-card-users">
          <p className="metric-label">Users</p>
          <p className="metric-value">{metrics.users.toLocaleString()}</p>
          <span className="metric-trend">+8.4% this period</span>
        </article>
        <article className="metric-card" data-testid="metric-card-revenue">
          <p className="metric-label">Revenue</p>
          <p className="metric-value">{metrics.revenue}</p>
          <span className="metric-trend">+5.6% this period</span>
        </article>
        <article className="metric-card" data-testid="metric-card-conversion">
          <p className="metric-label">Conversion</p>
          <p className="metric-value">{metrics.conversion}</p>
          <span className="metric-trend">+0.5 pts this period</span>
        </article>
      </div>

      <div className="chart-grid">
        <article className="chart-card" data-testid="chart-revenue">
          <strong>Revenue Trend</strong>
          <div className="chart-bar-row" aria-label="Revenue bars">
            {revenueSeries.map((value, index) => (
              <div
                key={`rev-${index}`}
                className="chart-bar"
                style={{ height: `${value}%` }}
                title={`Revenue point ${index + 1}: ${value}`}
              />
            ))}
          </div>
        </article>
        <article className="chart-card" data-testid="chart-users">
          <strong>User Trend</strong>
          <div className="chart-bar-row" aria-label="User bars">
            {usersSeries.map((value, index) => (
              <div
                key={`usr-${index}`}
                className="chart-bar users"
                style={{ height: `${value * 1.8}%` }}
                title={`Users point ${index + 1}: ${value}`}
              />
            ))}
          </div>
        </article>
      </div>

      <p className="inline-note" data-testid="dashboard-feedback">
        {exported
          ? "Export started successfully."
          : `Dashboard refreshed ${refreshCount} ${refreshCount === 1 ? "time" : "times"}.`}
      </p>
    </section>
  );
}
