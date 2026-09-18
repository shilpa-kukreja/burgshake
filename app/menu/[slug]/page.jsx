import { notFound } from "next/navigation";
import { MENU_ITEMS } from "../../data/menuItems";
import ProductDetail from "../../components/ProductDetail";
import ProductReviews from "../../components/ProductReviews";
import RelatedProducts from "../../components/RelatedProducts";
import Footer from "../../components/Footer";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = MENU_ITEMS.find((i) => i.slug === slug);

  if (!item) {
    return { title: "Not Found — Burgshake" };
  }

  return {
    title: `${item.name} — Burgshake`,
    description: item.desc,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const item = MENU_ITEMS.find((i) => i.slug === slug);

  if (!item) notFound();

  /* Same-category related items, excluding current */
  const related = MENU_ITEMS.filter(
    (i) => i.category === item.category && i.id !== item.id
  ).slice(0, 4);

  /* Fallback: if fewer than 2 related, mix in other categories */
  const extras =
    related.length < 4
      ? MENU_ITEMS.filter(
          (i) => i.category !== item.category && i.id !== item.id
        ).slice(0, 4 - related.length)
      : [];

  const relatedItems = [...related, ...extras];

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <ProductDetail item={item} />
      <ProductReviews item={item} />
      <RelatedProducts items={relatedItems} />
     
    </main>
  );
}