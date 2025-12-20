import { Route, Routes, Navigate } from "react-router-dom";

import useAuthUser from "./hooks/userHooks/useAuthUser";
import WorkflowEditor from "./pages/WorkflowEditor";
import Sidebar from "./pages/Sidebar";
import Credentials from "./pages/Credentials";
import Executions from "./pages/Executions";
import Projects from "./pages/Projects";
import { Spinner } from "./components/ui";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";


// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-950 to-gray-900">
        <div className="mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 4h3v7H8V4zm5 0h3v10h-3V4zM8 13h3v7H8v-7z" />
          </svg>
        </div>
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-gray-400 animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect to dashboard if already authenticated)
// function PublicRoute({ children }: { children: React.ReactNode }) {
//   const { isLoading, authUser } = useAuthUser();

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-950 to-gray-900">
//         <div className="mb-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse">
//           <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M8 4h3v7H8V4zm5 0h3v10h-3V4zM8 13h3v7H8v-7z"/>
//           </svg>
//         </div>
//         <Spinner size="lg" color="primary" />
//         <p className="mt-4 text-gray-400 animate-pulse">Loading...</p>
//       </div>
//     );
//   }

//   if (authUser) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <>{children}</>;
// }

// Dashboard Layout Component
function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <WorkflowEditor />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="h-screen bg-gray-950">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/signin"
          element={
            <SignIn />
          }
        />

        <Route
          path="/signup"
          element={
            <SignUp />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workflow/:id"
          element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1">
                  <Projects />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/credentials"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1">
                  <Credentials />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/executions"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1">
                  <Executions />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

