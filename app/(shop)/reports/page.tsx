import { fetchAll, num } from "@/lib/data";
import { pkr, when } from "@/lib/format";

type Sale = { id: number; invoice_no: string; grand_total: number; status: string; created_at: string };
type Item = {
  sale_id: number;
  unit_price: number;
  purchase_price_at_sale: number;
  quantity: number;
  discount: number;
};

function dateInput(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
  const fromValue = params.from || dateInput(monthAgo);
  const toValue = params.to || dateInput(today);
  const from = new Date(`${fromValue}T00:00:00+05:00`);
  const to = new Date(`${toValue}T23:59:59+05:00`);

  const [sales, items] = await Promise.all([
    fetchAll("sales", "created_at"),
    fetchAll("sale_items", "id"),
  ]);
  const completed = (sales as Sale[]).filter((sale) => {
    if (sale.status !== "completed") return false;
    const time = new Date(sale.created_at).getTime();
    return time >= from.getTime() && time <= to.getTime();
  });
  const ids = new Set(completed.map((sale) => sale.id));
  const profit = (items as Item[])
    .filter((item) => ids.has(item.sale_id))
    .reduce(
      (sum, item) =>
        sum +
        (num(item.unit_price) - num(item.purchase_price_at_sale)) * num(item.quantity) -
        num(item.discount),
      0,
    );
  const total = completed.reduce((sum, sale) => sum + num(sale.grand_total), 0);

  return (
    <>
      <h1>Reports</h1>
      <form className="filters" method="get">
        <label>
          From
          <input type="date" name="from" defaultValue={fromValue} />
        </label>
        <label>
          To
          <input type="date" name="to" defaultValue={toValue} />
        </label>
        <button type="submit">Generate</button>
      </form>
      <div className="grid">
        <div className="stat">
          <span>Sales</span>
          <strong>{pkr(total)}</strong>
        </div>
        <div className="stat good">
          <span>Profit</span>
          <strong>{pkr(profit)}</strong>
        </div>
        <div className="stat">
          <span>Transactions</span>
          <strong>{completed.length}</strong>
        </div>
      </div>
      <div className="table-wrap">
        {completed.length === 0 ? (
          <div className="empty">No completed sales in this range.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>When</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.invoice_no}</td>
                  <td>{when(sale.created_at)}</td>
                  <td>{pkr(num(sale.grand_total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
