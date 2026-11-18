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
  MapPin,
  Phone,
  Lock,
  BookOpen,
  Truck,
  Utensils,
  Gavel,
  Clock,
  Copyright,
  Wind,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service — Burgshake",
  description:
    "The rules for ordering from Burgshake — smash burgers, thick shakes and loaded fries from Kripa Ventures Pvt Ltd.",
};

/* ── Table of contents ──────────────────────────────── */
const SECTIONS = [
  { id: "acceptance", label: "Acceptance", icon: FileText },
  { id: "about", label: "About us", icon: Store },
  { id: "orders", label: "Orders & processing", icon: Package },
  { id: "service", label: "Dine-in, takeaway & delivery", icon: Truck },
  { id: "pricing", label: "Pricing & payment", icon: CreditCard },
  { id: "cancellations", label: "Cancellations & refunds", icon: RotateCcw },
  { id: "food-safety", label: "Food safety & allergens", icon: Utensils },
  { id: "conduct", label: "Acceptable use", icon: Shield },
  { id: "availability", label: "Website availability", icon: Clock },
  { id: "ip", label: "Intellectual property", icon: Copyright },
  { id: "liability", label: "Liability", icon: AlertCircle },
  { id: "force-majeure", label: "Force majeure", icon: Wind },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "grievances", label: "Grievances", icon: BookOpen },
  { id: "law", label: "Governing law", icon: Scale },
  { id: "amendments", label: "Amendments", icon: Gavel },
  { id: "severability", label: "Severability", icon: FileText },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function TermsPage() {
  const updated = "17 November 2026";

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
          Terms &amp;{" "}
          <span className="font-serif italic font-normal text-brand-500">
            Conditions.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-[1.7] text-neutral-600">
          These Terms &amp; Conditions govern your access to the BurgShake
          website and your orders placed through it or other authorised
          ordering channels. By using the site, you agree to them.
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
                <h2 className="mb-2">1. Acceptance of Terms</h2>
                <p>
                  These Terms &amp; Conditions (&ldquo;Terms&rdquo;) constitute
                  a legally binding agreement between you (&ldquo;Customer&rdquo;,
                  &ldquo;you&rdquo;, &ldquo;your&rdquo;) and{" "}
                  <strong>Kripa Ventures Pvt Ltd</strong>, a private limited
                  company incorporated under the laws of India, operating under
                  the brand name <strong>BurgShake</strong> (&ldquo;BurgShake&rdquo;,
                  &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
                </p>
                <p>
                  These Terms govern your access to and use of our website,{" "}
                  <strong>www.burgshake.com</strong>, and any orders placed
                  through our website or other authorised ordering channels.
                </p>
                <p>
                  By accessing our website, creating an account, placing an
                  order, or using our services, you acknowledge that you have
                  read and agreed to these Terms.
                </p>
                <p>
                  If you do not agree with these Terms, please refrain from
                  using our website or ordering services.
                </p>
              </section>

              <section id="about">
                <h2 className="mb-2">2. About BurgShake</h2>
                <p>
                  BurgShake is a food and beverage brand specialising in smash
                  burgers, thick shakes and loaded fries.
                </p>
                <p>Our first outlet is located at:</p>
                <div className="not-prose my-5 rounded-2xl border border-neutral-200/70 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <Store className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    <div>
                      <div className="text-[13.5px] font-bold text-neutral-900">
                        BurgShake — Spectrum Mall
                      </div>
                      <div className="mt-1 text-[13px] leading-[1.6] text-neutral-600">
                        AG-34, Spectrum Mall, Phase 2, Sector 75
                        <br />
                        Noida, Uttar Pradesh, India
                        <br />
                        Open daily · 11:00 AM – 11:00 PM
                      </div>
                    </div>
                  </div>
                </div>
                <p>BurgShake offers the following services, subject to availability:</p>
                <ul>
                  <li>Dine-in at the outlet.</li>
                  <li>Takeaway and self-pickup.</li>
                  <li>Home delivery within designated service areas.</li>
                </ul>
                <p>
                  Delivery availability, applicable charges and estimated
                  delivery times will be displayed during the ordering process.
                </p>
                <div className="not-prose my-5 rounded-2xl border border-neutral-200/70 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    <div className="text-[13px] leading-[1.7] text-neutral-600">
                      <div className="text-[13.5px] font-bold text-neutral-900">
                        Business details
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <div>
                          <span className="font-semibold text-neutral-800">
                            Legal Business Name:
                          </span>{" "}
                          Kripa Ventures Pvt Ltd
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-800">
                            CIN:
                          </span>{" "}
                          U56100UW2026PTC254861
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-800">
                            Registered Office:
                          </span>{" "}
                          A-201, 2nd Floor, Tower A, Aims Golf Avenue 1,
                          Sector 75, Noida
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-800">
                            GSTIN:
                          </span>{" "}
                          09AAMCK9863A1Z5
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-800">
                            FSSAI Licence Number:
                          </span>{" "}
                          [Insert applicable FSSAI licence number]
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="orders">
                <h2 className="mb-2">3. Orders and Order Processing</h2>

                <h3>3.1 Placing an Order</h3>
                <p>
                  Customers may place orders through our website as guests or
                  registered users.
                </p>
                <p>To place an order, customers may be required to provide:</p>
                <ul>
                  <li>Full name.</li>
                  <li>Valid Indian mobile number.</li>
                  <li>Valid email address.</li>
                  <li>Delivery address, where applicable.</li>
                  <li>
                    Any other information reasonably required to process the
                    order.
                  </li>
                </ul>
                <p>
                  Customers are responsible for ensuring that the information
                  provided is accurate and complete.
                </p>

                <h3>3.2 Order Confirmation</h3>
                <p>
                  An order will be considered confirmed once the customer
                  receives an order confirmation number or confirmation
                  notification through the website or other authorised ordering
                  channel.
                </p>
                <p>
                  For online payments, order confirmation will also be subject
                  to successful payment authorisation.
                </p>
                <p>
                  BurgShake reserves the right to contact customers to verify
                  order details where reasonably necessary.
                </p>

                <h3>3.3 Order Preparation Time</h3>
                <p>
                  Our food and beverages are generally prepared fresh upon
                  receipt of an order.
                </p>
                <p>
                  The estimated preparation time will be communicated during
                  the ordering process. Any displayed preparation or collection
                  time is an estimate and may vary depending on order volume,
                  ingredient availability and operational conditions.
                </p>

                <h3>3.4 Order Modifications</h3>
                <p>
                  Customers should contact BurgShake as soon as possible if
                  they wish to modify an order.
                </p>
                <p>
                  Changes to ingredients, quantities or special instructions
                  are subject to kitchen confirmation and may not be possible
                  once food preparation has commenced.
                </p>

                <h3>3.5 Product Availability</h3>
                <p>All menu items are subject to availability.</p>
                <p>
                  BurgShake reserves the right to temporarily modify, replace
                  or discontinue menu items, ingredients, portion sizes and
                  prices where necessary.
                </p>
                <p>
                  If an item becomes unavailable after an order has been
                  placed, we will inform the customer and offer an appropriate
                  alternative or refund for the unavailable item, as
                  applicable.
                </p>
              </section>

              <section id="service">
                <h2 className="mb-2">4. Dine-in, Takeaway and Delivery</h2>

                <h3>4.1 Dine-in</h3>
                <p>
                  Customers visiting our outlet may place orders for
                  consumption at the premises, subject to seating availability
                  and applicable outlet policies.
                </p>
                <p>
                  Customers are requested to behave respectfully towards
                  employees and other customers.
                </p>
                <p>
                  BurgShake reserves the right to refuse service where
                  necessary to maintain a safe and orderly environment,
                  subject to applicable law.
                </p>

                <h3>4.2 Takeaway and Self-Pickup</h3>
                <p>
                  Customers placing takeaway orders may collect their orders
                  directly from the BurgShake outlet at the confirmed
                  collection time.
                </p>
                <p>
                  Customers should provide their order number or other order
                  identification at the counter when collecting their food.
                </p>
                <p>
                  We request customers to collect their orders promptly after
                  receiving a ready-for-pickup notification.
                </p>
                <p>
                  Ready orders may be held for up to <strong>30 minutes</strong>{" "}
                  after the scheduled collection time, subject to food safety
                  and quality considerations.
                </p>
                <p>
                  Where an order remains uncollected, BurgShake may treat it as
                  abandoned after reasonable efforts to contact the customer.
                  Refund eligibility will be assessed in accordance with our
                  cancellation and refund policy and applicable law.
                </p>

                <h3>4.3 Home Delivery</h3>
                <p>Delivery services are available only in designated service areas.</p>
                <p>
                  Delivery charges, minimum order requirements (if any),
                  estimated delivery times and other applicable conditions will
                  be communicated before order confirmation.
                </p>
                <p>
                  Customers are responsible for providing a complete and
                  accurate delivery address and ensuring that someone is
                  available to receive the order.
                </p>
                <p>
                  Delivery timelines are estimates and may be affected by
                  traffic, weather, high order volumes or other circumstances
                  beyond our reasonable control.
                </p>
                <p>
                  Where delivery is fulfilled through a third-party delivery
                  partner, the relevant partner&rsquo;s operational terms may
                  also apply.
                </p>
                <p>
                  BurgShake will remain responsible for addressing applicable
                  customer complaints relating to orders placed through its
                  authorised ordering channels.
                </p>
              </section>

              <section id="pricing">
                <h2 className="mb-2">5. Pricing, Taxes and Payments</h2>

                <h3>5.1 Prices and Taxes</h3>
                <p>All prices displayed on our website are in Indian Rupees (₹).</p>
                <p>
                  Applicable taxes and charges will be displayed separately or
                  included in the displayed price, as applicable.
                </p>
                <p>
                  The final payable amount, including applicable taxes, delivery
                  charges and other disclosed fees, will be shown before the
                  customer confirms the order.
                </p>
                <p>
                  Prices are subject to change without prior notice. However,
                  the price applicable to a confirmed order will remain the
                  price communicated at the time of order confirmation, except
                  where correction is required by applicable law.
                </p>

                <h3>5.2 Payment Methods</h3>
                <p>
                  BurgShake accepts the following payment methods, subject to
                  availability:
                </p>
                <p>
                  <strong>Online Payments:</strong>
                </p>
                <ul>
                  <li>UPI.</li>
                  <li>Credit and debit cards.</li>
                  <li>Net banking.</li>
                  <li>Supported digital wallets.</li>
                </ul>
                <p>
                  Online payments are processed through authorised payment
                  gateway providers.
                </p>
                <p>
                  <strong>Counter Payments:</strong>
                </p>
                <ul>
                  <li>Cash.</li>
                  <li>Credit and debit cards.</li>
                  <li>UPI and other supported payment methods.</li>
                </ul>
                <p>
                  The available payment options will be displayed during
                  checkout or communicated at the outlet.
                </p>

                <h3>5.3 Razorpay and Payment Gateways</h3>
                <p>
                  Online payments may be processed through{" "}
                  <strong>Razorpay Software Private Limited</strong> or other
                  authorised payment service providers.
                </p>
                <p>
                  Such payment providers process transactions in accordance
                  with their applicable terms, conditions and security
                  standards.
                </p>
                <p>
                  BurgShake does not store complete credit or debit card
                  details on its own servers.
                </p>
                <p>
                  Customers may also be subject to the terms and conditions of
                  the relevant payment service provider.
                </p>

                <h3>5.4 Failed Payments</h3>
                <p>
                  If a payment fails but the amount is debited from the
                  customer&rsquo;s bank account, the transaction reversal or
                  refund will be handled through the relevant payment gateway
                  and banking system.
                </p>
                <p>
                  Reversal timelines depend on the payment provider and the
                  customer&rsquo;s bank.
                </p>
                <p>
                  Customers may contact BurgShake with their transaction
                  reference and order details if the amount is not reversed
                  within the expected timeframe.
                </p>

                <h3>5.5 Coupons, Discounts and Promotional Offers</h3>
                <p>
                  Promotional offers, discount codes and coupons are subject to
                  their respective eligibility conditions, validity periods,
                  minimum order values and usage restrictions.
                </p>
                <p>Unless expressly stated otherwise:</p>
                <ul>
                  <li>Coupons cannot be combined with other promotional offers.</li>
                  <li>Offers cannot be exchanged for cash.</li>
                  <li>Expired coupons cannot be redeemed.</li>
                  <li>Each coupon may be subject to usage limits.</li>
                </ul>
                <p>
                  BurgShake reserves the right to withdraw or modify promotional
                  offers in accordance with applicable law.
                </p>
              </section>

              <section id="cancellations">
                <h2 className="mb-2">6. Cancellations and Refunds</h2>

                <h3>6.1 Customer-Initiated Cancellations</h3>
                <p>
                  Customers may request cancellation before the kitchen begins
                  preparing the order.
                </p>
                <p>
                  Once food preparation has commenced, cancellation may not be
                  possible because ingredients and preparation resources may
                  already have been utilised.
                </p>
                <p>
                  Customers should contact BurgShake immediately through the
                  available customer support channels to request cancellation.
                </p>
                <p>
                  Cancellation requests will be assessed based on the
                  preparation status of the order.
                </p>

                <h3>6.2 Refunds for Online Payments</h3>
                <p>
                  Where an order is successfully cancelled before preparation
                  begins, any eligible refund will be initiated to the original
                  payment method.
                </p>
                <p>
                  Refunds are generally processed within{" "}
                  <strong>5–7 working days</strong> after initiation, subject to
                  the payment gateway and banking system.
                </p>
                <p>
                  Actual credit timelines may vary depending on the
                  customer&rsquo;s bank or payment provider.
                </p>

                <h3>6.3 Counter Payment Orders</h3>
                <p>
                  For orders placed using pay-at-counter options, no refund will
                  be applicable where payment has not yet been collected.
                </p>
                <p>
                  Where payment has already been collected, eligible refunds
                  will be processed through an appropriate refund method.
                </p>

                <h3>6.4 Incorrect, Missing or Defective Orders</h3>
                <p>
                  If a customer receives an incorrect, missing, damaged or
                  otherwise defective item, they should notify BurgShake within{" "}
                  <strong>30 minutes</strong> of collection or delivery.
                </p>
                <p>
                  Customers may be requested to provide the order number,
                  photographs or other reasonable details to help verify the
                  complaint.
                </p>
                <p>
                  Following verification, BurgShake will provide an appropriate
                  resolution, which may include:
                </p>
                <ul>
                  <li>Replacement of the affected item.</li>
                  <li>Correction of the order.</li>
                  <li>Refund of the affected item.</li>
                  <li>Another mutually agreed resolution, as applicable.</li>
                </ul>
                <p>
                  Nothing in this section limits any consumer rights available
                  under applicable law.
                </p>

                <h3>6.5 Orders Cancelled by BurgShake</h3>
                <p>
                  BurgShake reserves the right to cancel an order in
                  circumstances including:
                </p>
                <ul>
                  <li>Unavailability of ordered ingredients or products.</li>
                  <li>Technical or pricing errors.</li>
                  <li>Payment processing issues.</li>
                  <li>Suspected fraudulent transactions.</li>
                  <li>Operational or safety-related reasons.</li>
                </ul>
                <p>
                  Where BurgShake cancels a prepaid order, the amount paid for
                  the cancelled order will be refunded in full.
                </p>
              </section>

              <section id="food-safety">
                <h2 className="mb-2">7. Food Safety, Allergens and Product Information</h2>

                <h3>7.1 Food Preparation</h3>
                <p>
                  BurgShake aims to prepare food and beverages using appropriate
                  food safety and hygiene practices.
                </p>
                <p>
                  All products are prepared based on the ingredients, recipes
                  and preparation methods applicable to the selected menu item.
                </p>
                <p>
                  Customers are encouraged to consume takeaway food promptly
                  after collection or delivery to maintain product quality and
                  freshness.
                </p>

                <h3>7.2 Allergens</h3>
                <p>
                  Our kitchen may handle ingredients containing or associated
                  with allergens, including:
                </p>
                <ul>
                  <li>Gluten and cereals containing gluten.</li>
                  <li>Dairy and milk products.</li>
                  <li>Peanuts and tree nuts.</li>
                  <li>Soy.</li>
                  <li>Eggs.</li>
                  <li>Sesame.</li>
                  <li>Other allergens depending on menu ingredients.</li>
                </ul>
                <p>
                  Although reasonable precautions are taken, cross-contact may
                  occur during food preparation, storage or handling.
                </p>
                <p>
                  <strong>
                    We cannot guarantee that any menu item is completely free
                    from allergens.
                  </strong>
                </p>
                <p>
                  Customers with food allergies or dietary restrictions should
                  contact us before placing an order and confirm whether a
                  particular product is suitable for them.
                </p>

                <h3>7.3 Product Images and Descriptions</h3>
                <p>
                  Photographs and illustrations displayed on our website, menu,
                  advertisements and promotional materials are for
                  representation purposes.
                </p>
                <p>
                  Actual product presentation, colours, toppings and appearance
                  may vary slightly depending on preparation and ingredient
                  availability.
                </p>
                <p>
                  Such variations will not intentionally alter the essential
                  characteristics of the product ordered.
                </p>
              </section>

              <section id="conduct">
                <h2 className="mb-2">8. Customer Responsibilities and Acceptable Use</h2>
                <p>
                  By using our website and services, customers agree not to:
                </p>
                <ul>
                  <li>Place fraudulent or misleading orders.</li>
                  <li>
                    Use stolen payment methods or unauthorised payment
                    credentials.
                  </li>
                  <li>
                    Attempt to access, interfere with or compromise website
                    security.
                  </li>
                  <li>
                    Scrape, reproduce or commercially reuse BurgShake&rsquo;s
                    website content, menu data, photographs or branding without
                    permission.
                  </li>
                  <li>
                    Submit abusive, threatening or misleading communications.
                  </li>
                  <li>
                    Misuse customer accounts, OTP systems or ordering
                    facilities.
                  </li>
                  <li>
                    Engage in activities that disrupt the website or ordering
                    services.
                  </li>
                </ul>
                <p>
                  BurgShake reserves the right to suspend or restrict access to
                  its website or services where there is reasonable evidence of
                  fraudulent, abusive or unlawful activity, subject to
                  applicable law.
                </p>
              </section>

              <section id="availability">
                <h2 className="mb-2">9. Website Availability and Technical Issues</h2>
                <p>
                  BurgShake makes reasonable efforts to ensure that its website
                  and online ordering facilities remain accessible.
                </p>
                <p>However, uninterrupted availability cannot be guaranteed.</p>
                <p>
                  The website may occasionally be unavailable due to
                  maintenance, technical issues, internet connectivity problems,
                  payment gateway interruptions or other circumstances beyond
                  our reasonable control.
                </p>
                <p>
                  BurgShake shall not be responsible for temporary service
                  interruptions, subject to applicable consumer protection laws.
                </p>
              </section>

              <section id="ip">
                <h2 className="mb-2">10. Intellectual Property</h2>
                <p>
                  All intellectual property associated with BurgShake, including
                  its brand name, logo, trademarks, graphics, website content,
                  photographs, menu descriptions, packaging designs and
                  promotional materials, belongs to or is lawfully licensed to
                  the relevant rights holder.
                </p>
                <p>
                  No person may reproduce, distribute, modify, commercially
                  exploit or otherwise use such material without prior written
                  permission, except as permitted by law.
                </p>
              </section>

              <section id="liability">
                <h2 className="mb-2">11. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted under applicable Indian law,
                  BurgShake shall not be liable for indirect or consequential
                  losses arising from the use of its website or ordering
                  services.
                </p>
                <p>Nothing in these Terms shall:</p>
                <ul>
                  <li>Exclude or restrict any statutory consumer rights.</li>
                  <li>
                    Exclude liability where such exclusion is prohibited by
                    law.
                  </li>
                  <li>
                    Restrict any remedies available under the Consumer
                    Protection Act, 2019 or other applicable legislation.
                  </li>
                  <li>
                    Exclude liability for matters that cannot legally be
                    excluded or restricted.
                  </li>
                </ul>
                <p>
                  Any limitation of liability shall operate only to the extent
                  permitted under applicable law.
                </p>
              </section>

              <section id="force-majeure">
                <h2 className="mb-2">12. Force Majeure</h2>
                <p>
                  BurgShake shall not be responsible for delays or failure to
                  perform its obligations where such failure results from
                  circumstances beyond its reasonable control.
                </p>
                <p>
                  Such circumstances may include natural disasters, severe
                  weather, fire, government restrictions, public emergencies,
                  civil disturbances, utility failures, transport disruptions or
                  other unforeseen events.
                </p>
                <p>
                  Where an order cannot be fulfilled due to such circumstances,
                  BurgShake will communicate with the customer and provide an
                  appropriate resolution, including a refund where applicable.
                </p>
              </section>

              <section id="privacy">
                <h2 className="mb-2">13. Privacy and Personal Information</h2>
                <p>
                  BurgShake may collect and process personal information such as
                  customer names, mobile numbers, email addresses, delivery
                  addresses and order details for purposes including:
                </p>
                <ul>
                  <li>Processing and fulfilling orders.</li>
                  <li>Payment confirmation and transaction management.</li>
                  <li>Customer support and complaint resolution.</li>
                  <li>Providing order updates and notifications.</li>
                  <li>Improving our products and services.</li>
                  <li>Complying with applicable legal obligations.</li>
                </ul>
                <p>
                  Personal information will be handled in accordance with our
                  separate Privacy Policy and applicable Indian data protection
                  laws.
                </p>
                <p>
                  Customers are encouraged to review our Privacy Policy
                  available at:{" "}
                  <strong>www.burgshake.com/privacy-policy</strong>.
                </p>
                <p className="not-prose mt-3 rounded-xl border border-dashed border-neutral-300 bg-white/60 px-4 py-3 text-[12.5px] italic leading-[1.6] text-neutral-400">
                  [Insert final Privacy Policy URL before publication.]
                </p>
              </section>

              <section id="grievances">
                <h2 className="mb-2">14. Customer Grievances and Complaint Resolution</h2>
                <p>
                  BurgShake is committed to addressing customer complaints
                  fairly and promptly.
                </p>
                <p>
                  Customers may contact us regarding orders, payments,
                  cancellations, refunds, food quality or other concerns using
                  the contact details provided below.
                </p>
                <p>
                  Customer Support Number:{" "}
                  <strong>+91 9318483764</strong>
                </p>
                <p>
                  Complaints will be acknowledged within{" "}
                  <strong>48 hours</strong> of receipt and addressed within{" "}
                  <strong>one month</strong>, in accordance with applicable
                  requirements.
                </p>
                <p>
                  Customers may also approach the appropriate consumer dispute
                  redressal authorities or other competent authorities under
                  applicable law.
                </p>
              </section>

              <section id="law">
                <h2 className="mb-2">15. Governing Law and Jurisdiction</h2>
                <p>
                  These Terms shall be governed by and interpreted in accordance
                  with the laws of India.
                </p>
                <p>
                  Subject to applicable consumer protection legislation and the
                  jurisdiction of competent statutory authorities and consumer
                  commissions, courts having competent territorial jurisdiction
                  over <strong>Gautam Buddha Nagar, Uttar Pradesh</strong>, shall
                  have jurisdiction over disputes arising from these Terms.
                </p>
                <p>
                  Nothing in this section restricts a consumer&rsquo;s right to
                  seek remedies before any consumer commission or other forum
                  having jurisdiction under applicable law.
                </p>
              </section>

              <section id="amendments">
                <h2 className="mb-2">16. Amendments to These Terms</h2>
                <p>
                  BurgShake reserves the right to update or modify these Terms
                  from time to time to reflect changes in business operations,
                  website functionality, applicable laws or regulatory
                  requirements.
                </p>
                <p>
                  Updated Terms will be published on our website with the
                  revised &ldquo;Last Updated&rdquo; date.
                </p>
                <p>Customers are encouraged to review these Terms periodically.</p>
                <p>
                  Changes will not retrospectively affect rights or obligations
                  relating to completed orders, except where required by
                  applicable law.
                </p>
              </section>

              <section id="severability">
                <h2 className="mb-2">17. Severability</h2>
                <p>
                  If any provision of these Terms is determined to be invalid,
                  unlawful or unenforceable, the remaining provisions shall
                  continue to remain valid and enforceable to the extent
                  permitted by law.
                </p>
              </section>

              <section id="contact">
                <h2 className="mb-2">18. Contact Information</h2>
                <p>
                  For any questions, complaints or assistance relating to these
                  Terms or BurgShake&rsquo;s services, please contact:
                </p>

                <div className="not-prose my-5 rounded-2xl border border-neutral-200/70 bg-white p-5">
                  <div className="text-[13.5px] font-bold text-neutral-900">
                    BurgShake
                  </div>
                  <div className="mt-1 text-[13px] leading-[1.7] text-neutral-600">
                    <div>
                      <span className="font-semibold text-neutral-800">
                        Legal Entity:
                      </span>{" "}
                      Kripa Ventures Pvt Ltd
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800">
                        Outlet Address:
                      </span>{" "}
                      AG-34, Spectrum Mall, Phase 2, Sector 75, Noida, Uttar
                      Pradesh, India
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800">
                        Customer Support:
                      </span>{" "}
                      +91 9318483764
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800">
                        Email:
                      </span>{" "}
                      info@kripa-ventures.com
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800">
                        Website:
                      </span>{" "}
                      www.burgshake.com
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800">
                        Grievance Officer:
                      </span>{" "}
                      [Insert appointed officer&rsquo;s name and designation]
                    </div>
                  </div>
                </div>

                <div className="not-prose my-5 grid gap-3 sm:grid-cols-2">
                  <a
                    href="mailto:info@kripa-ventures.com"
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
                        info@kripa-ventures.com
                      </div>
                    </div>
                  </a>
                  <a
                    href="tel:+919318483764"
                    className="group flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:border-brand-300 hover:bg-brand-50/50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        Phone
                      </div>
                      <div className="mt-0.5 text-[13px] font-semibold text-neutral-800">
                        +91 93184 83764
                      </div>
                    </div>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Spectrum+Mall+Sector+75+Noida"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:border-brand-300 hover:bg-brand-50/50 sm:col-span-2"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        Outlet
                      </div>
                      <div className="mt-0.5 truncate text-[13px] font-semibold text-neutral-800">
                        AG-34, Spectrum Mall, Phase 2, Sector 75, Noida
                      </div>
                    </div>
                  </a>
                </div>

                <p className="mt-6 border-t border-neutral-200/70 pt-5 text-[13px] italic leading-[1.7] text-neutral-500">
                  By accessing our website or placing an order, you acknowledge
                  that you have read and understood these Terms &amp;
                  Conditions.
                </p>
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