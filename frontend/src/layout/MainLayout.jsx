import Sidebar from "./Sidebar";
import Header from "../components/Header";
import { useSessionManager } from "../hooks/useSessionManager";
import SessionWarningModal from "../components/SessionWarningModal";
import { logout }            from "../services/authService";

export default function MainLayout({ children, title }) {
  const { showWarning, countdown, extendSession } = useSessionManager();
  return (
    <div className="h-screen flex bg-slate-100 dark:bg-gray-950 overflow-hidden transition-colors duration-200">

      {showWarning && (
        <SessionWarningModal
          countdown={countdown}
          onExtend={extendSession}
          onLogout={logout}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <Header title={title} />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-10 bg-slate-100 dark:bg-gray-950 transition-colors duration-200">
          {children}
        </main>

      </div>

    </div>
  );
}