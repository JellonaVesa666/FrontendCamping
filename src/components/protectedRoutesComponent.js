//---React---//
// import
import { Outlet, Navigate } from "react-router-dom";


//---Controller---//
// import
import { IsAuthenticated } from "../controllers/authController";


//---Component---//
// Initialize
const ProtectedRoutes = () => {

  const user = IsAuthenticated();  // Assign localStorage data to user

  if (!isEmpty(user)) { // Check if user is not empty
    return (
      user.token && user.user.role === 0 ? <Outlet /> : <Navigate to="/login" />
    );
  }
}

const isEmpty = (user) => {
  for (const property in user) {
    return false;
  }
  return true;
}


//---Component---//
// export
export default ProtectedRoutes;