import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { selectTheme } from "../redux/slices/ThemeSwitcher";
import type { RootState } from "../redux/store";
import { Outlet } from "react-router-dom";

const Home = () => {
  const currentTheme = useSelector<RootState, "light" | "dark">(selectTheme);
  return (
    <div
      className={`${currentTheme === "light" ? `bg-[#FAFAFA] text-black` : `bg-[#08080a] text-white`} min-h-[100vh]`}
    >
      <div className="top-0 sticky z-50">
        <Navbar links={[
        ]}/>
      </div>
      <Outlet/>
    </div>
  );
};

export default Home;
