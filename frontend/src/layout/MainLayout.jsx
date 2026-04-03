import Sidebar from "./Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children, title }) {
  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <Header title={title} />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto md:overflow-y-hidden  p-6">
          {children}
        </main>

      </div>

    </div>
  );
}