"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingContact from "./FloatingContact";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";

export default function SiteChrome({ children }) {
  const pathname = usePathname();

  /* Detect admin routes */
  const isAdmin = pathname?.startsWith("/admin");

  /* On admin routes, render children only — no navbar, no footer */
  if (isAdmin) {
    return <>{children}</>;
  }

  /* On public routes, wrap with full site chrome */
  return (
    <>
      <Navbar />
      {children}
      <FloatingContact />
      <WishlistDrawer />
      <CartDrawer />
      <Footer />
    </>
  );
}