const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="max-w-6xl mx-auto">
        <div className="footer-inner">
          <p className="text-[10px]">
            © {currentYear} Hassan. sys.halt().
          </p>

          <div className="flex gap-4">
            <a
              href="#about"
              className="text-foreground hover:bg-foreground hover:text-background px-3 py-1 border-2 border-foreground transition-all duration-200 text-[10px]"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-foreground hover:bg-foreground hover:text-background px-3 py-1 border-2 border-foreground transition-all duration-200 text-[10px]"
            >
              Skills
            </a>
            <a
              href="#contact"
              className="text-foreground hover:bg-foreground hover:text-background px-3 py-1 border-2 border-foreground transition-all duration-200 text-[10px]"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
