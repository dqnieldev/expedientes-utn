import DeveloperSidebar from "./DeveloperSidebar";
import AdminHeader from "../components/AdminHeader";
import { useSessionManager } from "../hooks/useSessionManager";
import SessionWarningModal from "../components/SessionWarningModal";
import { logout } from "../services/authService";

export default function DeveloperLayout({ children, title }) {
  const { showWarning, countdown, extendSession } = useSessionManager();
  return (
    <div className="h-screen print:h-auto flex bg-slate-100 dark:bg-gray-950 overflow-hidden print:overflow-visible transition-colors duration-200">
      {showWarning && (
        <SessionWarningModal countdown={countdown} onExtend={extendSession} onLogout={logout} />
      )}
      <DeveloperSidebar />
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:h-auto">
        <AdminHeader title={title} />
        <main className="flex-1 overflow-y-auto print:overflow-visible print:h-auto p-4 md:p-6 pb-24 md:pb-10 bg-slate-100 dark:bg-gray-950 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}