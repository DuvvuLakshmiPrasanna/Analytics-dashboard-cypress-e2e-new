import { useMemo, useState } from "react";
import { tableRows } from "../data/mockData";

const columns = ["id", "company", "region", "status", "plan", "revenue"];

function normalizeValue(value) {
  return typeof value === "string" ? value.toLowerCase() : value;
}

export function DataPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) {
      return tableRows;
    }

    const query = searchTerm.toLowerCase().trim();
    return tableRows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [searchTerm]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    rows.sort((a, b) => {
      const first = normalizeValue(a[sortBy]);
      const second = normalizeValue(b[sortBy]);

      if (first === second) {
        return 0;
      }

      if (sortDirection === "asc") {
        return first > second ? 1 : -1;
      }

      return first < second ? 1 : -1;
    });
    return rows;
  }, [filteredRows, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const visibleRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [pageSize, safeCurrentPage, sortedRows]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortDirection("asc");
  };

  const setPageWithBounds = (nextPage) => {
    const normalized = Math.max(1, Math.min(nextPage, totalPages));
    setCurrentPage(normalized);
  };

  return (
    <section className="page">
      <h1 className="page-title">Data Table View</h1>
      <p className="page-subtitle">
        Explore account data with sorting, filtering, and pagination.
      </p>

      <div className="controls-row">
        <input
          type="search"
          data-testid="search-input"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search company, region, status..."
          aria-label="Search rows"
        />
      </div>

      <div className="table-wrap">
        <table data-testid="data-table">
          <thead>
            <tr>
              {columns.map((columnName) => (
                <th key={columnName} data-testid={`table-header-${columnName}`}>
                  {columnName.toUpperCase()}
                  <button
                    type="button"
                    data-testid={`sort-${columnName}`}
                    onClick={() => handleSort(columnName)}
                    aria-label={`Sort ${columnName}`}
                  >
                    {sortBy === columnName
                      ? sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No matching records found.</td>
              </tr>
            ) : (
              visibleRows.map((row, index) => (
                <tr key={row.id} data-testid={`table-row-${index}`}>
                  <td>{row.id}</td>
                  <td>{row.company}</td>
                  <td>{row.region}</td>
                  <td>
                    <span className="badge">{row.status}</span>
                  </td>
                  <td>{row.plan}</td>
                  <td>${row.revenue.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination" data-testid="pagination-controls">
        <label htmlFor="page-size">Rows per page</label>
        <select
          id="page-size"
          data-testid="page-size-select"
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <button
          type="button"
          className="button"
          data-testid="prev-page-button"
          onClick={() => setPageWithBounds(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
        >
          Previous
        </button>

        <span data-testid="page-number">
          Page {safeCurrentPage} of {totalPages}
        </span>

        <button
          type="button"
          className="button"
          data-testid="next-page-button"
          onClick={() => setPageWithBounds(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}
