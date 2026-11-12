import Link from "next/link";
import { footerLinks, legalLinks, site } from "@/content/site";
import { Logo, MadeInUsaMark } from "./Logo";
import { Icon } from "./ui";
import { SignupForm } from "./SignupForm";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-pine pb-24 text-snow md:pb-0">
      <div className="container-site grid gap-10 py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo className="h-10" />
          <p className="mt-3 text-[15px] opacity-80">{site.tagline}</p>
          <ul className="mt-6 space-y-2 text-[15px]">
            <li>
              <a href={`tel:${site.phone.tel}`} className="inline-flex items-center gap-2 hover:underline">
                <Icon name="phone" className="size-4" /> <span className="data text-[15px]">{site.phone.display}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:underline">
                <Icon name="mail" className="size-4" /> {site.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2 opacity-90">
              <Icon name="pin" className="mt-1 size-4" />
              <span>
                {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}
              </span>
            </li>
          </ul>
          <MadeInUsaMark className="mt-6 h-12 opacity-90" />
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:col-span-8">
          {footerLinks.map((g) => (
            <details key={g.heading} className="group" open>
              <summary className="eyebrow mb-3 cursor-pointer list-none opacity-80 md:pointer-events-none">{g.heading}</summary>
              <ul className="space-y-1.5 text-[15px]">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
      <div className="border-t border-snow/15">
        <div className="container-site grid gap-6 py-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-semibold">Deals and new products</p>
            <p className="mb-3 text-[15px] opacity-80">Sign up for our monthly specials and deals on accessories and new products.</p>
            <SignupForm tone="dark" />
          </div>
          <ul className="flex flex-wrap gap-4 md:justify-end">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} rel="noopener" className="hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-snow/15">
        <div className="container-site flex flex-col gap-3 py-6 text-[13px] opacity-80 md:flex-row md:justify-between">
          <p>
            © {year} {site.legalName}. Handcrafted in Denver, Colorado since 1955.
          </p>
          <ul className="flex gap-4">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
