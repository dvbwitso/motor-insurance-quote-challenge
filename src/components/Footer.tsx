import { memo } from 'react';


const Footer: React.FC = memo(() => (
  <footer className="bg-gray-800 text-white p-4 transition-all duration-300" role="contentinfo">
    <div className="container mx-auto text-center">
      <p className="text-sm sm:text-base">
        &copy; 2025 Hobbiton Technologies Limited. All rights reserved.
      </p>
      <a
        href="/privacy-policy"
        className="underline text-blue-300 hover:text-blue-100 text-xs block mt-2"
        aria-label="Privacy Policy"
      >
        Privacy Policy
      </a>
    </div>
  </footer>
));

Footer.displayName = 'Footer';

export default Footer;