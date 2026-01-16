import { Route, Routes, Navigate } from "react-router-dom";

import useAuthUser from "./hooks/userHooks/useAuthUser";
import WorkflowEditor from "./pages/WorkflowEditor";
import Sidebar from "./pages/Sidebar";
import Credentials from "./pages/Credentials";
import Executions from "./pages/Executions";
import Projects from "./pages/Projects";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import LandingPage from "./pages/LandingPage";



function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <h1 className="font-logo font-bold text-4xl text-white tracking-tight animate-pulse">Orch8</h1>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) {
     return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <h1 className="font-logo font-bold text-4xl text-white tracking-tight animate-pulse">Orch8</h1>
      </div>
    );
  }

  if (authUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}


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
        
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } 
        />

        <Route
          path="/signin"
          element={
             <PublicRoute>
                <SignIn />
             </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
                <SignUp />
            </PublicRoute>
          }
        />

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

      </Routes>
    </div>
  );
}

