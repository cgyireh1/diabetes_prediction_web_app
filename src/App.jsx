import Header from "./Components/Header";
import "./App.css"
import Footer from "./Components/Footer";
import { Outlet } from "react-router-dom";

export default function App(){
  return(
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}