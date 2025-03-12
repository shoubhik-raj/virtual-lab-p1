import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import DepartmentPage from "./pages/DepartmentPage";
import LabPage from "./pages/LabPage";
import ExperimentPage from "./pages/ExperimentPage";
import CollectionsPage from "./pages/CollectionsPage";
import LabNotebookPage from "./pages/LabNotebookPage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";
import Layout from "./components/Layout";
import ThemeDebug from "./components/ThemeDebug";
import { DataProvider } from "./contexts/DataContext";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import LabNoteOpenPage from "./pages/LabNoteOpenPage";

function App() {
  const [hasEnteredPortal, setHasEnteredPortal] = useState(false);

  useEffect(() => {
    // Check if user has previously entered the portal
    const portalStatus = localStorage.getItem("hasEnteredPortal");
    if (portalStatus === "true") {
      setHasEnteredPortal(true);
    }
  }, []);

  const handleEnterPortal = () => {
    setHasEnteredPortal(true);
    localStorage.setItem("hasEnteredPortal", "true");
  };

  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Landing Page - shown only if user hasn't entered portal */}
          <Route
            path="/"
            element={
              hasEnteredPortal ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage onEnterPortal={handleEnterPortal} />
              )
            }
          />

          {/* Protected routes - all use the Layout component */}
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="departments/:departmentId"
              element={<DepartmentPage />}
            />
            <Route
              path="departments/:departmentId/labs/:labId"
              element={<LabPage />}
            />
            <Route
              path="departments/:departmentId/labs/:labId/experiments/:experimentId"
              element={<ExperimentPage />}
            />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="notebook" element={<LabNotebookPage />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route
              path="collections/:collectionId"
              element={<CollectionDetailPage />}
            />
            <Route
              path="/notebook/:experimentId"
              element={<LabNoteOpenPage />}
            />
          </Route>

          {/* Catch all unmatched routes */}
          <Route
            path="*"
            element={
              <Navigate to={hasEnteredPortal ? "/dashboard" : "/"} replace />
            }
          />
        </Routes>
        <ThemeDebug />
      </Router>
    </DataProvider>
  );
}

export default App;
