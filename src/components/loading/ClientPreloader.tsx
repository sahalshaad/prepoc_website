'use client'

import dynamic from 'next/dynamic'

const Preloader = dynamic(() => import('@/components/loading/Preloader'), { ssr: false })

export default function ClientPreloader() {
  return <Preloader />
}
