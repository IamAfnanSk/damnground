function Footer() {
  return (
    <div className="px-6 py-1 flex items-center justify-between">
      <div>
        <p>
          😍
          <b> Features Implemented:</b> Multiple resizable windows, Textmate
          grammers, Real CLI, Multi file monaco editor, Real output, File
          management, File listing, File saving to DB, etc.
        </p>
      </div>
      <div>
        <a
          href="https://afnan.dev?utm_source=damnground"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/assets/logo.jpg"
            className="w-10"
            alt="Afnan Shaikh's Logo"
          />
        </a>
      </div>
    </div>
  );
}

export default Footer;
