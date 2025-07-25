export default function AdminHeader() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-2xl mr-2">🏘️</span>
        <h1 className="text-xl font-bold">CadastreWeb - Admin</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div>
          <p className="font-semibold">Admin User</p>
          <p className="text-sm">ID: ADMIN20240001</p>
        </div>
        <a href="/auth" className="text-sm hover:underline">Déconnexion</a>
      </div>
    </header>
  );
}