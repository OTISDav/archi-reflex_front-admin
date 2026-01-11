export default function Header() {
  return (
    <header className="bg-white p-4 shadow-sm flex justify-between">
      <span className="text-sm opacity-60">Admin Panel</span>
      <button
        onClick={() => {
          localStorage.removeItem("admin_token");
          window.location.href = "/admin/login";
        }}
        className="text-sm"
      >
        Déconnexion
      </button>
    </header>
  );
}
