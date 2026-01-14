'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PanelLeftClose, PanelLeft, FileCode2, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface Contract {
    _id: string
    name: string
    code: string
    deployedAddress?: string
    createdAt: string
}

interface ContractSidebarProps {
    isOpen: boolean
    onToggle: () => void
    onSelectContract: (code: string, name: string) => void
    onNewContract: () => void
    refreshTrigger?: number
}

export function ContractSidebar({
    isOpen,
    onToggle,
    onSelectContract,
    onNewContract,
    refreshTrigger
}: ContractSidebarProps) {
    const { address, isConnected } = useAccount()
    const [contracts, setContracts] = useState<Contract[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    // Fetch contracts
    useEffect(() => {
        if (!address) {
            setContracts([])
            return
        }

        const fetchContracts = async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/contracts?address=${address}`)
                const data = await res.json()
                if (data.contracts) {
                    setContracts(data.contracts)
                }
            } catch (error) {
                console.error('Failed to fetch contracts:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchContracts()
    }, [address, refreshTrigger])

    const handleDelete = async (e: React.MouseEvent, contractId: string) => {
        e.stopPropagation()

        if (!address) return

        const toastId = toast.loading('Deleting contract...')

        try {
            const res = await fetch(`/api/contracts?id=${contractId}&address=${address}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setContracts(prev => prev.filter(c => c._id !== contractId))
                toast.success('Contract deleted', { id: toastId })
            } else {
                toast.error('Failed to delete', { id: toastId })
            }
        } catch (error) {
            toast.error('Delete failed', { id: toastId })
        }
    }

    return (
        <>
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8 shrink-0"
            >
                {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>

            {/* Sidebar Panel - Fixed position, below header */}
            {isOpen && (
                <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-border z-30 shadow-lg">
                    <div className="flex flex-col h-full">
                        {/* New Contract Button */}
                        <div className="p-3 border-b border-border">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                onClick={onNewContract}
                            >
                                <Plus className="h-4 w-4" />
                                New Contract
                            </Button>
                        </div>

                        {/* Contract List */}
                        <ScrollArea className="flex-1">
                            <div className="p-2 space-y-1">
                                {!isConnected ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">
                                        Connect wallet to see contracts
                                    </p>
                                ) : isLoading ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">
                                        Loading...
                                    </p>
                                ) : contracts.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">
                                        No contracts yet
                                    </p>
                                ) : (
                                    contracts.map((contract) => (
                                        <div
                                            key={contract._id}
                                            onClick={() => onSelectContract(contract.code, contract.name)}
                                            onMouseEnter={() => setHoveredId(contract._id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileCode2 className="h-4 w-4 shrink-0 text-primary" />
                                                <span className="text-sm truncate">{contract.name}</span>
                                            </div>

                                            {hoveredId === contract._id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 shrink-0 text-destructive hover:text-destructive"
                                                    onClick={(e) => handleDelete(e, contract._id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>

                        {/* Footer */}
                        <div className="p-3 border-t border-border">
                            <p className="text-[10px] text-muted-foreground text-center">
                                {contracts.length} contract{contracts.length !== 1 ? 's' : ''} saved
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
