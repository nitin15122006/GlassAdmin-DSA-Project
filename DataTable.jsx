export default function DataTable({ columns, rows, emptyText = "No records found." }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}</tr></thead><tbody>
    {rows.length ? rows.map((row, i)=><tr key={row.id ?? row.order_code ?? row.customer_code ?? i}>{columns.map(col=><td key={col.key}>{col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}</td>)}</tr>) : <tr><td colSpan={columns.length} className="empty-cell">{emptyText}</td></tr>}
  </tbody></table></div>;
}
