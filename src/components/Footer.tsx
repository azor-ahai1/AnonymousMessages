"use client";

import { Github } from "lucide-react"

const Footer = () => {
    return(
              <footer className="bg-gray-900 text-white py-4 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            {/* Company Info */}
            <div className="text-center md:text-left ml-10">
              <h3 className="text-xl font-bold mb-4">Secret Ping</h3>
              <p className="text-sm text-gray-300 max-w-md mx-auto md:mx-0">
                Your identity remains a secret. Share thoughts, feedback, and messages anonymously in a safe and secure environment.
              </p>
            </div>

            {/* Social Links */}
            <div className="text-center md:text-right mr-10">
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex justify-center md:justify-end mr-15">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
                {/* <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a> */}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Secret Ping. All Rights Reserved. | Privacy First, Always Anonymous.
            </p>
          </div>
        </div>
      </footer>
    )
}

export default Footer;