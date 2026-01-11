import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <main style={{ padding: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
