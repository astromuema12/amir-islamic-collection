"use client"

import { useState } from "react"
import type { Metadata } from "next"
import { ChevronDown, Search, HelpCircle, Package, CreditCard, Truck, RefreshCw, User, Shield, MessageCircle } from "lucide-react"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"

const faqCategories = [
  {
    id: "orders",
    label: "Orders",
    icon: Package,
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our catalog, add items to your cart, proceed to checkout, enter your shipping details, choose a payment method, and confirm your order. You will receive a confirmation email once your order is placed successfully.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 1 hour of placement, provided they have not yet been processed. Contact our customer support team immediately with your order number. Once an order enters processing, we cannot guarantee changes.",
      },
      {
        q: "How will I know if my order is confirmed?",
        a: "You will receive an order confirmation email and SMS (if provided) with your order number and details. You can also check your order status in your account dashboard under 'My Orders'.",
      },
      {
        q: "Is it safe to order from your marketplace?",
        a: "Absolutely. We use industry-standard SSL encryption to protect your data. All payments are processed securely through Paystack, a PCI DSS compliant payment processor. We never store your full card details on our servers.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "You can checkout as a guest without creating an account. However, creating an account allows you to track orders, save addresses, manage your wishlist, and access faster checkout on future purchases.",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards (Visa, Mastercard), bank transfers, and mobile money through our payment processor Paystack. We also accept Paystack payment links for larger transactions.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payment transactions are processed through Paystack, which is PCI DSS Level 1 compliant — the highest level of payment security. We do not store your full card number, CVV, or PIN on our systems.",
      },
      {
        q: "Do you offer payment plans or installment payments?",
        a: "We are working on offering BNPL (Buy Now, Pay Later) options. Currently, full payment is required at checkout. Contact us if you need special payment arrangements for bulk orders.",
      },
      {
        q: "What currency are prices listed in?",
        a: "All prices are listed in Kenyan Shilling (KES) by default. For international customers, your payment provider will convert the amount to your local currency at their exchange rate.",
      },
      {
        q: "Can I pay on delivery?",
        a: "We currently require payment upfront for all orders. This ensures smooth processing and allows us to offer competitive prices. We do not offer Cash on Delivery (COD) at this time.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Delivery",
    icon: Truck,
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5-7 business days within Kenya. Express shipping (2-3 days) and next-day delivery (Nairobi only) are available. International shipping takes 7-21 business days depending on destination.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to select countries worldwide including the UK, USA, Canada, UAE, Saudi Arabia, Malaysia, Indonesia, and most African nations. International shipping rates and times vary by destination.",
      },
      {
        q: "How much does shipping cost?",
        a: "Standard shipping within Kenya is KES 500. Express is KES 1,000, and next-day delivery is KES 1,500. Free standard shipping is available on orders over KES 5,000. International shipping costs are calculated at checkout.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you will receive a tracking number via email and SMS. You can track your order on our 'Track Order' page or through your account dashboard under 'My Orders'.",
      },
      {
        q: "What happens if I am not home for delivery?",
        a: "Our delivery partner will attempt delivery again or contact you to arrange a convenient time. After 3 failed delivery attempts, the package will be returned to our warehouse and we will contact you to arrange redelivery (additional shipping charges may apply).",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    icon: RefreshCw,
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return guarantee from the date of delivery. Items must be unused, in original condition, and with all tags attached. Some exclusions apply (see our Refund Policy for details).",
      },
      {
        q: "How do I initiate a return?",
        a: "Contact our customer support team through the Contact Us page or email support@amirislamic.com with your order number and reason for return. We will provide a return authorization and instructions within 24 hours.",
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed within 5-10 business days after we receive and inspect the returned item. The total time is typically 10-20 business days from initiating the return to receiving your refund.",
      },
      {
        q: "Who pays for return shipping?",
        a: "For change-of-mind returns, the customer is responsible for return shipping costs. For defective, damaged, or incorrect items, we provide a prepaid return shipping label and cover all costs.",
      },
      {
        q: "Can I exchange an item instead of returning it?",
        a: "Yes, exchanges are available for size, color, or product variants subject to availability. Follow the same return process and indicate your exchange preference. We will ship the replacement once the return is processed.",
      },
    ],
  },
  {
    id: "account",
    label: "Account & Registration",
    icon: User,
    questions: [
      {
        q: "How do I create an account?",
        a: "Click on the 'Sign Up' or 'Account' button in the header, fill in your name, email address, and create a password. You can also sign up using your Google account for convenience.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Click on 'Forgot Password' on the login page, enter your registered email address, and we will send you a password reset link. If you do not receive the email within 5 minutes, check your spam folder or contact support.",
      },
      {
        q: "How do I delete my account?",
        a: "Contact our customer support team to request account deletion. Your request will be processed within 30 days. Please note that order history and transaction records may be retained as required by law.",
      },
      {
        q: "Can I have multiple addresses saved?",
        a: "Yes, you can save multiple shipping addresses in your account. This is useful if you frequently ship to different locations (home, office, family members). You can select your preferred address at checkout.",
      },
    ],
  },
  {
    id: "security",
    label: "Privacy & Security",
    icon: Shield,
    questions: [
      {
        q: "How do you protect my personal information?",
        a: "We use SSL encryption, secure servers, and strict access controls to protect your data. We never share your personal information with third parties without your consent. See our Privacy Policy for detailed information.",
      },
      {
        q: "Do you share my information with third parties?",
        a: "We only share necessary information with trusted service providers (payment processors, shipping companies) to fulfill your orders. We do not sell your personal information to anyone.",
      },
      {
        q: "How do you use cookies on your website?",
        a: "We use essential cookies for site functionality and analytics cookies (with your consent) to improve your experience. You can manage cookie preferences through your browser settings. See our Cookie Policy for details.",
      },
    ],
  },
  {
    id: "selling",
    label: "Selling on Amir Islamic",
    icon: MessageCircle,
    questions: [
      {
        q: "How can I become a seller on your platform?",
        a: "Click on 'Sell with Us' in the header or footer, fill out the seller application form, and our team will review your application. You will need to provide business documentation and product information for verification.",
      },
      {
        q: "What are the seller fees and commissions?",
        a: "Our commission structure varies by product category. Typically, seller commissions range from 5-15% per sale. There are no monthly subscription fees for basic seller accounts. Contact our seller support team for detailed information.",
      },
      {
        q: "What products can I sell on the marketplace?",
        a: "All products must be Halal and comply with Islamic principles. We accept a wide range of categories including prayer mats, Qur'ans, Islamic clothing, perfumes, books, home decor, and more. Prohibited items include alcohol, pork, and any Haram products.",
      },
      {
        q: "How do I get paid as a seller?",
        a: "Seller payouts are processed weekly (every Friday) for orders that have been marked as delivered. Payments are made to your registered bank account through secure bank transfer. A minimum payout threshold of KES 1,500 applies.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openCategory, setOpenCategory] = useState<string | null>("orders")
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set())

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id)
    setOpenQuestions(new Set())
  }

  const toggleQuestion = (id: string) => {
    const newSet = new Set(openQuestions)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setOpenQuestions(newSet)
  }

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "FAQ" }]} className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <HelpCircle className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground mt-1">
                Find answers to common questions about shopping on {APP_NAME}
              </p>
            </div>
          </div>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-4 gap-8">
          <nav className="lg:col-span-1">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Categories
              </p>
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                    openCategory === cat.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <cat.icon className="h-4 w-4 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="lg:col-span-3 space-y-6">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords or browse the categories
                  above.
                </p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="rounded-2xl border">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "flex items-center justify-between w-full p-5 text-left transition-colors",
                      openCategory === category.id ? "border-b" : ""
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <category.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold">{category.label}</h2>
                        <p className="text-xs text-muted-foreground">
                          {category.questions.length} questions
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                        openCategory === category.id && "rotate-180"
                      )}
                    />
                  </button>
                  {openCategory === category.id && (
                    <div className="p-5 pt-0 space-y-3">
                      {category.questions.map((faq, index) => {
                        const questionId = `${category.id}-${index}`
                        return (
                          <div
                            key={questionId}
                            className="rounded-xl border overflow-hidden"
                          >
                            <button
                              onClick={() => toggleQuestion(questionId)}
                              className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/50 transition-colors"
                            >
                              <span className="text-sm font-medium pr-4">
                                {faq.q}
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                                  openQuestions.has(questionId) && "rotate-180"
                                )}
                              />
                            </button>
                            {openQuestions.has(questionId) && (
                              <div className="px-4 pb-4">
                                <Separator className="mb-3" />
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {faq.a}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))
            )}

            <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-primary/5 to-premium/5 border p-6 sm:p-8 mt-8">
              <div className="flex items-start gap-4">
                <MessageCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Still Have Questions?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you could not find the answer you are looking for, our
                    support team is happy to help. We typically respond within 24
                    hours.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
