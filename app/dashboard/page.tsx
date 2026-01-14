'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { EditorPanel } from '@/components/dashboard/editor-panel'
import { ReportPanel } from '@/components/dashboard/report-panel'

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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <div className="flex flex-col h-full min-h-0">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">Source Code</h2>
          <EditorPanel code={code} onChange={(val) => setCode(val || '')} />
        </div>
        <div className="flex flex-col h-full min-h-0">
          <h2 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">Pre-Flight Report</h2>
          <ReportPanel code={code} />
        </div>
      </main>
    </div>
  )
}
