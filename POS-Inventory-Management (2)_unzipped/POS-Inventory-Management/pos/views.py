from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Product, Customer, Employee, Table, Order, OrderItem, Payment,
    UISettings, Template, PropertySettings, AccountingEntry
)
from .serializers import (
    ProductSerializer, CustomerSerializer, EmployeeSerializer, TableSerializer,
    OrderSerializer, OrderItemSerializer, PaymentSerializer, UISettingsSerializer,
    TemplateSerializer, PropertySettingsSerializer, AccountingEntrySerializer
)
from .ai_enhancement import (
    analyze_sales_trends, generate_product_recommendations, optimize_inventory,
    generate_performance_review, self_maintain_code
)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        order = self.get_object()
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order=order)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class UISettingsViewSet(viewsets.ModelViewSet):
    queryset = UISettings.objects.all()
    serializer_class = UISettingsSerializer

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer

class PropertySettingsViewSet(viewsets.ModelViewSet):
    queryset = PropertySettings.objects.all()
    serializer_class = PropertySettingsSerializer

class AccountingEntryViewSet(viewsets.ModelViewSet):
    queryset = AccountingEntry.objects.all()
    serializer_class = AccountingEntrySerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        total_income = AccountingEntry.objects.filter(entry_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = AccountingEntry.objects.filter(entry_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        net_profit = total_income - total_expense
        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'net_profit': net_profit
        })


class AIEnhancementViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def sales_trends(self, request):
        insights = analyze_sales_trends()
        return Response({'insights': insights})

    @action(detail=True, methods=['get'])
    def product_recommendations(self, request, pk=None):
        recommendations = generate_product_recommendations(pk)
        return Response({'recommendations': recommendations})

    @action(detail=True, methods=['get'])
    def optimize_inventory(self, request, pk=None):
        optimal_level = optimize_inventory(pk)
        return Response({'optimal_inventory_level': optimal_level})

    @action(detail=True, methods=['get'])
    def employee_performance(self, request, pk=None):
        review = generate_performance_review(pk)
        return Response({'performance_review': review})

    @action(detail=False, methods=['post'])
    def self_maintain(self, request):
        self_maintain_code()
        return Response({'message': 'Self-maintenance process completed'})

from django.db.models import Sum

