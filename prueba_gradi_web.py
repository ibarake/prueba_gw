import requests
import base64
import json

SHOP_NAME = 'devtestrecruitte'
API_KEY = 'd156c699edcc98186dae8e6f9562d838'
API_PASS = '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'
BASE_URL = f'https://{SHOP_NAME}.myshopify.com/admin/api/2023-07/'

# Create the auth header
auth = base64.b64encode(f"{API_KEY}:{API_PASS}".encode("utf-8")).decode("utf-8")
HEADERS = {
    "Authorization": f"Basic {auth}"
}

# Get products from Shopify
def get_products():
    url = f'{BASE_URL}products.json'
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        return response.json().get('products', [])
    else:
        print(f"Error {response.status_code}: {response.text}")
        return []

def format_output(products):
    output = {}
    for idx, product in enumerate(products):
        key = product['title']
        price = float(product['variants'][0]['price']) if product['variants'] and 'price' in product['variants'][0] else 0.0
        status = product.get('status', '')
        created_at = product.get('created_at', '').split('T')[0]
        
        output[key] = {
            "price": price,
            "status": status,
            "created_at": created_at
        }
    return output

# Main process
products = get_products()
formatted_output = format_output(products)
with open("output.json", "w") as outfile:
    json.dump(formatted_output, outfile, indent=4)
