import { fetchAll, num, text } from "@/lib/data";
import { pkr, when } from "@/lib/format";

type Purchase = {
  id: number;
  invoice_no: string;
  supplier_id: number;
  grand_total: number;
  payment_method: string;
  status: string;
  purchase_date: string;
};
type Item = {
  purchase_id: number;
  product_id: number;
  quantity: number;
  total: number;
};
type Supplier = { id: number; name: string };
type Product = { id: number; name: string };

export default async function PurchasesPage() {
  const [purchases, items, suppliers, products] = await Promise.all([
    fetchAll("purchases", "purchase_date"),
    fetchAll("purchase_items", "id"),
    fetchAll("suppliers", "name"),
    fetchAll("products", "name"),
  ]);
  const supplierNames = new Map((suppliers as Supplier[]).map((row) => [row.id, row.name]));
  const productNames = new Map((products as Product[]).map((row) => [row.id, row.name]));

  return (
    <>
      <h1>Purchases</h1>
      <div className="table-wrap">
        {(purchases as Purchase[]).length === 0 ? (
          <div className="empty">No purchases synced yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Lines</th>
              </tr>
            </thead>
            <tbody>
              {(purchases as Purchase[]).map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.invoice_no}</td>
                  <td>{when(purchase.purchase_date)}</td>
                  <td>{text(supplierNames.get(purchase.supplier_id))}</td>
                  <td>{purchase.status}</td>
                  <td>{purchase.payment_method}</td>
                  <td>{pkr(num(purchase.grand_total))}</td>
                  <td>
                    {(items as Item[])
                      .filter((item) => item.purchase_id === purchase.id)
                      .map((item) => (
                        <div key={`${purchase.id}-${item.product_id}`}>
                          {text(productNames.get(item.product_id))} × {item.quantity} · {pkr(num(item.total))}
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
