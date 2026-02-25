import { Link } from "react-router-dom";
import { Twitter, Github, MessageCircle } from "lucide-react";

const footerLinks = {
  platform: [
    { name: "Explore Gigs", href: "/explore" },
    { name: "Learn Hub", href: "/learn" },
    { name: "Sign In / Sign Up", href: "/auth" },
    { name: "Leaderboard", href: "/explore" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "API", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Changelog", href: "#" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Press Kit", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: MessageCircle, href: "#", label: "Discord" },
];

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-display font-bold text-lg">S</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Shaenx
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Learn. Build. Earn.<br />
              The future of work starts here.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shaenx. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the Tech community
          </p>
        </div>
      </div>
    </footer>
  );
}
