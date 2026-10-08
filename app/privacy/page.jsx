import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Target,
  Cookie,
  Share2,
  Lock,
  Clock,
  UserCheck,
  Baby,
  Mail,
  RefreshCw,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Burgshake",
  description:
    "How Burgshake collects, uses, and protects your personal information.",
};

const SECTIONS = [
  { id: "overview", label: "Overview", icon: RefreshCw },
  { id: "collect", label: "What we collect", icon: Database },
  { id: "use", label: "How we use it", icon: Target },
  { id: "cookies", label: "Cookies", icon: Cookie },
  { id: "sharing", label: "Who we share with", icon: Share2 },
  { id: "security", label: "Security", icon: Lock },
  { id: "retention", label: "Retention", icon: Clock },
  { id: "rights", label: "Your rights", icon: UserCheck },
  { id: "children", label: "Children", icon: Baby },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function PrivacyPage() {
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
          Privacy{" "}
          <span className="font-serif italic font-normal text-brand-500">
            Policy.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-[1.7] text-neutral-600">
          We collect only what we need to prepare and hand over your order.
          Here is exactly what we collect, why, and how you can control it.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Last updated · {updated}
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto mt-8 max-w-7xl px-6 pb-20 lg:mt-10 lg:px-10 lg:pb-15">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ToC */}
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
              <section id="overview">
                <h2 className="mb-2">1. Overview</h2>
                <p>
                  This Privacy Policy explains how Burgshake (&ldquo;we&rdquo;,{" "}
                  &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses, stores,
                  and protects your personal information when you use{" "}
                  <strong>burgshake.com</strong> or place an order with us.
                </p>
                <p>
                  We comply with India&rsquo;s{" "}
                  <strong>
                    Digital Personal Data Protection Act, 2023 (DPDP Act)
                  </strong>{" "}
                  and, where applicable, other data protection laws. By using
                  the site, you consent to the practices described here.
                </p>
              </section>

              <section id="collect">
                <h2 className="mb-2">2. What we collect</h2>
                <p>We collect only the information needed to serve you:</p>

                <h3>2.1 Information you give us</h3>
                <ul>
                  <li>
                    <strong>Name</strong> — to identify your order at pickup
                  </li>
                  <li>
                    <strong>Phone number</strong> — to sign you in via OTP,
                    confirm your order, and send ready-for-pickup messages
                  </li>
                  <li>
                    <strong>Email address</strong> — to send an order receipt
                    and follow up if we need to reach you
                  </li>
                  <li>
                    <strong>Order details</strong> — items, customizations,
                    pickup time, and special instructions
                  </li>
                  <li>
                    <strong>Contact form messages</strong> — if you write to
                    us through the contact page
                  </li>
                </ul>

                <h3>2.2 Information collected automatically</h3>
                <ul>
                  <li>
                    <strong>Device & browser info</strong> — user agent,
                    screen size, and referring URL, used for security and to
                    fix bugs
                  </li>
                  <li>
                    <strong>IP address</strong> — to prevent abuse of the OTP
                    and ordering systems
                  </li>
                  <li>
                    <strong>Cookies</strong> — small files that keep you
                    signed in and remember your cart (see Section 4)
                  </li>
                </ul>

                <h3>2.3 What we do NOT collect</h3>
                <ul>
                  <li>
                    <strong>Card or bank details</strong> — these are handled
                    entirely by Razorpay and never touch our servers
                  </li>
                  <li>
                    <strong>Aadhaar, PAN, or government IDs</strong> — we do
                    not ask for or accept these
                  </li>
                  <li>
                    <strong>Location data</strong> — we do not track your GPS
                    or device location
                  </li>
                </ul>
              </section>

              <section id="use">
                <h2 className="mb-2"> 3. How we use your information</h2>
                <p>Your information is used only for these purposes:</p>
                <ul>
                  <li>
                    <strong>To prepare and hand over your order</strong> —
                    matching your name and order number at the counter
                  </li>
                  <li>
                    <strong>To sign you in</strong> — sending an OTP to your
                    phone number
                  </li>
                  <li>
                    <strong>To notify you</strong> — SMS or email updates
                    about your order status
                  </li>
                  <li>
                    <strong>To process payments</strong> — sharing your
                    order total and contact info with Razorpay
                  </li>
                  <li>
                    <strong>To handle support</strong> — responding to a
                    contact form message or a question about an order
                  </li>
                  <li>
                    <strong>To comply with law</strong> — maintaining
                    invoices and records as required by Indian tax rules
                  </li>
                  <li>
                    <strong>To improve the site</strong> — aggregate,
                    anonymised statistics on what works and what doesn&rsquo;t
                  </li>
                </ul>
                <p>
                  We <strong>never sell your data</strong> and we do not use
                  it to build advertising profiles.
                </p>
              </section>

              <section id="cookies">
                <h2 className="mb-2">4. Cookies & local storage</h2>
                <p>
                  We use two types of client-side storage. Neither is used
                  for tracking or advertising:
                </p>

                <h3>4.1 Authentication cookie</h3>
                <p>
                  When you sign in, we set a secure, HTTP-only cookie called{" "}
                  <code>token</code> containing a signed session token. It
                  expires after <strong>30 days</strong> and is required to
                  keep you signed in.
                </p>

                <h3>4.2 Local storage</h3>
                <p>
                  We also store a few small values in your browser&rsquo;s
                  local storage:
                </p>
                <ul>
                  <li>
                    <code>burgshake_cart</code> — your cart items, so the
                    cart survives a refresh
                  </li>
                  <li>
                    <code>burgshake_wishlist</code> — items you saved for
                    later
                  </li>
                  <li>
                    <code>burgshake_token</code> — your session token, as a
                    fallback for the cookie
                  </li>
                  <li>
                    <code>burgshake_last_order</code> — your most recent
                    order details, used to prefill the checkout form
                  </li>
                </ul>
                <p>
                  You can clear these at any time from your browser settings.
                  Doing so will empty your cart and sign you out.
                </p>

                <h3>4.3 Analytics</h3>
                <p>
                  We may use privacy-respecting analytics to understand
                  aggregate traffic. These tools do not set cross-site
                  tracking cookies and do not identify you personally.
                </p>
              </section>

              <section id="sharing">
                <h2 className="mb-2">5. Who we share your information with</h2>
                <p>
                  We share your information only with the following
                  processors, and only as much as each one needs:
                </p>

                <div className="not-prose my-6 space-y-3">
                  {[
                    {
                      name: "Razorpay Software Private Limited",
                      purpose:
                        "Processes online payments when your order is ₹500 or above. Receives your name, email, phone, and order amount. Card details are entered directly with Razorpay and never stored by us.",
                    },
                    {
                      name: "Fast2SMS",
                      purpose:
                        "Delivers the SMS one-time passwords that sign you in. Receives only your phone number.",
                    },
                    {
                      name: "Email service provider",
                      purpose:
                        "Sends order confirmations and replies to contact-form messages. Receives your name, email, and order summary.",
                    },
                    {
                      name: "Cloud hosting provider",
                      purpose:
                        "Hosts our website and database. Your data is encrypted in transit and stored in a secure data centre.",
                    },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="rounded-2xl border border-neutral-200/70 bg-white p-5"
                    >
                      <div className="text-[13.5px] font-bold text-neutral-900">
                        {p.name}
                      </div>
                      <p className="mt-1.5 text-[13px] leading-[1.65] text-neutral-600">
                        {p.purpose}
                      </p>
                    </div>
                  ))}
                </div>

                <p>
                  We may also share information if{" "}
                  <strong>required by law</strong> — for example, in response
                  to a court order or a lawful request from a government
                  authority.
                </p>
              </section>

              <section id="security">
                <h2 className="mb-2">6. How we protect your data</h2>
                <ul>
                  <li>
                    All traffic is served over <strong>HTTPS</strong> with
                    modern TLS
                  </li>
                  <li>
                    Passwords (used only by administrators) are hashed with{" "}
                    <strong>bcrypt</strong> — never stored in plain text
                  </li>
                  <li>
                    Authentication uses short-lived JWTs and HTTP-only
                    cookies to reduce XSS risk
                  </li>
                  <li>
                    OTPs are valid for only <strong>5 minutes</strong> and
                    limited to <strong>5 wrong attempts</strong> per code
                  </li>
                  <li>
                    Access to production servers and databases is limited to
                    a small number of people and protected by 2FA
                  </li>
                </ul>
                <p>
                  No system is perfectly secure. If we ever discover a breach
                  affecting your data, we will notify you and the relevant
                  authorities as required by the DPDP Act.
                </p>
              </section>

              <section id="retention">
                <h2 className="mb-2">7. How long we keep your data</h2>
                <ul>
                  <li>
                    <strong>Order records</strong> — kept for{" "}
                    <strong>8 years</strong>, as required by Indian tax law.
                    These are the source of truth for invoices and audits.
                  </li>
                  <li>
                    <strong>Account information</strong> — kept as long as
                    your account is active, then deleted within 30 days of
                    your request.
                  </li>
                  <li>
                    <strong>OTP codes</strong> — automatically deleted after{" "}
                    <strong>5 minutes</strong>, whether used or not.
                  </li>
                  <li>
                    <strong>Contact form messages</strong> — kept for up to{" "}
                    <strong>2 years</strong> so we have context if you get in
                    touch again.
                  </li>
                  <li>
                    <strong>Server logs</strong> — kept for up to{" "}
                    <strong>90 days</strong> for security and debugging.
                  </li>
                </ul>
              </section>

              <section id="rights">
                <h2 className="mb-2">8. Your rights</h2>
                <p>
                  Under the DPDP Act, you have the right to:
                </p>
                <ul>
                  <li>
                    <strong>Access</strong> — request a copy of the personal
                    information we hold about you
                  </li>
                  <li>
                    <strong>Correct</strong> — ask us to fix any inaccurate
                    information
                  </li>
                  <li>
                    <strong>Erase</strong> — ask us to delete your account
                    and personal data (subject to tax-law retention rules for
                    order records)
                  </li>
                  <li>
                    <strong>Withdraw consent</strong> — opt out of marketing
                    emails at any time (transactional emails about an active
                    order cannot be opted out of while the order is being
                    processed)
                  </li>
                  <li>
                    <strong>Grievance redressal</strong> — raise a complaint
                    with our Data Protection Officer, and escalate to the
                    Data Protection Board of India if unresolved
                  </li>
                </ul>
                <p>
                  To exercise any of these, email{" "}
                  <a href="mailto:privacy@burgshake.com">
                    privacy@burgshake.com
                  </a>
                  . We will respond within <strong>30 days</strong>.
                </p>
              </section>

              <section id="children">
                <h2 className="mb-2">9. Children</h2>
                <p>
                  Our services are not intended for children under 18. We do
                  not knowingly collect personal information from minors. If
                  you believe a child has provided us with their data, please
                  contact us and we will delete it.
                </p>
              </section>

              <section id="contact">
                <h2 className="mb-2">10. Contact us</h2>
                <p>
                  For any privacy question, request, or complaint:
                </p>

                <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
                  <a
                    href="mailto:privacy@burgshake.com"
                    className="group flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:border-brand-300 hover:bg-brand-50/50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        Privacy requests
                      </div>
                      <div className="mt-0.5 truncate text-[13px] font-semibold text-neutral-800">
                        privacy@burgshake.com
                      </div>
                    </div>
                  </a>

                  <div className="rounded-2xl border border-neutral-200/70 bg-white p-4">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Data Protection Officer
                    </div>
                    <div className="mt-1.5 text-[13px] leading-[1.55] text-neutral-700">
                      Burgshake
                      <br />
                      12 Linking Road, Bandra West
                      <br />
                      Mumbai 400050, India
                    </div>
                  </div>
                </div>

                <h3>Changes to this policy</h3>
                <p>
                  If we make material changes to how we handle your data, we
                  will notify you by email (if you have an account) and update
                  the &ldquo;Last updated&rdquo; date at the top of this
                  page.
                </p>
              </section>
            </div>

            {/* Cross-link */}
            <div className="mt-14 border-t border-neutral-200/70 pt-6">
              <p className="text-[13px] text-neutral-500">
                Also see our{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-brand-600 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-500"
                >
                  Terms of Service
                </Link>{" "}
                for the rules around ordering and payments.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}