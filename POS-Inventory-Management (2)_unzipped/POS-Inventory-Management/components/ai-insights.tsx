import React, { useState } from 'react';
import { useApi } from '../hooks/use-api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AIInsights() {
  const { data: salesTrends, error: salesError, loading: salesLoading, fetchData: fetchSalesTrends } = useApi<{ insights: string }>('/ai/sales_trends/');
  const { data: recommendations, error: recoError, loading: recoLoading, fetchData: fetchRecommendations } = useApi<{ recommendations: string[] }>('/ai/product_recommendations/');
  const { data: inventory, error: invError, loading: invLoading, fetchData: fetchInventory } = useApi<{ optimal_inventory_level: number }>('/ai/optimize_inventory/');
  const { data: performance, error: perfError, loading: perfLoading, fetchData: fetchPerformance } = useApi<{ performance_review: string }>('/ai/employee_performance/');

  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const handleSalesTrends = () => {
    fetchSalesTrends();
  };

  const handleRecommendations = () => {
    fetchRecommendations(customerId);
  };

  const handleInventory = () => {
    fetchInventory(productId);
  };

  const handlePerformance = () => {
    fetchPerformance(employeeId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Button onClick={handleSalesTrends}>Analyze Sales Trends</Button>
            {salesLoading && <p>Loading...</p>}
            {salesError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{salesError.message}</AlertDescription></Alert>}
            {salesTrends && <p>{salesTrends.insights}</p>}
          </div>

          <div>
            <Input
              placeholder="Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
            <Button onClick={handleRecommendations}>Get Product Recommendations</Button>
            {recoLoading && <p>Loading...</p>}
            {recoError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{recoError.message}</AlertDescription></Alert>}
            {recommendations && (
              <ul>
                {recommendations.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Input
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <Button onClick={handleInventory}>Optimize Inventory</Button>
            {invLoading && <p>Loading...</p>}
            {invError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{invError.message}</AlertDescription></Alert>}
            {inventory && <p>Optimal Inventory Level: {inventory.optimal_inventory_level}</p>}
          </div>

          <div>
            <Input
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <Button onClick={handlePerformance}>Generate Performance Review</Button>
            {perfLoading && <p>Loading...</p>}
            {perfError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{perfError.message}</AlertDescription></Alert>}
            {performance && <p>{performance.performance_review}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

