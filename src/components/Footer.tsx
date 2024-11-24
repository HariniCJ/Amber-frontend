import React from "react";

export function Footer() {
  return (
    <footer className="w-full bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Project Info */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-xl font-semibold">AMBER</h2>
            <p className="text-sm mt-2">
              A centralized system connecting ambulance drivers, doctors, and
              traffic police for seamless emergency response.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row gap-4 text-center">
            <a href="/ambulance" className="text-sm hover:underline">
              Ambulance
            </a>
            <a href="/doctors" className="text-sm hover:underline">
              Doctors
            </a>
            <a href="/traffic" className="text-sm hover:underline">
              Traffic
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center">
          <p className="text-xs">
            © {new Date().getFullYear()} AMBER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
