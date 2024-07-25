import { Route, Routes } from "react-router-dom";
import {
  Login,
  Signup,
  Home,
  Problems,
  Problem,
  AddProblem,
  UpdateProblem,
  DeleteProblem,
  AdminLogin,
  AdminSignup,
  UserProfile,
  Leaderboard,
  ForgotPassword,
  OtpFillForm,
  UpdatePassword,
  ContactUs,
  AboutUs,
} from "./pages";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problem/:title" element={<Problem />} />
        <Route path="/addProblem" element={<AddProblem />} />
        <Route path="/updateProblem" element={<UpdateProblem />} />
        <Route path="/deleteProblem" element={<DeleteProblem />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminSignup" element={<AdminSignup />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/otp" element={<OtpFillForm />} />
        <Route path="/passwordupdate" element={<UpdatePassword />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </div>
  );
}

export default App;