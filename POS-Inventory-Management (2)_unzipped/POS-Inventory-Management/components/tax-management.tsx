import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TaxRate {
  id: number
  name: string
  rate: number
}

export function TaxManagement() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([])
  const [newTaxRate, setNewTaxRate] = useState<Omit<TaxRate, 'id'>>({ name: '', rate: 0 })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTaxRates()
  }, [])

  const fetchTaxRates = async () => {
    try {
      const response = await fetch('/api/tax-rates/')
      if (!response.ok) throw new Error('Failed to fetch tax rates')
      const data = await response.json()
      setTaxRates(data)
    } catch (err) {
      setError('Failed to load tax rates. Please try again later.')
    }
  }

  const handleAddTaxRate = async () => {
    try {
      const response = await fetch('/api/tax-rates/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaxRate),
      })
      if (!response.ok) throw new Error('Failed to add tax rate')
      setNewTaxRate({ name: '', rate: 0 })
      fetchTaxRates() // Refresh the tax rate list
    } catch (err) {
      setError('Failed to add tax rate. Please try again.')
    }
  }

  const handleUpdateTaxRate = async (id: number, updatedRate: number) => {
    try {
      const response = await fetch(`/api/tax-rates/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rate: updatedRate }),
      })
      if (!response.ok) throw new Error('Failed to update tax rate')
      fetchTaxRates() // Refresh the tax rate list
    } catch (err) {
      setError('Failed to update tax rate. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 space-x-2">
          <Input
            type="text"
            placeholder="Tax name"
            value={newTaxRate.name}
            onChange={(e) => setNewTaxRate({ ...newTaxRate, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Tax rate (%)"
            value={newTaxRate.rate}
            onChange={(e) => setNewTaxRate({ ...newTaxRate, rate: Number(e.target.value) })}
          />
          <Button onClick={handleAddTaxRate}>Add Tax Rate</Button>
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
                <TableHead>Rate (%)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxRates.map((taxRate) => (
                <TableRow key={taxRate.id}>
                  <TableCell>{taxRate.name}</TableCell>
                  <TableCell>{taxRate.rate.toFixed(2)}%</TableCell>
                  <TableCell>
                    <Button onClick={() => handleUpdateTaxRate(taxRate.id, taxRate.rate + 0.1)}>
                      Increase
                    </Button>
                    <Button onClick={() => handleUpdateTaxRate(taxRate.id, Math.max(0, taxRate.rate - 0.1))}>
                      Decrease
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

