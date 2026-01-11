import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white p-6">
      <h2 className="tracking-widest mb-10">ADMIN</h2>

      <nav className="flex flex-col gap-4 text-sm">
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/appointments">Rendez-vous</NavLink>
        <NavLink to="/admin/internships">Stages</NavLink>
        <NavLink to="/admin/projects">Projets</NavLink>
      </nav>
    </aside>
  );
}
