import AdminSidebar from "./AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout({ children, title }) {
  return (
    <div className="h-screen flex bg-slate-100 dark:bg-gray-950 overflow-hidden transition-colors duration-200">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <AdminHeader title={title} />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 pb-10 bg-slate-100 dark:bg-gray-950 transition-colors duration-200">
          {children}
        </main>

      </div>

    </div>
  );
}