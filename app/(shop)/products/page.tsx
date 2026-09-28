import { fetchAll, num, text } from "@/lib/data";
import { pkr } from "@/lib/format";

type Product = {
  id: number;
  name: string;
  barcode: string | null;
  category_id: number | null;
  selling_price: number;
  purchase_price: number;
  stock_qty: number;
  min_stock_alert: number;
  is_active: boolean;
};
type Category = { id: number; name: string };

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    fetchAll("products", "name"),
    fetchAll("categories", "name"),
  ]);
  const names = new Map((categories as Category[]).map((row) => [row.id, row.name]));

  return (
    <>
      <h1>Products</h1>
      <h2 className="section">Categories</h2>
      <div className="table-wrap">
        {(categories as Category[]).length === 0 ? (
          <div className="empty">No categories synced yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {(categories as Category[]).map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <h2 className="section">Stock</h2>
      <div className="table-wrap">
        {(products as Product[]).length === 0 ? (
          <div className="empty">No products synced yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Barcode</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(products as Product[]).map((product) => {
                const stock = num(product.stock_qty);
                const low = stock > 0 && stock <= num(product.min_stock_alert);
                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category_id ? text(names.get(product.category_id)) : "—"}</td>
                    <td>{text(product.barcode)}</td>
                    <td>{pkr(num(product.selling_price))}</td>
                    <td>{pkr(num(product.purchase_price))}</td>
                    <td className={stock <= 0 || low ? "low" : undefined}>
                      {stock}
                      {stock <= 0 ? " out" : low ? " low" : ""}
                    </td>
                    <td>{product.is_active ? "Active" : "Inactive"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
