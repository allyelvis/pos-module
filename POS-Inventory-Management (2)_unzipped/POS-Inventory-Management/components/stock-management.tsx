import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StockItem {
  id: number
  name: string
  quantity: number
  unit: string
  reorderPoint: number
}

export function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, unit: '', reorderPoint: 0 })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStockItems()
  }, [])

  const fetchStockItems = async () => {
    try {
      const response = await fetch('/api/stock/')
      if (!response.ok) throw new Error('Failed to fetch stock items')
      const data = await response.json()
      setStockItems(data)
    } catch (err) {
      setError('Failed to load stock items. Please try again later.')
    }
  }

  const handleAddItem = async () => {
    try {
      const response = await fetch('/api/stock/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
      if (!response.ok) throw new Error('Failed to add stock item')
      setNewItem({ name: '', quantity: 0, unit: '', reorderPoint: 0 })
      fetchStockItems() // Refresh the stock list
    } catch (err) {
      setError('Failed to add stock item. Please try again.')
    }
  }

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    try {
      const response = await fetch(`/api/stock/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      if (!response.ok) throw new Error('Failed to update stock quantity')
      fetchStockItems() // Refresh the stock list
    } catch (err) {
      setError('Failed to update stock quantity. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 space-x-2">
          <Input
            type="text"
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          />
          <Input
            type="text"
            placeholder="Unit"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Reorder Point"
            value={newItem.reorderPoint}
            onChange={(e) => setNewItem({ ...newItem, reorderPoint: Number(e.target.value) })}
          />
          <Button onClick={handleAddItem}>Add Item</Button>
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
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.reorderPoint}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
                    <Button onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}>-</Button>
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

