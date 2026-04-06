const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-8 px-6 border-t-4 border-foreground bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold">
          <p className="text-xs">
            © {currentYear} Hassan. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a
              href="#about"
              className="text-foreground hover:bg-foreground hover:text-background px-2 py-1 border border-foreground transition-all duration-200"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-foreground hover:bg-foreground hover:text-background px-2 py-1 border border-foreground transition-all duration-200"
            >
              Skills
            </a>
            <a
              href="#contact"
              className="text-foreground hover:bg-foreground hover:text-background px-2 py-1 border border-foreground transition-all duration-200"
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
