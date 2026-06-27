"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  HelpCircle,
  ArrowRight,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including bank transfers, debit/credit cards (Visa, Mastercard), PayPal, and mobile money. All transactions are secured with SSL encryption to ensure your payment information is safe.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times vary depending on your location. Standard shipping takes 5-7 business days within Kenya, while express shipping takes 2-3 business days. International shipping typically takes 7-14 business days depending on the destination.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be unused and in their original packaging. For defective or damaged items, we provide a full refund or replacement. Please contact our support team to initiate a return.",
  },
  {
    question: "Do you offer wholesale pricing?",
    answer:
      "Yes, we offer wholesale pricing for bulk orders. If you're interested in purchasing large quantities, please contact our sales team at wholesale@amirislamic.com for a custom quote. We offer tiered discounts based on order volume.",
  },
  {
    question: "Is free shipping available?",
    answer:
      "Yes, we offer free standard shipping on all orders over KES 5,000 within Kenya. This threshold applies to the subtotal after any discounts have been applied. Express shipping is available at an additional cost.",
  },
]

export function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4">
              <HelpCircle className="h-3.5 w-3.5" />
              Got Questions?
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight premium-heading mt-2">
              Frequently Asked Questions
            </h2>

            <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">
              Find answers to common questions about our products, shipping,
              returns, and more. Can&apos;t find what you&apos;re looking for?
              Our support team is here to help.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Still have questions?</p>
                  <p className="text-sm text-muted-foreground">
                    Our support team is available 24/7
                  </p>
                </div>
              </div>

              <Link href="/faq">
                <Button variant="outline" className="gap-2 rounded-xl">
                  View All FAQs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="font-medium text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
