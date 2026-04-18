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
import InternExperienceLetter from "./Pages/LettersPage/InternExperienceLetter";
import InternPPOLetter from "./Pages/LettersPage/InternPPOLetter";
import DownloadInternOfferLetter from "./Pages/LettersPage/DownloadInternOfferLetter";
import DownloadInternExperienceLetter from "./Pages/LettersPage/DownloadInternExperienceLetter";
import DownloadInternPPOLetter from "./Pages/LettersPage/DownloadInternPPOLetter";
import DownloadExperienceLetter from "./Pages/LettersPage/DownloadExperienceLetter";
import DownloadRelievingLetter from "./Pages/LettersPage/DownloadRelievingLetter";
import DownloadTerminationLetter from "./Pages/LettersPage/DownloadTerminationLetter";
import DownloadSalarySlip from "./Pages/LettersPage/DownloadSalarySlip";


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
      <Route path="/warning-letter-genrate" element={<WarningLetter/>} />
      <Route path="/salary-slip" element={<SalarySlip/>} />
      <Route path="/experince-letter-genrate" element={<EmployeeForm/>} />

      <Route path="/intern-experience-letter" element={<InternExperienceLetter/>} />
      <Route path="/intern-ppo-letter" element={<InternPPOLetter/>} />

      {/* Download Pages */}
      <Route path="/download/intern-offer-letter" element={<DownloadInternOfferLetter/>} />
      <Route path="/download/intern-experience-letter" element={<DownloadInternExperienceLetter/>} />
      <Route path="/download/intern-ppo-letter" element={<DownloadInternPPOLetter/>} />
      <Route path="/download/experience-letter" element={<DownloadExperienceLetter/>} />
      <Route path="/download/relieving-letter" element={<DownloadRelievingLetter/>} />
      <Route path="/download/termination-letter" element={<DownloadTerminationLetter/>} />
      <Route path="/download/salary-slip" element={<DownloadSalarySlip/>} />

    </Routes>


    <Footer/>
    </main>
    </Fragment>
  );
}

export default App;
