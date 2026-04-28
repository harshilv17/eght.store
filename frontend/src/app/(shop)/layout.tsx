import { Navbar } from "@/components/layout/Navbar";
import { Marquee } from "@/components/layout/Marquee";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Marquee />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
