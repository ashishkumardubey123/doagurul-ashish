import { useState, useEffect } from 'react';
import axios from 'axios';

const ViewOfferLettersPage = () => {
  const [offerLetters, setOfferLetters] = useState([]);

  useEffect(() => {
    const fetchOfferLetters = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getOfferLetters`);
        setOfferLetters(response.data);
      } catch (error) {
        console.error('Failed to fetch offer letters:', error);
      }
    };

    fetchOfferLetters();
  }, []);

  const handleDownload = (id) => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/api/downloadPdf/${id}`, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Offer Letters</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Name</th>
            <th className="border-b px-4 py-2">Offer Release Date</th>
            <th className="border-b px-4 py-2">Joining Date</th>
            <th className="border-b px-4 py-2">Designation</th>
            <th className="border-b px-4 py-2">Designation</th>
            <th className="border-b px-4 py-2">Designation</th>
            <th className="border-b px-4 py-2">Designation</th>
            <th className="border-b px-4 py-2">Designation</th>
            <th className="border-b px-4 py-2">Designation</th>
            <th className="border-b px-4 py-2">Designation</th>
            <th className="border-b px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offerLetters.map((letter) => (
            <tr key={letter.id}>
              <td className="border-b px-4 py-2">{letter.name}</td>
              <td className="border-b px-4 py-2">{letter.offerReleaseDate}</td>
              <td className="border-b px-4 py-2">{letter.joiningDate}</td>
              <td className="border-b px-4 py-2">{letter.designation}</td>
              <td className="border-b px-4 py-2">{letter.designation}</td>
              <td className="border-b px-4 py-2">{letter.designation}</td>
              <td className="border-b px-4 py-2">{letter.designation}</td>
              <td className="border-b px-4 py-2">{letter.designation}</td>
              <td className="border-b px-4 py-2">{letter.designation}</td>
              <td className="border-b px-4 py-2">{letter.designation}</td>
              <td className="border-b px-4 py-2">
                <button
                  onClick={() => handleDownload(letter.id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewOfferLettersPage;
