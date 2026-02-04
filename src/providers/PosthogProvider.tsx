// 'use client'

// import posthog from 'posthog-js'

// export default function CheckoutPage() {
//     function handlePurchase() {
//         posthog.capture('purchase_completed', { amount: 99 })
//     }

//     return <button onClick={handlePurchase}>Complete purchase</button>
// }

// src/components/PostHogProvider.tsx
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
  })
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}