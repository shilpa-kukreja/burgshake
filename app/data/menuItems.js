export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "burgers", label: "Burgers" },
  { id: "shakes", label: "Shakes" },
  { id: "sides", label: "Sides" },
  { id: "beverages", label: "Beverages" },
];

export const MENU_ITEMS = [
  /* ── BURGERS ─────────────────────────────────── */
  {
    id: "bg-01",
    name: "The Classic Smash",
    desc: "Double smashed patty, cheddar, house sauce, brioche bun.",
    price: 249,
    mrp: 299,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    tag: "Bestseller",
    rating: 4.9,
    reviews: 218,
    dietary: ["spicy"],
    category: "burgers",
  },
  {
    id: "bg-02",
    name: "Peri Peri Chicken",
    desc: "Grilled chicken, peri mayo, jalapeños, red onion, lettuce.",
    price: 279,
    mrp: 329,
    img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Pick",
    rating: 4.9,
    reviews: 196,
    dietary: ["spicy", "gluten-free"],
    category: "burgers",
  },
 
  {
    id: "bg-04",
    name: "Crispy Veggie Delight",
    desc: "Crispy paneer patty, chipotle mayo, pickles, fresh greens.",
    price: 219,
    mrp: 269,
    img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80",
    tag: "New",
    rating: 4.7,
    reviews: 89,
    dietary: ["veg"],
    category: "burgers",
  },

  /* ── SHAKES ──────────────────────────────────── */
  {
    id: "sh-01",
    name: "Belgian Choco Shake",
    desc: "Thick Belgian chocolate, cold milk, soft-serve swirl on top.",
    price: 179,
    mrp: 219,
    img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    tag: "Trending",
    rating: 4.8,
    reviews: 152,
    dietary: ["veg"],
    category: "shakes",
  },
  {
    id: "sh-02",
    name: "Strawberry Cream Shake",
    desc: "Real strawberries, vanilla soft-serve, whipped cream top.",
    price: 169,
    mrp: 199,
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 118,
    dietary: ["veg"],
    category: "shakes",
  },
  {
    id: "sh-03",
    name: "Salted Caramel Shake",
    desc: "Caramel swirl, sea salt, cold milk, topped with cream.",
    price: 189,
    mrp: 229,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 132,
    dietary: ["veg"],
    category: "shakes",
  },

  /* ── SIDES ───────────────────────────────────── */
  {
    id: "sd-01",
    name: "Loaded Cheese Fries",
    desc: "Crispy fries, molten cheddar, herbs, house dip on the side.",
    price: 149,
    mrp: 189,
    img: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80",
    tag: "Popular",
    rating: 4.7,
    reviews: 134,
    dietary: ["veg"],
    category: "sides",
  },
  {
    id: "sd-02",
    name: "Peri Peri Wedges",
    desc: "Golden potato wedges tossed in our signature peri spice.",
    price: 129,
    mrp: 159,
    img: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 87,
    dietary: ["veg", "spicy"],
    category: "sides",
  },
  {
    id: "sd-03",
    name: "Onion Rings",
    desc: "Thick-cut rings, crispy golden batter, smoky mayo dip.",
    price: 139,
    mrp: 169,
    img: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 76,
    dietary: ["veg"],
    category: "sides",
  },

  /* ── BEVERAGES ───────────────────────────────── */
  {
    id: "bv-01",
    name: "Classic Cold Coffee",
    desc: "Chilled espresso, milk, ice — the way it should be.",
    price: 119,
    mrp: 149,
    img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 98,
    dietary: ["veg"],
    category: "beverages",
  },
  {
    id: "bv-02",
    name: "Fresh Lime Soda",
    desc: "Zesty lime, sparkling soda, hint of mint. Refreshing.",
    price: 89,
    mrp: 119,
    img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 64,
    dietary: ["veg", "gluten-free"],
    category: "beverages",
  },
  {
    id: "bv-03",
    name: "Iced Lemon Tea",
    desc: "Brewed black tea, fresh lemon, chilled over ice.",
    price: 99,
    mrp: 129,
    img: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 82,
    dietary: ["veg", "gluten-free"],
    category: "beverages",
  },
];

export const DIETARY_META = {
  veg: {
    label: "Veg",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  "gluten-free": {
    label: "GF",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  spicy: {
    label: "Spicy",
    color: "text-brand-700 bg-brand-50 border-brand-200",
  },
};

/* Shared add-to-cart function — used by all menu components */
export function addToCart(item, qty = 1) {
  try {
    const raw = localStorage.getItem("burgshake_cart");
    const cart = raw ? JSON.parse(raw) : [];
    const existing = cart.find((c) => c.id === item.id);

    if (existing) existing.qty += qty;
    else
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img,
        qty,
      });

    localStorage.setItem("burgshake_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart:updated"));
    return true;
  } catch (e) {
    console.error("Cart error:", e);
    return false;
  }
}