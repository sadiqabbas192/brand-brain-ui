const API_BASE_URL = '/api'; // Use local proxy to avoid CORS
const API_KEY = 'digitalf5';

export async function fetchBrands() {
    try {
        console.log(`[API] Fetching brands from: ${API_BASE_URL}/brands`);
        const res = await fetch(`${API_BASE_URL}/brands`, {
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Always fetch fresh
        });

        if (!res.ok) {
            throw new Error('Failed to fetch brands');
        }

        const data = await res.json();
        const brands = data.brands || [];

        // Mock Havells for UI
        if (!brands.find(b => b.id === 'havells')) {
            brands.push({ id: 'havells', name: 'Havells' });
        }

        return brands; // Assuming { brands: [...] } or array
    } catch (error) {
        console.error('Brand fetch error:', error);
        return [];
    }
}

export async function sendMessage(payload) {
    // payload: { brand_id, question }
    try {
        const res = await fetch(`${API_BASE_URL}/ask`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (res.status === 401) {
            throw new Error('Unauthorized');
        }

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Something went wrong');
        }

        return await res.json();
    } catch (error) {
        console.error('Message send error:', error);
        throw error;
    }
}
