const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground italic">
            Pssssssst... Click the UFO to toggle theme & play music!!!
          </p>

          <p className="text-sm text-muted-foreground">
            © {currentYear} Hassan. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Skills
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
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
