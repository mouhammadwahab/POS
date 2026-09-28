import { fetchAll, num, text } from "@/lib/data";
import { pkr, when } from "@/lib/format";

type Sale = {
  id: number;
  invoice_no: string;
  customer_id: number | null;
  grand_total: number;
  discount: number;
  tax: number;
  status: string;
  created_at: string;
};
type Item = {
  sale_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
};
type Payment = { sale_id: number; method: string; amount: number };
type Customer = { id: number; name: string };

export default async function SalesPage() {
  const [sales, items, payments, customers] = await Promise.all([
    fetchAll("sales", "created_at"),
    fetchAll("sale_items", "id"),
    fetchAll("sale_payments", "id"),
    fetchAll("customers", "name"),
  ]);
  const names = new Map((customers as Customer[]).map((row) => [row.id, row.name]));
  const lines = items as Item[];
  const pays = payments as Payment[];

  return (
    <>
      <h1>Sales</h1>
      <div className="table-wrap">
        {(sales as Sale[]).length === 0 ? (
          <div className="empty">No sales synced yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>When</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
                <th>Payments</th>
              </tr>
            </thead>
            <tbody>
              {(sales as Sale[]).map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.invoice_no}</td>
                  <td>{when(sale.created_at)}</td>
                  <td>{sale.customer_id ? text(names.get(sale.customer_id)) : "Walk-in"}</td>
                  <td>{sale.status}</td>
                  <td>
                    {pkr(num(sale.grand_total))}
                    <div className="muted">
                      Tax {pkr(num(sale.tax))} · Discount {pkr(num(sale.discount))}
                    </div>
                  </td>
                  <td>
                    {lines
                      .filter((item) => item.sale_id === sale.id)
                      .map((item) => (
                        <div key={`${sale.id}-${item.product_name}-${item.quantity}`}>
                          {item.product_name} × {item.quantity} · {pkr(num(item.total))}
                        </div>
                      ))}
                  </td>
                  <td>
                    {pays
                      .filter((payment) => payment.sale_id === sale.id)
                      .map((payment) => (
                        <div key={`${sale.id}-${payment.method}-${payment.amount}`}>
                          {payment.method} {pkr(num(payment.amount))}
                        </div>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
