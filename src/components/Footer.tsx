const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper border-t-2 border-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="footer-inner">
          <p className="text-[10px] font-mono">
            © {currentYear} Hassan. <span className="opacity-60">process.exit(0)</span>
          </p>

          <div className="flex gap-4">
            <a
              href="#about"
              className="text-foreground hover:bg-foreground hover:text-background px-3 py-1 border-2 border-foreground transition-all duration-200 text-[10px] font-mono"
            >
              ~/about
            </a>
            <a
              href="#skills"
              className="text-foreground hover:bg-foreground hover:text-background px-3 py-1 border-2 border-foreground transition-all duration-200 text-[10px] font-mono"
            >
              ~/skills
            </a>
            <a
              href="#contact"
              className="text-foreground hover:bg-foreground hover:text-background px-3 py-1 border-2 border-foreground transition-all duration-200 text-[10px] font-mono"
            >
              ~/contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
