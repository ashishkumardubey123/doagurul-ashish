import CLogo from "../assets/images/CLogo.png";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  {
    name: "Generate Letter",
    href: "#", // Placeholder since this has a submenu
    subMenu: [
      {
        name: "Intern",
        subMenu: [
          { name: "Offer Letter", href: "/intern-offer-letter" },
          { name: "Experience Letter", href: "/intern-experience-letter" },
          { name: "Other Letters", href: "/intern-other-letters" },
        ],
      },
      {
        name: "Employee",
        subMenu: [
          { name: "Offer Letter", href: "/Offer-Letter-Genrate" },
          { name: "Experience Letter", href: "/Experince-Letter-Genrate" },
          { name: "Relieving Letter", href: "/Relieving-Letter-Genrate" },
          { name: "Termination Letter", href: "/Termination-Letter-Genrate" },
          { name: "Warning Letters", href: "/Warning-Letter-Genrate" },
          { name: "Other Letters", href: "/employee-other-letters" },
          { name: "Salary Slip", href: "/salary-slip" },
        ],
      },
    ],
  },
  {
    name: "Download Letter",
    href: "#",
    subMenu: [
      {
        name: "Intern Letters",
        subMenu: [
          { name: "Download Offer Letter", href: "/download/intern-offer-letter" },
          { name: "Download Experience Letter", href: "/download/intern-experience-letter" },
          { name: "Download Other Letters", href: "/download/intern-other-letters" },
        ],
      },
      {
        name: "Employee Letters",
        subMenu: [
          { name: "Download Offer Letter", href: "/download/offer-letter" },
          { name: "Download Experience Letter", href: "/download/experience-letter" },
          { name: "Download Relieving Letter", href: "/download/relieving-letter" },
          { name: "Download Termination Letter", href: "/download/termination-letter" },
          { name: "Download Warning Letters", href: "/download/warning-letters" },
          { name: "Download Salary Slip", href: "/download/salary-slip" },
        ],
      },
    ],
  },
  { name: "Report", href: "/report" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState("User name");
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenSubmenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      const user = JSON.parse(localStorage.getItem("user"));
      setUserName(user?.full_name || "DG ");
    }
  }, []);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-full sm:mx-5 px-2 sm:px-3 lg:px-1">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {token && (
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                )}
              </div>
              <div className="flex flex-1 items-center ms-12 sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src={CLogo}
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  {token && (
                    <div className="flex space-x-4">
                      {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        if (!item.subMenu) {
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className={classNames(
                                isActive
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={isActive ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          );
                        } else {
                          return (
                            <div key={item.name} className="relative">
                              <button
                                type="button"
                                className={classNames(
                                  "text-gray-300 hover:bg-gray-700 hover:text-white",
                                  "rounded-md px-3 py-2 text-sm font-medium flex items-center"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenSubmenu(openSubmenu === item.name ? null : item.name);
                                }}
                              >
                                {item.name}
                                <svg
                                  className={`ml-1 h-4 w-4 transition-transform ${
                                    openSubmenu === item.name ? 'transform rotate-180' : ''
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              {openSubmenu === item.name && (
                                <div 
                                  className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {item.subMenu.map((subItem) => (
                                    <div key={subItem.name} className="relative group">
                                      <div
                                        className={`flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                                          subItem.subMenu ? 'pr-2' : ''
                                        }`}
                                        onClick={() => {
                                          if (!subItem.subMenu && subItem.href) {
                                            navigate(subItem.href);
                                            setOpenSubmenu(null);
                                          }
                                        }}
                                      >
                                        <span>{subItem.name}</span>
                                        {subItem.subMenu && (
                                          <svg
                                            className="h-4 w-4 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 5l7 7-7 7"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                      {subItem.subMenu && (
                                        <div className="absolute left-full top-0 z-10 mt-0 w-56 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                          {subItem.subMenu.map((letter) => (
                                            <Link
                                              key={letter.name}
                                              to={letter.href}
                                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                              onClick={() => setOpenSubmenu(null)}
                                            >
                                              {letter.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              </div>
              {token && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 text-white">
                  <div className="mx-3 flex ">
                    <p>
                      <b>Hello, {userName}</b>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://doaguru.com/static/media/doagurulogo-removebg.b0126812bbe704a27f8f.webp"
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ focus }) => (
                            <Link
                              to="#"
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ focus }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              )}
            </div>
          </div>

          {token && (
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className={classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                })}
              </div>
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
}
