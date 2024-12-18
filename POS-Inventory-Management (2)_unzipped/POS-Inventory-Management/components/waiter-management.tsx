import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Waiter {
  id: number
  name: string
  status: 'available' | 'busy'
}

export function WaiterManagement() {
  const [waiters, setWaiters] = useState<Waiter[]>([])
  const [newWaiterName, setNewWaiterName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWaiters()
  }, [])

  const fetchWaiters = async () => {
    try {
      const response = await fetch('/api/waiters/')
      if (!response.ok) throw new Error('Failed to fetch waiters')
      const data = await response.json()
      setWaiters(data)
    } catch (err) {
      setError('Failed to load waiters. Please try again later.')
    }
  }

  const handleAddWaiter = async () => {
    try {
      const response = await fetch('/api/waiters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newWaiterName }),
      })
      if (!response.ok) throw new Error('Failed to add waiter')
      setNewWaiterName('')
      fetchWaiters() // Refresh the waiter list
    } catch (err) {
      setError('Failed to add waiter. Please try again.')
    }
  }

  const handleWaiterStatusChange = async (waiterId: number, newStatus: 'available' | 'busy') => {
    try {
      const response = await fetch(`/api/waiters/${waiterId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update waiter status')
      fetchWaiters() // Refresh the waiter list
    } catch (err) {
      setError('Failed to update waiter status. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waiter Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            type="text"
            placeholder="New waiter name"
            value={newWaiterName}
            onChange={(e) => setNewWaiterName(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleAddWaiter}>Add Waiter</Button>
        </div>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiters.map((waiter) => (
                <TableRow key={waiter.id}>
                  <TableCell>{waiter.name}</TableCell>
                  <TableCell>{waiter.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleWaiterStatusChange(waiter.id, 'available')}
                      disabled={waiter.status === 'available'}
                    >
                      Set Available
                    </Button>
                    <Button
                      onClick={() => handleWaiterStatusChange(waiter.id, 'busy')}
                      disabled={waiter.status === 'busy'}
                    >
                      Set Busy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

