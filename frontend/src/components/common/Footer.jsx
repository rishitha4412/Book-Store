import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiHeart, FiBookOpen } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-border-main/50 bg-bg-surface/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-12">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary text-white rounded-lg">
                <FiBookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-text-main">
                Book<span className="text-primary">Haven</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">
              Premium curated online bookstore dedicated to helping engineers, builders, and learners find world-class publications.
            </p>
            <div className="flex gap-3 text-text-muted">
              <a href="#" className="p-2 border border-border-main rounded-xl hover:text-primary hover:bg-bg-surface transition-all">
                <FiGithub className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-border-main rounded-xl hover:text-primary hover:bg-bg-surface transition-all">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-border-main rounded-xl hover:text-primary hover:bg-bg-surface transition-all">
                <FiInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/books" className="text-text-muted hover:text-primary transition-colors">All Books</Link></li>
              <li><Link to="/books?category=technology" className="text-text-muted hover:text-primary transition-colors">Tech Books</Link></li>
              <li><Link to="/books?category=business" className="text-text-muted hover:text-primary transition-colors">Business & Finance</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Press Kit</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-main">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Contact Helpdesk</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border-main/40 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} BookHaven. Built for MERN integration.</p>
          <p className="flex items-center gap-1">
            Made with <FiHeart className="text-red-500 fill-current w-3.5 h-3.5" /> by Antigravity IDE team.
          </p>
        </div>
      </div>
    </footer>
  );
}
