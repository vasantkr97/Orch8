import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import useAuthUser from "../hooks/userHooks/useAuthUser";
import useSignout from "../hooks/userHooks/useSignout";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { motion } from "framer-motion";

export function SidebarComponent() {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { signout, isLoading: isSigningOut } = useSignout();
  const [open, setOpen] = useState(false);

  const handleSignout = () => {
    signout(undefined, {
      onSuccess: () => navigate("/signin"),
      onError: (error: any) => {
        console.error("Signout error:", error);
        navigate("/signin");
      }
    });
  };

  const menuItems = [
    {
      label: "Workflows",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      label: "Credentials",
      href: "/credentials",
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
    {
      label: "Executions",
      href: "/executions",
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Projects",
      href: "/projects",
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-6 bg-[#17181c] border-r border-white/10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            {/* Logo */}
            <div className={`flex items-center gap-3 mb-8 px-3 ${open ? 'justify-start' : 'justify-center'}`}>
              <motion.span
                layout
                animate={{
                  display: "inline-block",
                  opacity: 1,
                }}
                className={`font-logo font-bold text-white tracking-tight ${open ? 'text-3xl' : 'text-2xl'}`}
              >
                {open ? "Orch8" : "O8"}
              </motion.span>
            </div>

            <div className="flex flex-col gap-1">
              {menuItems.map((item, idx) => (
                <SidebarLink key={idx} link={item} />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200/80">
            {/* User Profile */}
            {authUser && (
              <div className="mb-4">
                <div className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {authUser.username?.charAt(0).toUpperCase() || authUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <motion.div
                    animate={{
                      display: open ? "flex" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col overflow-hidden min-w-0"
                  >
                    <span className="text-sm font-semibold text-white truncate">
                      {authUser.username || 'User'}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {authUser.email}
                    </span>
                  </motion.div>
                </div>
              </div>
            )}

            <button
              onClick={handleSignout}
              disabled={isSigningOut}
              className="flex items-center gap-3 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all w-full p-2.5 rounded-lg group"
            >
              <svg className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap font-medium group-hover:text-red-500"
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      {/* Toaster needs to be outside or handled globally, but keeping here for now mostly invisible if collapsed, might need adjustment */}
      <div className="fixed bottom-4 left-4 z-[100]">
        <Toaster position="bottom-left" />
      </div>
    </>
  );
}

// Export default as alias for compatibility if needed, but updated import in WorkflowEditor
export default SidebarComponent;