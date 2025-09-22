import { BrowserRouter as Router, Routes, Route } from "react-router";
import Crm from "./pages/Dashboard/Crm";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import Maintenance from "./pages/OtherPage/Maintenance";
import FiveZeroZero from "./pages/OtherPage/FiveZeroZero";
import FiveZeroThree from "./pages/OtherPage/FiveZeroThree";
import ComingSoon from "./pages/OtherPage/ComingSoon";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import Success from "./pages/OtherPage/Success";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import UserList from "./pages/Users/UserList";
import CreateUser from "./pages/Users/CreateUser";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute, PublicRoute } from "./routes";
import { EnhancedProtectedRoute, PanjarRoute, BudgetRoute } from "./routes/EnhancedProtectedRoute";
import { store } from "./app/store";
import { Provider } from "react-redux";
import PanjarList from "./pages/Panjars/PanjarList";
import BudgetList from "./pages/Budgets/BudgetList";
import AddBudget from "./pages/Budgets/AddBudget";
import DetailBudget from "./pages/Budgets/DetailBudget";
import DetailPanjar from "./pages/Panjars/DetailPanjar";
import AddPanjar from "./pages/Panjars/AddPanjar";
import EditPanjar from "./pages/Panjars/EditPanjar";
import {Toaster} from "react-hot-toast"
import AddPanjarRealizationItem from "./pages/Panjars/AddPanjarRealizationItem";
import DetailPanjarRealizationItem from "./pages/Panjars/DetailPanjarRealizationItem";
import EditPanjarRealizationItem from "./pages/Panjars/EditPanjarRealizationItem";
import CreatePanjarRealizationItem from "./pages/Panjars/CreatePanjarRealizationItem";
import PermissionExamplePage from "./pages/PermissionExamplePage";
import DynamicRouteExamplePage from "./pages/DynamicRouteExamplePage";

export default function App() {
  return (
    <>
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" />
        <AuthProvider>
          <Routes>
            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
            <Route index path="/" element={<ProtectedRoute><Crm /></ProtectedRoute>} />

            {/* Tables - Using Enhanced Dynamic Protection */}
            <Route path="/users" element={<EnhancedProtectedRoute requireAdmin><UserList /></EnhancedProtectedRoute>} />
            <Route path="/users/create" element={<EnhancedProtectedRoute requireAdmin><CreateUser /></EnhancedProtectedRoute>} />
            <Route path="/panjars" element={<PanjarRoute><PanjarList /></PanjarRoute>} />
            {/* List Resources Route Budget */}
            <Route path="/budgets" element={<BudgetRoute><BudgetList /></BudgetRoute>} />
            <Route path="/budgets/:id" element={<BudgetRoute><DetailBudget /></BudgetRoute>} />
            <Route path="/budgets/add" element={<BudgetRoute><AddBudget /></BudgetRoute>} />

            <Route path="/panjars/:id" element={<PanjarRoute><DetailPanjar /></PanjarRoute>} />
            <Route path="/panjars/add" element={<EnhancedProtectedRoute roles={['kepala-urusan']}><AddPanjar /></EnhancedProtectedRoute>} />
            <Route path="/panjars/edit/:id" element={<EnhancedProtectedRoute permissions={['panjar.edit']}><EditPanjar /></EnhancedProtectedRoute>} />
            <Route path="/panjars/:panjarId/realization/item/:itemId" element={<PanjarRoute><AddPanjarRealizationItem /></PanjarRoute>} />
            <Route path="/panjar-realization-items/:panjarRealizationItemId" element={<PanjarRoute><DetailPanjarRealizationItem /></PanjarRoute>} />
            <Route path="/panjar-realization-items/edit/:panjarRealizationItemId" element={<ProtectedRoute><EditPanjarRealizationItem /></ProtectedRoute>} />
            <Route path="/panjar-realization-items/create/:panjarRequestId" element={<ProtectedRoute><CreatePanjarRealizationItem /></ProtectedRoute>} />
            
            {/* Permission Example Pages for Testing */}
            <Route path="/permission-example" element={<ProtectedRoute><PermissionExamplePage /></ProtectedRoute>} />
            <Route path="/dynamic-route-example" element={<EnhancedProtectedRoute><DynamicRouteExamplePage /></EnhancedProtectedRoute>} />
          </Route>
          {/* Auth Layout */}
          <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/success" element={<Success />} />
          <Route path="/five-zero-zero" element={<FiveZeroZero />} />
          <Route path="/five-zero-three" element={<FiveZeroThree />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Provider>
    </>
  );
}
