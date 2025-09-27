'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, MapPin, User, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import StripeProvider from '@/components/payment/StripeProvider';
import PaymentForm from '@/components/payment/PaymentForm';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  const isGuest = !session?.user;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'Singapore',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Don't auto-initialize payment - wait for user to be ready

  useEffect(() => {
    // Pre-fill form with session data when user is authenticated
    if (session?.user) {
      setShippingInfo(prev => ({
        ...prev,
        email: session.user?.email || '',
        firstName: session.user?.name?.split(' ')[0] || '',
        lastName: session.user?.name?.split(' ').slice(1).join(' ') || '',
      }));
    }
  }, [session]);

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
    
    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!shippingInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!shippingInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!shippingInfo.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    if (!shippingInfo.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initializePayment = async () => {
    setIsInitializing(true);

    try {
      // Calculate total with GST
      const total = totalPrice * 1.09;

      // Create payment intent directly from cart items
      const paymentIntentResponse = await fetch('/api/create-payment-intent-from-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          total,
        }),
      });

      if (!paymentIntentResponse.ok) {
        const errorText = await paymentIntentResponse.text();
        throw new Error(`Failed to create payment intent: ${errorText}`);
      }

      const { clientSecret, paymentIntentId } = await paymentIntentResponse.json();
      
      // Set payment client secret for payment form
      setPaymentClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
    } catch (error) {
      console.error('Payment initialization error:', error);
      // Don't show alert for auto-initialization, just log the error
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePaymentSuccess = (order: any) => {
    // Clear cart and redirect to success page
    clearCart();
    router.push(`/order-success?session_id=${order.stripePaymentIntentId}`);
  };

  const handleValidationError = (errors: Record<string, string>) => {
    setValidationErrors(errors);
    // Clear validation errors when user starts typing
    setTimeout(() => setValidationErrors({}), 5000);
  };

  // Show empty cart message if cart is empty, regardless of auth status
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart before proceeding to checkout.</p>
          <Link href="/">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state only when session is loading and cart has items
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete your order ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </p>
          {isGuest && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Guest Checkout:</strong> You can complete your purchase without creating an account. 
                We'll create an account for you using your email address.
              </p>
            </div>
          )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Shipping Information and Payment */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`${errors.firstName || validationErrors.firstName ? 'border-red-500 bg-red-50' : ''}`}
                      required
                    />
                    {(errors.firstName || validationErrors.firstName) && <p className="text-red-500 text-sm mt-1">{errors.firstName || validationErrors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`${errors.lastName || validationErrors.lastName ? 'border-red-500 bg-red-50' : ''}`}
                      required
                    />
                    {(errors.lastName || validationErrors.lastName) && <p className="text-red-500 text-sm mt-1">{errors.lastName || validationErrors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`${errors.email || validationErrors.email ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {(errors.email || validationErrors.email) && <p className="text-red-500 text-sm mt-1">{errors.email || validationErrors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+65 9123 4567"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`${errors.phone || validationErrors.phone ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {(errors.phone || validationErrors.phone) && <p className="text-red-500 text-sm mt-1">{errors.phone || validationErrors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`${errors.address || validationErrors.address ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {(errors.address || validationErrors.address) && <p className="text-red-500 text-sm mt-1">{errors.address || validationErrors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="addressLine2">Apartment, suite, etc. (Optional)</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apt 4B, Unit 12"
                    value={shippingInfo.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Singapore"
                            value={shippingInfo.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={`${errors.city || validationErrors.city ? 'border-red-500 bg-red-50' : ''}`}
                            required
                          />
                          {(errors.city || validationErrors.city) && <p className="text-red-500 text-sm mt-1">{errors.city || validationErrors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      placeholder="123456"
                      value={shippingInfo.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`${errors.postalCode || validationErrors.postalCode ? 'border-red-500 bg-red-50' : ''}`}
                      required
                    />
                    {(errors.postalCode || validationErrors.postalCode) && <p className="text-red-500 text-sm mt-1">{errors.postalCode || validationErrors.postalCode}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={shippingInfo.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`${errors.country || validationErrors.country ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {(errors.country || validationErrors.country) && <p className="text-red-500 text-sm mt-1">{errors.country || validationErrors.country}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter your card details to complete your purchase
                </p>
              </CardHeader>
              <CardContent>
                {isInitializing ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Preparing your payment form...</p>
                    </div>
                  </div>
                ) : paymentClientSecret ? (
                  <StripeProvider clientSecret={paymentClientSecret}>
                    <PaymentForm 
                      paymentIntentId={paymentIntentId}
                      items={items}
                      shippingInfo={shippingInfo}
                      total={totalPrice * 1.09}
                      onSuccess={handlePaymentSuccess}
                      onValidationError={handleValidationError}
                    />
                  </StripeProvider>
                ) : items.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <p className="text-muted-foreground">Please add items to your cart to see payment options.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-orange-600" />
                      </div>
                      <p className="text-muted-foreground mb-4">Ready to enter your payment details?</p>
                      <Button 
                        onClick={initializePayment}
                        disabled={isInitializing}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {isInitializing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Preparing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Enter Payment Details
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (9%)</span>
                    <span>${(totalPrice * 0.09).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(totalPrice * 1.09).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
