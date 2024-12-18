import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Item {
  id: number
  name: string
  description: string
  price: number
  category: string
}

export function ItemMaster() {
  const [items, setItems] = useState<Item[]>([])
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({ name: '', description: '', price: 0, category: '' })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items/')
      if (!response.ok) throw new Error('Failed to fetch items')
      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError('Failed to load items. Please try again later.')
    }
  }

  const handleAddItem = async () => {
    try {
      const response = await fetch('/api/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
      if (!response.ok) throw new Error('Failed to add item')
      setNewItem({ name: '', description: '', price: 0, category: '' })
      fetchItems() // Refresh the item list
    } catch (err) {
      setError('Failed to add item. Please try again.')
    }
  }

  const handleUpdateItem = async (id: number, updatedItem: Partial<Item>) => {
    try {
      const response = await fetch(`/api/items/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      })
      if (!response.ok) throw new Error('Failed to update item')
      fetchItems() // Refresh the item list
    } catch (err) {
      setError('Failed to update item. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Master</CardTitle>
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
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
          />
          <Input
            type="text"
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
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
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleUpdateItem(item.id, { price: item.price + 1 })}>
                      Increase Price
                    </Button>
                    <Button onClick={() => handleUpdateItem(item.id, { price: Math.max(0, item.price - 1) })}>
                      Decrease Price
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

