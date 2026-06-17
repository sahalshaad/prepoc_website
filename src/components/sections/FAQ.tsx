import { prisma } from '@/lib/prisma'
import FAQClient from './FAQClient'

export default async function FAQ() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { id: true, question: true, answer: true },
  })

  return <FAQClient faqs={faqs} />
}
