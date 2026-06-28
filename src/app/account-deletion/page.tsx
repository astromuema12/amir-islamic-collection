import type { Metadata } from "next"
import Link from "next/link"
import {
  Trash2,
  Shield,
  AlertTriangle,
  FileText,
  Clock,
  UserX,
  Mail,
  Gavel,
  CheckCircle2,
} from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { APP_NAME, APP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Account Deletion Policy - Amir Islamic Collections",
  description:
    "Learn how to permanently delete your Amir Islamic Collections account. Understand what data is deleted, what is retained, and how the process works.",
  openGraph: {
    title: "Account Deletion Policy - Amir Islamic Collections",
    description:
      "Learn how to permanently delete your account and what happens to your data.",
    url: `${APP_URL}/account-deletion`,
  },
}

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: FileText,
    content: `This Account Deletion Policy explains how you can permanently delete your ${APP_NAME} account and what happens to your personal data after deletion.

We are committed to protecting your privacy and giving you control over your personal information. In keeping with Islamic principles of justice and transparency, we have designed this process to be straightforward while meeting our legal and regulatory obligations.

By requesting account deletion, you understand that this action is irreversible and that certain data may need to be retained as required by law.`,
  },
  {
    id: "what-happens",
    title: "2. What Happens When You Delete Your Account",
    icon: Trash2,
    content: `When you submit a deletion request, the following occurs:

• Your account is immediately deactivated and you are logged out
• All personal data associated with your account is scheduled for deletion
• You will no longer have access to your order history, wishlist, or saved addresses
• Your profile becomes inaccessible to other users of the platform
• Any active sessions are terminated immediately

The deletion process is designed to be complete, irreversible, and in compliance with applicable data protection laws including the Kenya Data Protection Act.`,
  },
  {
    id: "data-deleted",
    title: "3. Data That Is Permanently Deleted",
    icon: CheckCircle2,
    content: `The following personal data is permanently deleted from our systems upon account deletion:

• Profile information (name, email address, phone number, bio, profile image)
• Account credentials (password, authentication tokens)
• Saved addresses and shipping information
• Shopping cart contents and saved items
• Wishlist items and product preferences
• Product reviews and ratings
• Notification preferences and notification history
• Customer support correspondence
• Seller profile information (store name, description, bank details)
• Session tokens and remember-me cookies

This data is permanently erased and cannot be recovered under any circumstances.`,
  },
  {
    id: "data-retained",
    title: "4. Data That May Be Retained",
    icon: Shield,
    content: `In compliance with legal, regulatory, and business obligations, the following data may be retained after account deletion:

• Completed order records: Retained for 7 years as required by Kenyan tax and accounting regulations. These records include: order number, items purchased, price paid, date of transaction, and shipping details. Your personal name and email are removed from these records.
• Financial transaction logs: Retained for fraud prevention, auditing, and anti-money laundering compliance.
• Legal records: Any data required to be retained by applicable laws or pending legal proceedings.
• Aggregated analytics: Usage statistics that have been anonymized and aggregated for business analysis.

Retained data is securely stored with restricted access and is only used for the specific legal or business purposes outlined above. Your personal identifiers are anonymized to the extent possible.`,
  },
  {
    id: "how-to-delete",
    title: "5. How to Request Account Deletion",
    icon: UserX,
    content: `You can request account deletion directly from your account settings:

1. Log in to your ${APP_NAME} account
2. Navigate to Settings from your account menu
3. Scroll to the "Danger Zone" section
4. Click the "Delete Account" button
5. Read the information provided in the confirmation dialog
6. Confirm your decision by clicking "Yes, Delete My Account"

Alternatively, you can contact our support team at support@amirislamic.com to request deletion. For security purposes, we may need to verify your identity before processing manual deletion requests.`,
  },
  {
    id: "processing",
    title: "6. Processing Time",
    icon: Clock,
    content: `Account deletion requests are processed immediately upon confirmation. You will be logged out and your account will be deactivated right away.

While your data is removed from live systems instantly, residual copies may persist in our backup systems for up to 90 days. These backups are securely stored and are automatically overwritten as part of our regular backup rotation cycle.

You will receive an email confirmation once the deletion process is complete.`,
  },
  {
    id: "recovery",
    title: "7. Account Recovery",
    icon: AlertTriangle,
    content: `Account deletion is permanent and irreversible. Once your account has been deleted:

• You cannot log in or regain access to your account
• Your order history and personal data cannot be recovered
• Any pending orders, store credit, or loyalty points are forfeited
• You will need to create a new account if you wish to use ${APP_NAME} again

Please ensure that you have downloaded any important information, settled all pending orders, and withdrawn any available seller balances before proceeding with deletion.`,
  },
  {
    id: "sellers",
    title: "8. Special Considerations for Sellers",
    icon: Gavel,
    content: `If you are a registered seller on ${APP_NAME}, account deletion has additional implications:

• Active product listings will be removed from the marketplace
• Any pending payouts will be processed according to our standard payout schedule
• Completed transaction records will be retained for tax and accounting purposes
• Your store name and product history may remain visible in anonymized form
• Outstanding disputes or refund requests must be resolved before deletion

Sellers who have pending orders, unresolved disputes, or outstanding balances may have their deletion request delayed until these matters are resolved.

We recommend contacting seller support before initiating deletion to ensure a smooth transition for your buyers and proper settlement of all accounts.`,
  },
  {
    id: "contact",
    title: "9. Contact Us",
    icon: Mail,
    content: `If you have questions about this policy or need assistance with account deletion, please contact us:

Email: support@amirislamic.com
Phone: +254 800 AMIR ISLAM
Address: Kimathi Street, Nairobi, Kenya

Our support team is available to assist you with any concerns about your data and privacy.

This policy was last updated on January 1, 2026. It supersedes all previous versions relating to account deletion and data retention.

JazakAllah khair for being a part of ${APP_NAME}.`,
  },
]

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Account Deletion Policy" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <Trash2 className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Account Deletion Policy
              </h1>
              <p className="text-muted-foreground mt-1">
                Last updated: January 1, 2026
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            We believe in giving you full control over your data. This policy
            explains how account deletion works, what data is removed, and what
            information may be retained for legal and business purposes.
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

            <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/5 to-premium/5 border p-6 sm:p-8 mt-12">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is here to assist you with any questions
                    about account deletion or data privacy.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Contact Support
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
