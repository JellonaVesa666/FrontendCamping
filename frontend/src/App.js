//---React---//
// import
import { BrowserRouter, Route, Routes } from "react-router-dom"

//---CSS--//
// import
import './pages/css/style.css';

//---Components---//
// import
import Header from "./components/headerComponent";
import ProtectedRoutes from "./components/protectedRoutesComponent";

//---Pages---//
// import
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import AdminUserPage from "./pages/admin/adminUserPage";
import AdminCabinListPage from "./pages/admin/adminCabinListPage";
import AdminCabinsPage from "./pages/admin/adminCabinsPage";

//---Component---//
// Initialize
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/adminhome" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Admin protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin/cabinlists" element={<AdminCabinListPage />} />
          <Route path="/admin/cabinslist/cabins/:listId" element={<AdminCabinsPage />} />
          <Route path="/admin/users" element={<AdminUserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

//---Component---//
// Export
export default App;