import openai
from django.conf import settings
from .models import Order, Product, Customer, Employee

openai.api_key = settings.OPENAI_API_KEY

def analyze_sales_trends():
    # Fetch recent orders
    recent_orders = Order.objects.order_by('-date')[:100]
    
    # Prepare data for GPT-3
    order_data = [
        f"Order {order.id}: {order.total_amount} on {order.date}, Status: {order.status}"
        for order in recent_orders
    ]
    
    prompt = f"Analyze the following sales data and provide insights:\n\n" + "\n".join(order_data)
    
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200
    )
    
    return response.choices[0].text.strip()

def generate_product_recommendations(customer_id):
    customer = Customer.objects.get(id=customer_id)
    recent_orders = Order.objects.filter(customer=customer).order_by('-date')[:10]
    
    # Prepare data for GPT-3
    order_data = [
        f"Order {order.id}: {', '.join([item.product.name for item in order.items.all()])}"
        for order in recent_orders
    ]
    
    prompt = f"Based on the following order history, suggest 3 products the customer might like:\n\n" + "\n".join(order_data)
    
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=100
    )
    
    return response.choices[0].text.strip().split('\n')

def optimize_inventory(product_id):
    product = Product.objects.get(id=product_id)
    sales_data = Order.objects.filter(items__product=product).values('date').annotate(total_sold=Sum('items__quantity'))
    
    # Prepare data for GPT-3
    sales_data_str = "\n".join([f"{data['date']}: {data['total_sold']} sold" for data in sales_data])
    
    prompt = f"Analyze the following sales data for {product.name} and suggest an optimal inventory level:\n\n{sales_data_str}"
    
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=50
    )
    
    return int(response.choices[0].text.strip())

def generate_performance_review(employee_id):
    employee = Employee.objects.get(id=employee_id)
    orders_handled = Order.objects.filter(employee=employee).count()
    total_sales = Order.objects.filter(employee=employee).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    
    prompt = f"Generate a performance review for {employee.name}:\n\nOrders handled: {orders_handled}\nTotal sales: ${total_sales:.2f}"
    
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200
    )
    
    return response.choices[0].text.strip()

def self_maintain_code():
    # Fetch all Python files in the project
    python_files = [f for f in os.listdir('.') if f.endswith('.py')]
    
    for file in python_files:
        with open(file, 'r') as f:
            code = f.read()
        
        prompt = f"Analyze the following Python code and suggest improvements or optimizations:\n\n{code}"
        
        response = openai.Completion.create(
            engine="text-davinci-002",
            prompt=prompt,
            max_tokens=200
        )
        
        print(f"Suggestions for {file}:")
        print(response.choices[0].text.strip())

