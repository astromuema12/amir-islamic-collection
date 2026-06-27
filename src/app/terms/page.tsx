import type { Metadata } from "next"
import Link from "next/link"
import { Scale, AlertTriangle, FileText, UserCheck, Ban, Gavel } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Terms & Conditions - Amir Islamic Collections",
  description:
    "Terms and conditions governing the use of Amir Islamic Collections marketplace. Read about your rights, obligations, and our commitment to ethical Islamic commerce.",
  openGraph: {
    title: "Terms & Conditions - Amir Islamic Collections",
    description: "The terms governing your use of our Islamic products marketplace.",
    url: `${APP_URL}/terms`,
  },
}

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: FileText,
    content: `By accessing or using the ${APP_NAME} website and marketplace services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform.

These terms constitute a legally binding agreement between you ("User," "Buyer," or "Seller") and ${APP_NAME} ("Company," "we," "our," or "us"). By creating an account, placing an order, or listing products for sale, you acknowledge that you have read, understood, and accepted these terms.

We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the platform after changes constitutes acceptance of the modified terms. We will notify registered users of material changes via email.`,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    icon: UserCheck,
    content: `To use our platform, you must:
• Be at least 18 years of age or have parental/guardian consent
• Have the legal capacity to enter into binding contracts
• Not be located in a jurisdiction where our services are prohibited
• Provide accurate, current, and complete registration information
• Not be a competitor using our platform for unauthorized commercial purposes

We reserve the right to refuse service, terminate accounts, remove content, or cancel orders at our sole discretion, particularly where we suspect a violation of these terms or applicable laws.

Sellers must additionally provide valid business documentation and identification for verification purposes.`,
  },
  {
    id: "account",
    title: "3. Account Registration and Security",
    icon: UserCheck,
    content: `When you create an account with us, you are responsible for:
• Maintaining the confidentiality of your login credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized use
• Ensuring that your account information remains accurate and up to date

You may not use another person's account without permission. We are not liable for any loss or damage arising from your failure to safeguard your account.

We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent, abusive, or illegal activities.

Account deletion requests can be submitted through our contact form and will be processed within 30 days.`,
  },
  {
    id: "products",
    title: "4. Products and Listings",
    icon: Scale,
    content: `All products listed on our marketplace must comply with Islamic principles (Halal). Prohibited items include:
• Alcohol, pork, and any non-Halal consumables
• Idolatrous or shirk-related items
• Obscene, immoral, or offensive materials
• Counterfeit or unauthorized goods
• Weapons, gambling tools, or any Haram items
• Living beings (pets, animals) for trade
• Any items prohibited by Kenyan law

Product listings must be accurate, truthful, and not misleading. Sellers are responsible for ensuring their products meet all applicable regulations and quality standards.

We reserve the right to remove any listing that violates our policies, Islamic principles, or applicable laws without prior notice.

Prices listed are in Kenyan Shilling (KES) unless otherwise specified and include applicable taxes where required by law.`,
  },
  {
    id: "orders",
    title: "5. Orders and Payment",
    icon: FileText,
    content: `By placing an order, you agree to:
• Provide accurate shipping and billing information
• Pay the total amount including product price, shipping, and applicable taxes
• Pay all applicable customs duties and import taxes for international orders
• Not engage in fraudulent purchasing activities

Order acceptance occurs when we send order confirmation. We reserve the right to cancel orders due to:
• Pricing errors
• Product unavailability
• Suspected fraud
• Violation of these terms
• Inability to verify payment

All payments are processed securely through Paystack. We accept major credit/debit cards, bank transfers, and USSD payments as enabled by our payment processor.

Orders are considered final once payment is confirmed. Cancellation requests before processing may be accommodated at our discretion.`,
  },
  {
    id: "shipping",
    title: "6. Shipping and Delivery",
    icon: Scale,
    content: `Shipping times are estimates and not guaranteed. We strive to process orders within 1-2 business days. Delivery times vary based on location and shipping method selected.

Risk of loss and title for purchased items pass to you upon delivery to the carrier. We are not responsible for delays caused by:
• Weather conditions
• Customs processing
• Carrier operational issues
• Incorrect shipping information provided by you

International shipments may be subject to customs fees, import duties, and taxes that are your responsibility. Please check with your local customs office before ordering.

We currently ship to addresses within Kenya and select international destinations. See our Shipping Policy for detailed information.`,
  },
  {
    id: "returns",
    title: "7. Returns and Refunds",
    icon: AlertTriangle,
    content: `Our return policy is designed to be fair and transparent, in keeping with Islamic principles of justice and consumer protection.

General return policy:
• Most items can be returned within 30 days of delivery
• Items must be unused, in original packaging, with all tags attached
• Custom and personalized items are non-returnable unless defective
• Digital products are non-returnable once downloaded
• Clearance and final sale items are non-returnable

Refunds are processed within 5-10 business days after we receive and inspect the returned item. Shipping costs are non-refundable unless the return is due to our error.

Defective or incorrect items are eligible for full refund including original shipping costs.

See our Refund Policy for detailed information including exceptions and procedures.`,
  },
  {
    id: "seller",
    title: "8. Seller Terms",
    icon: UserCheck,
    content: `Sellers on our platform agree to:
• List only Halal, legal, and authentic products
• Maintain accurate inventory levels
• Fulfill orders promptly within stated processing times
• Respond to customer inquiries within 24 hours
• Comply with all applicable laws and regulations
• Pay applicable platform fees and commissions
• Not engage in price fixing or anti-competitive practices
• Maintain quality standards and accurate product descriptions

Violation of seller terms may result in:
• Listing removal
• Account suspension
• Withholding of payments
• Permanent account termination
• Legal action where warranted

We reserve the right to modify commission rates and platform fees with 30 days' notice to sellers.

Sellers are independent contractors and not employees of ${APP_NAME}. Sellers are responsible for their own tax reporting and compliance.`,
  },
  {
    id: "prohibited",
    title: "9. Prohibited Activities",
    icon: Ban,
    content: `You agree not to engage in any of the following:
• Using the platform for any unlawful purpose or in violation of any applicable laws
• Attempting to interfere with the proper functioning of the platform
• Circumventing or manipulating our fee structures or billing processes
• Posting false, inaccurate, misleading, or deceptive content
• Harassing, abusing, or harming other users
• Impersonating any person or entity
• Using bots, scrapers, or automated tools without permission
• Engaging in any activity that violates Islamic ethical principles
• Attempting to transact outside our platform to avoid fees
• Infringing on intellectual property rights of others

We reserve the right to investigate and take appropriate legal action against anyone engaging in prohibited activities.`,
  },
  {
    id: "ip",
    title: "10. Intellectual Property",
    icon: Gavel,
    content: `All content on our platform including text, graphics, logos, images, software, and audio-visual materials is the property of ${APP_NAME} or our licensors and is protected by intellectual property laws.

You may not:
• Reproduce, distribute, or create derivative works without permission
• Use our trademarks, logos, or brand elements without authorization
• Remove any copyright or proprietary notices
• Use our content for commercial purposes without a license

Sellers retain ownership of their product images and descriptions but grant us a license to display them on our platform.

We respect the intellectual property rights of others. If you believe your intellectual property rights have been infringed, please contact us with detailed information and we will investigate promptly.

Copyright infringement claims should be sent to legal@amirislamic.com and will be processed in accordance with applicable laws.`,
  },
  {
    id: "limitation",
    title: "11. Limitation of Liability",
    icon: AlertTriangle,
    content: `To the maximum extent permitted by law, ${APP_NAME} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
• Your use or inability to use our platform
• Any products purchased through our marketplace
• Unauthorized access to your account
• Any content obtained from our platform
• Business interruption, loss of profits, or data loss

Our total liability for any claim arising from your use of our platform is limited to the amount you paid for the specific product or service giving rise to the claim.

This limitation applies regardless of the legal theory on which the claim is based. Some jurisdictions do not allow certain limitations of liability, so some of the above limitations may not apply to you.

Nothing in these terms limits our liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be excluded by law.`,
  },
  {
    id: "indemnification",
    title: "12. Indemnification",
    icon: Gavel,
    content: `You agree to indemnify, defend, and hold harmless ${APP_NAME}, its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
• Your use of the platform
• Your violation of these terms
• Your violation of any third-party rights
• Your content or product listings
• Any fraudulent or illegal activity on your part

We reserve the right to assume exclusive defense and control of any matter subject to indemnification, in which case you agree to cooperate with our defense.`,
  },
  {
    id: "termination",
    title: "13. Termination",
    icon: Ban,
    content: `We may terminate or suspend your account and access to our platform immediately, without prior notice or liability, if:
• You breach any provision of these terms
• We suspect fraudulent, abusive, or illegal activity
• Required by applicable law or regulatory authority
• We discontinue our services

Upon termination:
• Your right to use the platform ceases immediately
• Any pending orders may be cancelled
• Outstanding payments may be withheld pending investigation
• We may retain your data as required by law

You may terminate your account at any time by contacting customer support. Termination does not relieve you of obligations incurred before termination.

Sections of these terms that by their nature should survive termination shall survive, including but not limited to indemnification, limitation of liability, and intellectual property provisions.`,
  },
  {
    id: "governing",
    title: "14. Governing Law",
    icon: Gavel,
    content: `These terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its conflict of law provisions.

Any disputes arising from these terms or your use of our platform shall be resolved through the following process:
1. Good faith negotiation between the parties
2. Mediation through a mutually agreed mediator
3. Arbitration in Nairobi, Kenya in accordance with the Arbitration Act

Where Islamic principles (Shariah) provide guidance on a matter not explicitly covered by these terms or applicable law, we will endeavor to resolve the matter in a manner consistent with Islamic ethics and justice.

The United Nations Convention on Contracts for the International Sale of Goods (CISG) does not apply to these terms.

You agree that any cause of action arising from our services must be commenced within one year after the claim arose, or be permanently barred.`,
  },
  {
    id: "contact",
    title: "15. Contact Information",
    icon: FileText,
    content: `For questions, concerns, or inquiries regarding these Terms and Conditions, please contact us:

Email: legal@amirislamic.com
Phone: +234 800 AMIR ISLAM
Address: Kimathi Street, Nairobi, Kenya

We strive to respond to all inquiries within 48 business hours.

These terms were last updated on January 1, 2026. They supersede all previous versions and agreements relating to the use of our platform.

JazakAllah khair for choosing ${APP_NAME}. We pray that our marketplace brings barakah to your shopping experience.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Terms & Conditions" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Scale className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground mt-1">
                Last updated: January 1, 2026
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Please read these terms carefully before using our marketplace. By
            using{APP_NAME}, you agree to be bound by these terms, which are
            designed to ensure a fair, transparent, and ethical shopping
            experience for everyone.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <nav className="lg:col-span-1">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Sections
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5"
                >
                  <section.icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{section.title}</span>
                </a>
              ))}
            </div>
          </nav>

          <div className="lg:col-span-3 space-y-12">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
                {index < sections.length - 1 && <Separator className="mt-8" />}
              </section>
            ))}

            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-premium/5 border p-6 sm:p-8 mt-12">
              <div className="flex items-start gap-4">
                <Gavel className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Have Questions About Our Terms?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We are happy to clarify any part of these terms. Contact our
                    legal team for assistance.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Contact Legal Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
