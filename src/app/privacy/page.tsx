import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, Eye, Database, Mail, Cookie, Globe } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Privacy Policy - Amir Islamic Collections",
  description:
    "Our commitment to protecting your privacy. Learn how Amir Islamic Collections collects, uses, and safeguards your personal information in accordance with Islamic principles.",
  openGraph: {
    title: "Privacy Policy - Amir Islamic Collections",
    description:
      "Learn how we collect, use, and protect your personal information in accordance with Islamic values and data protection regulations.",
    url: `${APP_URL}/privacy`,
  },
}

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: Shield,
    content: `At ${APP_NAME}, we are committed to protecting your privacy and handling your personal data with the utmost care and respect. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make purchases from our marketplace.

We operate in accordance with Islamic principles of trust (Amanah), transparency, and respect for individual privacy. Our data practices are designed to comply with the Kenya Data Protection Act and other applicable privacy laws, while remaining consistent with the ethical guidelines of Shariah.

By using our platform, you consent to the data practices described in this policy. If you do not agree with any part of this policy, please discontinue use of our services.`,
  },
  {
    id: "information-collection",
    title: "2. Information We Collect",
    icon: Database,
    content: `We collect information you provide directly to us, including:
• Account registration details (name, email address, phone number, shipping address)
• Payment information (processed securely through Paystack — we never store full card details)
• Profile information (preferences, wishlist items, order history)
• Communications you send to us (customer support inquiries, reviews, feedback)
• Seller information (bank details, business documents, identification for verification)

Information collected automatically:
• Device information (IP address, browser type, operating system)
• Usage data (pages visited, time spent, products viewed)
• Cookies and similar tracking technologies (see our Cookie Policy)
• Location data (general location based on IP address)`,
  },
  {
    id: "use-of-information",
    title: "3. How We Use Your Information",
    icon: Eye,
    content: `We use your information for the following purposes:
• To process and fulfill your orders, including payment processing and shipping
• To communicate with you about your orders, account, and our services
• To provide customer support and resolve disputes
• To personalize your shopping experience and recommend products
• To improve our website, products, and services
• To send marketing communications (with your consent, which you may withdraw at any time)
• To detect and prevent fraud, unauthorized transactions, and other liabilities
• To comply with legal obligations and regulatory requirements
• To facilitate transactions between buyers and sellers on our marketplace
• To calculate and remit applicable taxes

We process your data only for legitimate business purposes and never in ways that contradict Islamic ethical principles.`,
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing and Disclosure",
    icon: Lock,
    content: `We may share your information with:
• Service providers: Payment processors (Paystack), shipping companies, cloud hosting providers, and email service providers who need the information to perform their services
• Sellers: When you purchase from a seller on our marketplace, we share necessary order and shipping information to fulfill your order
• Legal authorities: When required by law, court order, or to protect our rights and the safety of our users
• Business transfers: In connection with a merger, acquisition, or sale of assets

We do not sell your personal information to third parties. All data sharing is done with appropriate safeguards and contractual obligations to protect your data.

Where possible, data shared with third parties is limited to the minimum necessary to accomplish the intended purpose.`,
  },
  {
    id: "data-security",
    title: "5. Data Security",
    icon: Lock,
    content: `We implement robust security measures to protect your personal information:
• SSL/TLS encryption for all data transmitted between your browser and our servers
• Encrypted storage of sensitive data at rest
• Regular security audits and vulnerability assessments
• Access controls and authentication requirements for our staff
• Secure payment processing through Paystack (PCI DSS compliant)
• Anonymization and pseudonymization where appropriate

While we strive to protect your data, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and keep your account credentials confidential.

In the event of a data breach that affects your personal information, we will notify you within 72 hours and take all necessary steps to mitigate the impact.`,
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    icon: Eye,
    content: `Under applicable data protection laws, you have the following rights:
• Right to access: Request a copy of the personal data we hold about you
• Right to rectification: Request correction of inaccurate or incomplete data
• Right to erasure: Request deletion of your personal data, subject to legal retention requirements
• Right to restrict processing: Request limitation of how we use your data
• Right to data portability: Receive your data in a structured, commonly used format
• Right to object: Object to processing of your data for marketing purposes
• Right to withdraw consent: Withdraw consent at any time where processing is based on consent

To exercise any of these rights, please contact us at privacy@amirislamic.com. We will respond to your request within 30 days.

We respect your autonomy over your personal data and will never penalize you for exercising your privacy rights.`,
  },
  {
    id: "cookies",
    title: "7. Cookies and Tracking",
    icon: Cookie,
    content: `We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors come from. Cookies are small text files stored on your device by your web browser.

Types of cookies we use:
• Essential cookies: Required for the website to function properly (cart, authentication)
• Analytics cookies: Help us understand how visitors interact with our website
• Preference cookies: Remember your settings and preferences
• Marketing cookies: Used to deliver relevant advertisements (with your consent)

You can control cookie preferences through your browser settings. Please see our Cookie Policy for detailed information.

We respect your choice and will only set non-essential cookies after obtaining your explicit consent.`,
  },
  {
    id: "retention",
    title: "8. Data Retention",
    icon: Database,
    content: `We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, and reporting requirements.

• Account data: Retained until you delete your account, plus 90 days for legal compliance
• Order data: Retained for 7 years as required by tax regulations
• Communications: Retained for 3 years from the date of last interaction
• Analytics data: Retained in aggregated form indefinitely

When data is no longer required, it is securely deleted or anonymized so that it can no longer be associated with you.

Islamic principles of justice and accountability guide our retention practices — we keep only what is necessary and dispose of the rest with care.`,
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    icon: Shield,
    content: `Our services are not directed to children under the age of 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete that information.

Parents or guardians who believe that a child has provided us with personal data should contact us immediately at privacy@amirislamic.com.

We encourage parents to monitor their children's online activities and to teach them about safe internet practices in accordance with Islamic values.`,
  },
  {
    id: "international",
    title: "10. International Data Transfers",
    icon: Globe,
    content: `Your information may be transferred to and processed in countries other than your own. We ensure that appropriate safeguards are in place for any international data transfers, including Standard Contractual Clauses or equivalent mechanisms.

Our servers are primarily located in Europe and Africa. When we engage service providers in other regions, we ensure they provide an equivalent level of data protection.

Data transfers are only made to countries that ensure adequate data protection standards as recognized by applicable regulations.`,
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    icon: Mail,
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational needs. We will notify you of material changes by:
• Posting the updated policy on this page with a revised "Last Updated" date
• Sending an email notification to registered users
• Displaying a notice on our website

We encourage you to review this policy periodically. Your continued use of our services after changes take effect constitutes your acceptance of the updated policy.

Significant changes will be communicated at least 30 days in advance to allow you to review and make informed decisions.`,
  },
  {
    id: "contact",
    title: "12. Contact Us",
    icon: Mail,
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:

Email: privacy@amirislamic.com
Phone: +234 800 AMIR ISLAM
Address: 42 Ahmadu Bello Way, Nairobi, Kenya

We are committed to resolving your concerns promptly and transparently. If you are not satisfied with our response, you have the right to lodge a complaint with the Office of the Data Protection Commissioner (ODPC) or your local data protection authority.

We take our responsibility to protect your data seriously as part of our broader commitment to conducting business with integrity, honesty, and in accordance with the teachings of Islam.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs
            items={[{ label: "Privacy Policy" }]}
            className="mb-6"
          />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mt-1">
                Last updated: January 1, 2026
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Your privacy matters to us. We handle your personal data with the
            care and respect it deserves, guided by Islamic principles of trust
            (Amanah) and transparency.
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
                {index < sections.length - 1 && (
                  <Separator className="mt-8" />
                )}
              </section>
            ))}

            <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/5 to-premium/5 border p-6 sm:p-8 mt-12">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Questions About Your Privacy?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our Data Protection Officer is here to help. We aim to
                    respond to all inquiries within 48 hours.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Contact Our Privacy Team
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
