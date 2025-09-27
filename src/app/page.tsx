import { Suspense } from 'react'
import Dashboard from '@/components/Dashboard'
import { initDatabase } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Home() {
  await initDatabase()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  )
}
