import { useState } from 'react'
import { DashboardShell } from './features/layout/DashboardShell'
import type { MobileTab } from './shared/types/navigation'

function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>('map')

  return (
    <DashboardShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}

export default App
