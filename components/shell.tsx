import { AutoRefresh } from "@/components/auto-refresh";
import { logoutAction } from "@/lib/actions";

const links = [
  ["/dashboard", "Dashboard"],
  ["/sales", "Sales"],
  ["/products", "Products"],
  ["/purchases", "Purchases"],
  ["/customers", "Customers"],
  ["/suppliers", "Suppliers"],
  ["/reports", "Reports"],
];

export function Shell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app">
      <aside>
        <div className="brand">
          <strong>Shop POS</strong>
          <span>Online records</span>
        </div>
        <nav>
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <form action={logoutAction} className="logout">
          <div className="who">{username}</div>
          <button type="submit">Sign out</button>
        </form>
      </aside>
      <main>
        <AutoRefresh />
        {children}
      </main>
    </div>
  );
}
