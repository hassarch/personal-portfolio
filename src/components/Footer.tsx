const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper border-t-2 border-foreground">
      <div className="max-w-6xl mx-auto">
        {/*
          Section links used to live here too, but they duplicated the sticky
          navbar verbatim — the navbar is on screen at every scroll position.
        */}
        <p className="text-center text-[10px] font-bold uppercase tracking-widest font-mono">
          © {currentYear} Hassan. <span className="opacity-60">process.exit(0)</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
