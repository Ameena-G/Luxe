const API_BASE = '/api';

// src/lib/api.ts
export async function fetchProducts(category?: string | null, search?: string | null) {
  try {
    const params = new URLSearchParams();
    
    // Only append if the value is not null or undefined
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const queryString = params.toString();
    const url = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error; // Re-throw to let the component handle it
  }
}

export async function fetchProductsByCategory(category: string) {
  return fetchProducts(category);
}

export async function fetchProduct(id: string) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createOrder(orderData: {
  items: Array<{ id: string; quantity: number }>;
  customer?: string;
  address?: string;
  paymentMethod?: string;
}) {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function fetchOrder(id: string) {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`);
    if (!response.ok) throw new Error('Order not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}
// src/lib/api.ts
export async function subscribeToNewsletter(email: string) {
  try {
    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error('Subscription error:', error);
    return { success: false, message: 'Failed to subscribe. Please try again later.' };
  }
}