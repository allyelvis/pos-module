import { Dashboard } from '@/components/dashboard'
import { OrderManagement } from '@/components/order-management'
import { TableManagement } from '@/components/table-management'
import { WaiterManagement } from '@/components/waiter-management'
import { StockManagement } from '@/components/stock-management'
import { InvoiceCustomization } from '@/components/invoice-customization'
import { ItemMaster } from '@/components/item-master'
import { ItemMenu } from '@/components/item-menu'
import { RealTimeReports } from '@/components/real-time-reports'
import { TaxManagement } from '@/components/tax-management'
import { AccountingIntegration } from '@/components/accounting-integration'
import { PropertySettings } from '@/components/property-settings'
import { UICustomization } from '@/components/ui-customization'
import { TemplateManagement } from '@/components/template-management'
import { AIInsights } from '@/components/ai-insights'
import { withAuth } from '@/components/with-auth'

function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">POS Dashboard</h1>
      <Dashboard />
      <RealTimeReports />
      <OrderManagement />
      <TableManagement />
      <WaiterManagement />
      <StockManagement />
      <InvoiceCustomization />
      <ItemMaster />
      <ItemMenu />
      <TaxManagement />
      <AccountingIntegration />
      <PropertySettings />
      <UICustomization />
      <TemplateManagement />
      <AIInsights />
    </div>
  )
}

export default withAuth(DashboardPage, ['admin', 'manager'])

