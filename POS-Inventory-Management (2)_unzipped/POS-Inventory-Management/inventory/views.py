from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Supplier, PurchaseOrder
from .serializers import ProductSerializer, SupplierSerializer, PurchaseOrderSerializer
import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase
cred = credentials.Certificate("path/to/your/firebase_credentials.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://your-project-id.firebaseio.com/'
})

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        product = self.get_object()
        quantity = int(request.data.get('quantity', 0))
        product.stock_quantity += quantity
        product.save()
        
        # Update Firebase real-time database
        ref = db.reference(f'inventory/{product.id}')
        ref.update({
            'stock_quantity': product.stock_quantity
        })
        
        return Response({'status': 'stock updated'})

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer

    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        purchase_order = self.get_object()
        purchase_order.status = 'received'
        purchase_order.save()
        
        # Update stock quantities
        for item in purchase_order.items.all():
            product = item.product
            product.stock_quantity += item.quantity
            product.save()
            
            # Update Firebase real-time database
            ref = db.reference(f'inventory/{product.id}')
            ref.update({
                'stock_quantity': product.stock_quantity
            })
        
        return Response({'status': 'purchase order received and stock updated'})

