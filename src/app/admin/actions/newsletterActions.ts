'use server'

import { newsletterService } from '@/services/newsletterService'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin/auth'

export async function createCampaignAction(subject: string, content: string) {
  try {
    await requireAdmin()
    const campaign = await newsletterService.createCampaign({ subject, content })
    revalidatePath('/admin/newsletter')
    return { success: true, campaign }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create campaign' }
  }
}

export async function sendCampaignAction(campaignId: string) {
  try {
    await requireAdmin()
    await newsletterService.sendCampaign(campaignId)
    revalidatePath('/admin/newsletter')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to send campaign' }
  }
}
