import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./page/CreateListing";
import EmailVerification from "./page/EmailVerification";
import ForgotPassword from "./page/ForgotPassword";
import Home from "./page/Home";
import ListingPage from "./page/ListingPage";
import Login from "./page/Login";
import NotFound from "./page/NotFound";
import Profile from "./page/Profile";
import Register from "./page/Register";
import Search from "./page/Search";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/register/email-verification"
          element={<EmailVerification />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* <Route path="/profile" element={<PrivateRoute />}>
          
        </Route> */}

        <Route path="/search" element={<Search />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/listing/:listingID" element={<ListingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
