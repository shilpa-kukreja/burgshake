import { notFound } from "next/navigation";
import ProductDetail from "../../components/ProductDetail";
import ProductReviews from "../../components/ProductReviews";
import RelatedProducts from "../../components/RelatedProducts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ── Fetch one item + related from the public backend ─ */
async function getMenuItem(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/menu/${slug}`, {
      cache: "no-store",   // always fresh — inventory changes
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;      // { item, related }
  } catch {
    return null;
  }
}

/* Backend uses `slug`; some client components expect `id`.
   Adding it here keeps every existing component working unchanged. */
function normalize(item) {
  if (!item) return null;
  return { ...item, id: item.slug };
}

/* ── SEO metadata ───────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getMenuItem(slug);

  if (!data?.item) {
    return { title: "Not Found — Burgshake" };
  }

  return {
    title: `${data.item.name} — Burgshake`,
    description: data.item.desc,
  };
}

/* ── Page ───────────────────────────────────────────── */
export default async function ProductPage({ params }) {
  const { slug } = await params;
  const data = await getMenuItem(slug);

  if (!data?.item) notFound();

  const item = normalize(data.item);
  const relatedItems = (data.related || []).map(normalize);

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <ProductDetail item={item} />
      <ProductReviews item={item} />
      <RelatedProducts items={relatedItems} />
    </main>
  );
}