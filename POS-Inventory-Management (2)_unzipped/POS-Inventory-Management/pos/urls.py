from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, CustomerViewSet, EmployeeViewSet, TableViewSet,
    OrderViewSet, PaymentViewSet, UISettingsViewSet, TemplateViewSet,
    PropertySettingsViewSet, AccountingEntryViewSet, AIEnhancementViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'tables', TableViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'ui-settings', UISettingsViewSet)
router.register(r'templates', TemplateViewSet)
router.register(r'property-settings', PropertySettingsViewSet)
router.register(r'accounting', AccountingEntryViewSet)
router.register(r'ai', AIEnhancementViewSet, basename='ai')

urlpatterns = [
    path('', include(router.urls)),
]

