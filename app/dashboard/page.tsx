'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { EditorPanel } from '@/components/dashboard/editor-panel'
import { ReportPanel } from '@/components/dashboard/report-panel'
import { ContractSidebar } from '@/components/dashboard/contract-sidebar'

const DEFAULT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;

    function increment() public {
        count += 1;
    }

    function decrement() public {
        count -= 1;
    }
}`;

export default function DashboardPage() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [contractName, setContractName] = useState('Counter')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSelectContract = (selectedCode: string, name: string) => {
    setCode(selectedCode)
    setContractName(name)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const handleNewContract = () => {
    setCode(DEFAULT_CODE)
    setContractName('NewContract')
    setSidebarOpen(false)
  }

  const handleContractSaved = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header row with sidebar toggle */}
      <header className="flex h-16 items-center border-b px-4 bg-sidebar/50 backdrop-blur-sm shrink-0">
        <ContractSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onSelectContract={handleSelectContract}
          onNewContract={handleNewContract}
          refreshTrigger={refreshTrigger}
        />
        <div className="flex-1 ml-2">
          <Header />
        </div>
      </header>

      <main className={`flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="flex flex-col h-full min-h-0">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">Source Code</h2>
          <EditorPanel code={code} onChange={(val) => setCode(val || '')} />
        </div>
        <div className="flex flex-col h-full min-h-0">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">Pre-Flight Report</h2>
          <ReportPanel code={code} onContractSaved={handleContractSaved} />
        </div>
      </main>
    </div>
  )
}

