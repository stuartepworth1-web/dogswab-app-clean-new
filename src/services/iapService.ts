import { Capacitor } from '@capacitor/core';

export interface IAPProduct {
  id: string;
  name: string;
  price: number;
  productId: string;
  features: string[];
  popular?: boolean;
}

export const iapProducts: IAPProduct[] = [
  {
    id: 'basic',
    name: 'DOGSWAB Basic Monthly',
    price: 9.99,
    productId: 'com.dogswab.basic.monthly',
    features: [
      '50 AI consultations/month',
      'Basic health tracking',
      'Photo symptom analysis',
      'Email support'
    ]
  },
  {
    id: 'premium',
    name: 'DOGSWAB Premium Monthly',
    price: 19.99,
    productId: 'com.dogswab.premium.monthly',
    popular: true,
    features: [
      'Unlimited AI consultations',
      'Advanced health analytics',
      'Vet booking marketplace',
      'Priority support',
      'Multi-pet management',
      'Predictive health alerts'
    ]
  },
  {
    id: 'pro',
    name: 'DOGSWAB Pro Monthly',
    price: 49.99,
    productId: 'com.dogswab.pro.monthly',
    features: [
      'Everything in Premium',
      'Video vet consultations',
      '24/7 emergency hotline',
      'Family sharing (5 members)',
      'Custom health reports',
      'API access'
    ]
  }
];

export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

export const purchaseSubscription = async (productId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isNativePlatform()) {
      console.warn('IAP not available on web - simulating purchase for demo');

      setTimeout(() => {
        alert(`✅ Subscription Demo Mode\n\nProduct: ${productId}\nStatus: Active (Demo)\n\nNote: Real subscriptions require iOS App Store.`);
      }, 500);

      return { success: true };
    }

    console.log('Initiating IAP purchase for:', productId);

    return { success: false, error: 'IAP integration required - contact developer' };

  } catch (error) {
    console.error('IAP purchase error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Purchase failed'
    };
  }
};

export const restorePurchases = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isNativePlatform()) {
      console.warn('IAP restore not available on web');
      return { success: false, error: 'Not available on web' };
    }

    console.log('Restoring IAP purchases');

    return { success: false, error: 'IAP integration required - contact developer' };

  } catch (error) {
    console.error('IAP restore error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Restore failed'
    };
  }
};

export const validateReceipt = async (receipt: string, isProduction: boolean): Promise<any> => {
  try {
    const verifyUrl = isProduction
      ? 'https://buy.itunes.apple.com/verifyReceipt'
      : 'https://sandbox.itunes.apple.com/verifyReceipt';

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'receipt-data': receipt,
        'password': import.meta.env.VITE_APP_STORE_SHARED_SECRET || '',
        'exclude-old-transactions': true
      })
    });

    const data = await response.json();

    if (data.status === 21007) {
      console.log('Sandbox receipt detected, retrying with sandbox endpoint');
      return validateReceipt(receipt, false);
    }

    if (data.status === 21008) {
      console.log('Production receipt detected, retrying with production endpoint');
      return validateReceipt(receipt, true);
    }

    return data;

  } catch (error) {
    console.error('Receipt validation error:', error);
    throw error;
  }
};

export const handlePurchaseFromAppStore = async (tier: string) => {
  const product = iapProducts.find(p => p.id === tier);

  if (!product) {
    return { success: false, error: 'Invalid product' };
  }

  return await purchaseSubscription(product.productId);
};
