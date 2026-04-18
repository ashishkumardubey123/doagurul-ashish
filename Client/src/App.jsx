import { Fragment, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./Components/navbar";
import Footer from "./Components/footer";

// Pages
import LoginPage from "./Pages/Login";
import HomePage from "./Pages/Dashboard";

// Letter Components
import OfferLater from "./Pages/LettersPage/OfferLater";
import InternshipOfferLetter from "./Pages/LettersPage/InternshipOfferLetter";
import RelievingLetter from "./Pages/LettersPage/RelievingLetter";
import ViewOfferLettersPage from "./Pages/LettersPage/ViewLetters";
import WarningLetter from "./Components/Nousheen/Inputform";
import EmployeeForm from "./Components/EmployeeForm";
import TerminationLetter from "./Pages/LettersPage/TerminationLetter";
import SalarySlip from "./Components/sallaeySlip";
import DownloadOfferLetter from "./Pages/LettersPage/DownloadOfferLetter";


const App = () =>{
  const [render, setRender] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'))

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); // Clear state
    setRender(prev => !prev);
    navigate('/');
  };

  const handleRender = () => {
    setRender(!render);
  };

  useEffect(() => {
    const publicPaths = ['/'];
    const currentPath = window.location.pathname;

    if (token) {
      // If logged in and on login page, go to dashboard
      if (currentPath === '/') {
        navigate('/dashboard');
      }
    } else {
      // If not logged in and not on a public path, go to login
      if (!publicPaths.includes(currentPath)) {
        navigate('/');
      }
    }
  }, [token, navigate]);

  return(
    <Fragment>
    <main style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* //Navbar  */}
      <Navbar Logout={handleLogout} render={render} />

      {/* -------------------- */}

    <Routes>
      {/* <Route path="/" element={<Home/>} /> */}
      
      <Route path="/" element={<LoginPage/>} />
      <Route path="/dashboard" element={<HomePage/>} />

      <Route path="/Offer-Letter-Genrate/:id?" element={<OfferLater/>} />
      <Route path="/intern-offer-letter" element={<InternshipOfferLetter/>} />
      <Route path="/Relieving-Letter-Genrate" element={<RelievingLetter/>} />
      <Route path="/Termination-Letter-Genrate" element={<TerminationLetter/>} />
      <Route path="/OfferLetter" element={<ViewOfferLettersPage/>} />
      <Route path="/download/offer-letter" element={<DownloadOfferLetter/>} />
      <Route path="/Warning-Letter-Genrate" element={<WarningLetter/>} />
      <Route path="/salary-slip" element={<SalarySlip/>} />
      <Route path="/Experince-Letter-Genrate" element={<EmployeeForm/>} />

    </Routes>


    <Footer/>
    </main>
    </Fragment>
  );
}

export default App;
