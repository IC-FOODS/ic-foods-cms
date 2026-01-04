import Link from "next/link";
import Image from "next/image";
import { Nav } from "./Nav";
import { Container } from "../ui/Container";
import { cn } from "@/lib/utils/cn";

export function Header() {
  return (
    <header
      className={cn("sticky top-0 z-40 bg-surface border-b border-primary/10")}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded focus:shadow-lg"
      >
        Skip to content
      </a>
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
          >
            <Image
              src="/ic-foods-website/logo.png" 
              alt=""
              width={70}
              height={70}
              className="h-10 w-10 flex-shrink-0"
              priority
            />
            <span className="text-xl font-bold">
              <span className="text-primary">IC-</span>
              <span className="text-accent">FOODS</span>
            </span>
          </Link>
          <Nav />
        </div>
      </Container>
      <div className="h-0.5 bg-accent/20"></div>
    </header>
  );
}
