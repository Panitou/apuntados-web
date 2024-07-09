import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Logo from "../assets/img/logo-apuntados.png";

function Home() {
  return (
    <div>
      <div className="font-inter absolute inset-0 -z-10 h-full w-full items-center pt-40 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#3A3A3B_100%)]">
        {/* top */}
        <div className="flex flex-col items-center justify-center gap-6 p-28 px-3 max-w-6xl mx-auto">
          <img src={Logo} alt="" className="w-[500px] h-auto" />
          {/* <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Consigue los mejores{" "}
          <span className="text-slate-500">apuntes universitarios</span>
          <br />
        </h1> */}
          <div className="text-[#7F7F80] text-2xl sm:text-[20px] text-center font-semibold w-[500px]">
            Compra y vende apuntes, y gana una comisión por cada venta.
          </div>
          <Link
            to={"/search"}
            className="items-center justify-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 hero-join-button-dark group relative mx-auto hidden w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 dark:block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
          >
            <span className="inline-flex h-full w-fit items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
              ¡Quiero ver apuntes!
            </span>
          </Link>
        </div>
        {/* swiper */}
        {/* listing results */}
        <footer className="pt-16">
          <Footer />
        </footer>
      </div>
    </div>
  );
}

export default Home;
