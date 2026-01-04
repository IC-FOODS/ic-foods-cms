import Link from "next/link";
import Image from "next/image";
import { Container } from "../ui/Container";
import { navigation } from "@/lib/site/nav";
import { cn } from "@/lib/utils/cn";

export function Footer() {
  return (
    <footer className="bg-primary text-white relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent"></div>
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/ic-foods-website/logo.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 flex-shrink-0"
              />
              <h3 className="text-lg font-semibold">
                <span className="text-white">IC-</span>
                <span className="text-accent">FOODS</span>
              </h3>
            </div>
            <p className="text-sm text-slate-200">
              Internet of Food Systems - Connecting communities, data, and
              technology to build sustainable food systems.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-200 hover:text-accent no-underline hover:underline transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <address className="text-sm text-slate-200 not-italic space-y-1">
              <p>
                <a
                  href="mailto:info@ic-foods.org"
                  className="hover:text-accent transition-colors"
                >
                  info@ic-foods.org
                </a>
              </p>
              <p>1234 University Drive</p>
              <p>Davis, CA 95616</p>
            </address>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-accent/30">
          <p className="text-xs text-slate-300 text-center">
            &copy; {new Date().getFullYear()} IC-FOODS. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
