import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Table {
  id: number
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
}

export function TableManagement() {
  const [tables, setTables] = useState<Table[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables/')
      if (!response.ok) throw new Error('Failed to fetch tables')
      const data = await response.json()
      setTables(data)
    } catch (err) {
      setError('Failed to load tables. Please try again later.')
    }
  }

  const handleTableStatusChange = async (tableId: number, newStatus: 'available' | 'occupied' | 'reserved') => {
    try {
      const response = await fetch(`/api/tables/${tableId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update table status')
      fetchTables() // Refresh the table list
    } catch (err) {
      setError('Failed to update table status. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Management</CardTitle>
      </CardHeader>
      <CardContent>
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
                <TableHead>Table Number</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell>{table.number}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>{table.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleTableStatusChange(table.id, 'available')}
                      disabled={table.status === 'available'}
                    >
                      Set Available
                    </Button>
                    <Button
                      onClick={() => handleTableStatusChange(table.id, 'occupied')}
                      disabled={table.status === 'occupied'}
                    >
                      Set Occupied
                    </Button>
                    <Button
                      onClick={() => handleTableStatusChange(table.id, 'reserved')}
                      disabled={table.status === 'reserved'}
                    >
                      Set Reserved
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

