import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <aside>Sidebar</aside>
      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}
