import { Menu, Moon, Sun, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { selectTheme, toggleTheme } from "../redux/slices/ThemeSwitcher";
import { AnimatePresence, motion } from "motion/react";
import { selectIsMenuOpen, toggleMenu } from "../redux/slices/mobileView";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout, selectIsLoggedIn } from "../redux/slices/authSlice";
import { axiosInstance } from "@/pages/auth/Login";
const listVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

// 2. Variant for each menu item
const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};
type NavbarProps = {
  links: { name: string; href: string }[];
}
const Navbar = (props:NavbarProps) => {
  const mobileOpen = useSelector<RootState, boolean>(selectIsMenuOpen);
  const currentTheme = useSelector<RootState, "light" | "dark">(selectTheme);
  const isLoggedIn = useSelector<RootState, boolean>(selectIsLoggedIn);
  const isAdmin = useSelector<RootState, boolean>((state:RootState) => state.auth.isAdmin);
  const token = useSelector<RootState, string | null>((state:RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  const navLinks = [
    ...props.links
  ];

  const hanldeLogout = async () => {
    try {
      let response;
      if (!isLoggedIn) {
        navigate('/login',{state:{from:location}})
        return
      } else {
        if (isAdmin) {
          dispatch(logout());
          response = await axiosInstance.post('/admin/logout', {}, {
            headers: { authorization: `Bearer ${token}` }
          })
          if (response.status === 200) {
            navigate('/login',{state:{from:location}})
          }
        } else {
          dispatch(logout());
          response = await axiosInstance.post('/user/logout', {
            withCredentials: true
          })
          if (response.status === 200) {
            navigate('/login',{state:{from:location}})
          }
        }
      }
      if (response.status === 200) {
        navigate('/login',{state:{from:location}})
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  return (
    <nav
      className={`w-full border-b/35  ${currentTheme === "light" ? `bg-white/15 text-black ` : `bg-black/1 text-white`} backdrop-blur-lg transition ease transform duration-700`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-br from-purple-800 to-purple-400 bg-clip-text text-transparent">
              OutreachHub
            </span>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                className={`text-sm font-medium transition-colors hover:text-primary ${currentTheme === "light" ? `text-dark` : `text-white`}`}
              >
                <NavLink to={link.href} className={({ isActive }) => (isActive ? ` border-b-2 border-primary ${currentTheme === 'light' ? 'border-black' : 'border-white'}` : "")}>
                  {link.name}
                </NavLink>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <button
                  className={`rounded-lg  ${currentTheme === "light" ? `text-dark bg-white hover:bg-gray-200/50` : `text-white bg-black hover:bg-gray-800`}  transition duration-220 px-4 py-1`}
                  onClick={hanldeLogout}
                >
                  Logout
                </button>
              ) :
                (
                  <Link
                    to="/login"
                    className="text-sm font-medium  hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                )
              }
              <button
                onClick={() => {
                  handleThemeToggle();
                }}
              >
                {currentTheme === "light" ? <Sun /> : <Moon />}
              </button>
            </div>

            <button
              className="inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground md:hidden"
              onClick={() => dispatch(toggleMenu())}
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col space-y-2 pb-4 md:hidden"
            >
              <motion.div
                className="flex flex-col space-y-2"
                variants={listVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={itemVariants}
                    className={`block text-sm font-medium transition-colors hover:text-primary `}
                  >
                    <NavLink to={link.href} className={({ isActive }) => (isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground")}>
                      {link.name}
                    </NavLink>
                  </motion.div>
                ))}
                <motion.div
                  variants={itemVariants}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <NavLink to="/login" className={({ isActive }) => (isActive ? "text-primary" : "text-muted-foreground")}>
                    Login
                  </NavLink>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                >
                  <button
                    onClick={() => {
                      handleThemeToggle();
                    }}
                  >
                    {currentTheme === "light" ? <Sun /> : <Moon />}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
export default Navbar;
