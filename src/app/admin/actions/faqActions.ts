'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin/auth'

export async function createFaqAction(data: { question: string; answer: string; order?: number }) {
  try {
    await requireAdmin()
    const faq = await prisma.faq.create({
      data: {
        question: data.question.trim(),
        answer: data.answer.trim(),
        order: data.order ?? 0,
        isActive: true,
      },
    })
    revalidatePath('/admin/faq')
    revalidatePath('/')
    return { success: true, faq }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create FAQ' }
  }
}

export async function updateFaqAction(
  id: string,
  data: { question?: string; answer?: string; order?: number; isActive?: boolean }
) {
  try {
    await requireAdmin()
    const faq = await prisma.faq.update({
      where: { id },
      data: {
        ...(data.question !== undefined && { question: data.question.trim() }),
        ...(data.answer !== undefined && { answer: data.answer.trim() }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })
    revalidatePath('/admin/faq')
    revalidatePath('/')
    return { success: true, faq }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update FAQ' }
  }
}

export async function deleteFaqAction(id: string) {
  try {
    await requireAdmin()
    await prisma.faq.delete({ where: { id } })
    revalidatePath('/admin/faq')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete FAQ' }
  }
}

export async function reorderFaqAction(items: { id: string; order: number }[]) {
  try {
    await requireAdmin()
    await Promise.all(
      items.map((item) =>
        prisma.faq.update({ where: { id: item.id }, data: { order: item.order } })
      )
    )
    revalidatePath('/admin/faq')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reorder FAQs' }
  }
}
