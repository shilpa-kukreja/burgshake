import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  Store,
  CreditCard,
  Package,
  RotateCcw,
  Shield,
  Scale,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service — Burgshake",
  description:
    "The rules for ordering from Burgshake — a takeaway-only burger kitchen in Bandra West, Mumbai.",
};

/* ── Table of contents ──────────────────────────────── */
const SECTIONS = [
  { id: "acceptance", label: "Acceptance", icon: FileText },
  { id: "about", label: "About us", icon: Store },
  { id: "orders", label: "Orders & pickup", icon: Package },
  { id: "pricing", label: "Pricing & payment", icon: CreditCard },
  { id: "cancellations", label: "Cancellations", icon: RotateCcw },
  { id: "conduct", label: "Acceptable use", icon: Shield },
  { id: "liability", label: "Liability", icon: AlertCircle },
  { id: "law", label: "Governing law", icon: Scale },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function TermsPage() {
  const updated = "3 October 2026";

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-24 sm:pt-28 lg:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back home
        </Link>
      </div>

      {/* Header */}
      <header className="mx-auto mt-8 max-w-7xl px-6 lg:mt-10 lg:px-10">
        <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
          <span className="h-px w-8 bg-brand-500" />
          Legal
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-[2.4rem] lg:text-[2.7rem]">
          Terms of{" "}
          <span className="font-serif italic font-normal text-brand-500">
            Service.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-[1.7] text-neutral-600">
          These terms govern your use of the Burgshake website and your orders
          placed through it. By using the site, you agree to them.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Last updated · {updated}
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto mt-14 max-w-7xl px-6 pb-20 lg:mt-10 lg:px-10 lg:pb-15">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ToC sidebar */}
          <aside className="lg:col-span-3">
            <nav className="lg:sticky lg:top-28">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                On this page
              </div>
              <ul className="mt-4 space-y-1">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-[12.5px] font-medium text-neutral-600 transition-colors hover:bg-brand-50/60 hover:text-brand-700"
                    >
                      <Icon className="h-3.5 w-3.5 text-neutral-400 transition-colors group-hover:text-brand-500" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <article className="lg:col-span-9">
            <div className="prose prose-neutral max-w-none [&>section]:mt-5 [&>section:first-child]:mt-0 [&>section:not(:first-child)]:border-t [&>section:not(:first-child)]:border-neutral-200/70 [&>section:not(:first-child)]:pt-5 prose-headings:font-display prose-headings:font-bold prose-headings:tracking-[-0.01em] prose-headings:text-neutral-950 prose-h2:mb-5 prose-h2:mt-0 prose-h2:text-[1.5rem] prose-h2:scroll-mt-28 prose-h3:mb-2 prose-h3:mt-8 prose-h3:text-[1.15rem] prose-p:my-4 prose-p:text-[15.5px] prose-p:leading-[1.75] prose-p:text-neutral-700 prose-li:my-1.5 prose-li:text-[15.5px] prose-li:leading-[1.75] prose-li:text-neutral-700 prose-ul:my-4 prose-ol:my-4 prose-strong:font-bold prose-strong:text-neutral-900 prose-a:font-medium prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline">
              <section id="acceptance">
                <h2 className="mb-2">1. Acceptance of terms</h2>
                <p>
                  These Terms of Service (&ldquo;Terms&rdquo;) form a binding
                  agreement between you (&ldquo;you&rdquo;, &ldquo;your&rdquo;)
                  and Burgshake (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
                  &ldquo;our&rdquo;) for the use of <strong>burgshake.com</strong>{" "}
                  and any order you place through it.
                </p>
                <p>
                  By browsing the site, creating an account, or placing an
                  order, you confirm that you have read, understood, and agree
                  to these Terms. If you do not agree, please do not use the
                  site.
                </p>
              </section>

              <section id="about">
                <h2 className="mb-2">2. About us</h2>
                <p>
                  Burgshake operates a <strong>takeaway-only</strong> burger
                  kitchen located at:
                </p>
                <div className="not-prose my-5 rounded-2xl border border-neutral-200/70 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <Store className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    <div>
                      <div className="text-[13.5px] font-bold text-neutral-900">
                        Burgshake — Bandra West
                      </div>
                      <div className="mt-1 text-[13px] leading-[1.6] text-neutral-600">
                        12 Linking Road, Bandra West
                        <br />
                        Mumbai 400050, Maharashtra, India
                        <br />
                        Open daily · 11:00 AM – 11:00 PM
                      </div>
                    </div>
                  </div>
                </div>
                <p>
                  We do <strong>not offer home delivery</strong>. All orders
                  placed through the site are for in-person pickup at the
                  outlet above.
                </p>
              </section>

              <section id="orders">
                <h2 className="mb-2">3. Orders & pickup</h2>

                <h3>3.1 Placing an order</h3>
                <p>
                  You may place an order as a guest or as a signed-in user.
                  To place an order you must provide a valid name, a 10-digit
                  Indian mobile number, and a valid email address. We use
                  these to confirm your order and notify you when it is ready.
                </p>

                <h3>3.2 Pickup time slots</h3>
                <p>
                  Orders can be scheduled for pickup the same day or up to{" "}
                  <strong>7 days in advance</strong>. Same-day slots are
                  limited to times at least 15 minutes after you place the
                  order and before the kitchen closes at 10:30 PM.
                </p>

                <h3>3.3 Order confirmation</h3>
                <p>
                  Your order is only confirmed once you receive an order
                  number on the confirmation screen. Please show this order
                  number at the counter when collecting your food.
                </p>

                <h3>3.4 Late pickups</h3>
                <p>
                  Food quality declines quickly. We hold ready orders for{" "}
                  <strong>30 minutes</strong> past the scheduled pickup time.
                  After that, we may discard the order without a refund.
                  Please call us if you are running late.
                </p>
              </section>

              <section id="pricing">
                <h2 className="mb-2">4. Pricing & payment</h2>

                <h3>4.1 Prices and taxes</h3>
                <p>
                  All prices shown on the site are in Indian Rupees (₹) and
                  are exclusive of applicable taxes. A 5% GST is added at
                  checkout. Prices are subject to change without notice;
                  the price at the time of order confirmation is final.
                </p>

                <h3>4.2 Payment methods</h3>
                <p>
                  We offer two payment paths, based on your order total:
                </p>
                <ul>
                  <li>
                    <strong>Below ₹500</strong> — Pay at the counter (cash
                    or card) when you collect your order.
                  </li>
                  <li>
                    <strong>₹500 and above</strong> — Must be paid online
                    through Razorpay (UPI, credit/debit card, netbanking, or
                    wallets) before your order is confirmed.
                  </li>
                </ul>

                <h3>4.3 Razorpay</h3>
                <p>
                  Online payments are processed by{" "}
                  <strong>Razorpay Software Private Limited</strong>, a
                  PCI-DSS compliant payment gateway. We do not store your
                  card details on our servers. By paying online, you also
                  agree to Razorpay&rsquo;s terms of service.
                </p>

                <h3>4.4 Coupons</h3>
                <p>
                  Coupon codes are subject to their own conditions — minimum
                  order value, expiry date, and any usage caps. Coupons
                  cannot be combined with other offers unless stated. We
                  reserve the right to cancel orders that misuse a coupon.
                </p>

                <h3>4.5 Failed payments</h3>
                <p>
                  If a payment fails but the amount is debited from your
                  account, it is automatically reversed by Razorpay within{" "}
                  <strong>5–7 working days</strong> depending on your bank.
                  If it is not, contact us with your order number and we will
                  follow up.
                </p>
              </section>

              <section id="cancellations">
                <h2 className="mb-2">5. Cancellations & refunds</h2>

                <h3>5.1 Cancelling an order</h3>
                <p>
                  You may cancel an order from your account page{" "}
                  <strong>before the kitchen starts preparing it</strong>{" "}
                  (typically within 2–3 minutes of placing it). Once we begin
                  preparing food, cancellation is not possible because the
                  ingredients have been used.
                </p>

                <h3>5.2 Refunds</h3>
                <ul>
                  <li>
                    <strong>Orders paid online</strong> — Cancelled in time,
                    the refund is processed back to your original payment
                    method within 5–7 working days.
                  </li>
                  <li>
                    <strong>Pay-at-counter orders</strong> — No money has
                    changed hands, so there is nothing to refund.
                  </li>
                  <li>
                    <strong>Wrong or missing items</strong> — Let us know
                    within 30 minutes of pickup and we will remake the item or
                    refund it, at our discretion.
                  </li>
                </ul>

                <h3>5.3 Our right to cancel</h3>
                <p>
                  We may cancel an order if an item runs out of stock, if
                  there is a pricing error, or if we suspect fraud. In such
                  cases, online payments are refunded in full.
                </p>
              </section>

              <section id="conduct">
                <h2 className="mb-2">6. Acceptable use</h2>
                <p>When using the site, you agree not to:</p>
                <ul>
                  <li>
                    Place fraudulent orders or use stolen payment methods
                  </li>
                  <li>
                    Attempt to probe, scan, or breach the site&rsquo;s
                    security or authentication
                  </li>
                  <li>
                    Scrape, copy, or reuse our content, images, or menu data
                    for commercial purposes
                  </li>
                  <li>
                    Harass our staff, submit abusive content, or misuse the
                    contact form
                  </li>
                  <li>
                    Send automated OTP requests or otherwise abuse the login
                    and ordering systems
                  </li>
                </ul>
                <p>
                  We may suspend or terminate your account, and refuse future
                  service, if you violate these terms.
                </p>
              </section>

              <section id="liability">
                <h2 className="mb-2">7. Disclaimers & liability</h2>

                <h3>7.1 Food allergens</h3>
                <p>
                  Our kitchen handles gluten, dairy, eggs, nuts, and sesame.
                  While we take care,{" "}
                  <strong>
                    we cannot guarantee any dish is free from
                    cross-contamination.
                  </strong>{" "}
                  If you have a severe allergy, please inform us and consider
                  whether our menu is suitable for you.
                </p>

                <h3>7.2 Website availability</h3>
                <p>
                  We aim for the site to be available at all times, but we do
                  not guarantee uninterrupted access. We may suspend the site
                  briefly for maintenance without notice.
                </p>

                <h3>7.3 Limit of liability</h3>
                <p>
                  To the maximum extent permitted by law, Burgshake is not
                  liable for indirect, incidental, or consequential losses
                  arising from the use of the site or from any order. Our
                  total liability for any order is limited to the amount you
                  paid for that order.
                </p>
              </section>

              <section id="law">
                <h2 className="mb-2">8. Governing law</h2>
                <p>
                  These Terms are governed by the laws of India. Any dispute
                  arising from them or from your use of the site is subject
                  to the exclusive jurisdiction of the courts of{" "}
                  <strong>Mumbai, Maharashtra</strong>.
                </p>

                <h3>Changes to these terms</h3>
                <p>
                  We may update these Terms from time to time. The
                  &ldquo;Last updated&rdquo; date above reflects the latest
                  version. Continued use of the site after a change
                  constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section id="contact">
                <h2 className="mb-2">9. Contact</h2>
                <p>
                  Questions about these Terms or about an order? Reach us at:
                </p>
                <div className="not-prose my-5 grid gap-3 sm:grid-cols-2">
                  <a
                    href="mailto:hello@burgshake.com"
                    className="group flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:border-brand-300 hover:bg-brand-50/50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        Email
                      </div>
                      <div className="mt-0.5 truncate text-[13px] font-semibold text-neutral-800">
                        hello@burgshake.com
                      </div>
                    </div>
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="group flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:border-brand-300 hover:bg-brand-50/50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Store className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        Phone
                      </div>
                      <div className="mt-0.5 text-[13px] font-semibold text-neutral-800">
                        +91 98765 43210
                      </div>
                    </div>
                  </a>
                </div>
              </section>
            </div>

            {/* Cross-link */}
            <div className="mt-14 border-t border-neutral-200/70 pt-6">
              <p className="text-[13px] text-neutral-500">
                Also see our{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-brand-600 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-500"
                >
                  Privacy Policy
                </Link>{" "}
                to understand how we handle your data.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}