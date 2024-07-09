import React from "react";

function Footer() {
  return (
    <footer class="m-4 font-inter ">
      <div class="mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span class="text-sm text-white/80 hover:text-white sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://www.ucv.edu.pe/" class="no-underline">
            Universidad César Vallejo
          </a>
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium hover:text-white text-white/80  sm:mt-0">
          <li>
            <a href="#" class="no-underline me-4 md:me-6">
              About
            </a>
          </li>
          <li>
            <a href="#" class="no-underline me-4 md:me-6">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" class="no-underline me-4 md:me-6">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" class="no-underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
