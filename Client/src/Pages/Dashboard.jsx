import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {

  const [offerLetters, setOfferLetters] = useState([]);

  useEffect(() => {
    const fetchOfferLetters = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getOfferLetters`);
        console.log(response.data);
        setOfferLetters(response.data);
        
      } catch (error) {
        console.error('Failed to fetch offer letters:', error);
      }
    };

    fetchOfferLetters();
  }, []);



  return (
    <>
        <div className="container border rounded-lg shadow-lg mx-auto mt-5 ">
          <div className="flex-1  p-6">
            <h1 className="text-4xl font-bold">Welcome back, DOAGuru</h1>
            <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

              <Link to="">
              
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-2xl font-bold">29</p>
                  <p className="text-gray-600">Total Register Employee</p>
                </div>
              </Link>

              <Link to="">

                <div className="p-4 bg-white rounded-lg shadow-md">

                  <p className="text-2xl font-bold">{offerLetters.length}</p>

                  <p className="text-gray-600">Total Genrate Letter</p>
                </div>
              </Link>
              {/* <div className="p-4 bg-white rounded-lg shadow-md">
                <p className="text-2xl font-bold">{assign.length}</p>
                <p className="text-gray-600">Assign Projects </p>
              </div> */}
            </div>
          </div>
        </div>
   
    </>
  );
}
export default HomePage;
