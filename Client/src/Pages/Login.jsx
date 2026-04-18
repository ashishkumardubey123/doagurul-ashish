import { Link, useNavigate } from "react-router-dom";
import CLogo from "../assets/images/CLogo.png";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [render, setRender] = useState('');
  // const navigate = useNavigate();



  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, { username, password })
      .then(response => {
        if (response.data && response.data.token) {
          // Save token to localStorage
          localStorage.setItem('token', response.data.token);
          // localStorage.setItem('user');
          toast.success('Login successful!');
          console.log('Login successful, token saved:', response.data.token);
          
          // You can set render state here if needed
          
          // Navigate to another page
          window.location.href = '/dashboard';
          
          setRender(!render)
        } else {
          console.error('Unexpected response format:', response.data);
          alert('Login successful, but no token received.');
        }
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
          console.log(error.response.data.message);
        } else {
          alert('Login failed: an unknown error occurred');
          console.log('Error details:', error);
        }
      });
  };


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src={CLogo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="modalButton">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit} method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  placeholder="Username"
                  type="text"
                  autoComplete="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full rounded-md border-2 py-1.5 ps-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={password}
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-2 py-1.5 ps-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="https://doaguru.com/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Join Team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
