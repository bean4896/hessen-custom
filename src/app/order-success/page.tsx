'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

interface OrderData {
  id: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    total: number;
    configuration?: string | {
      material: string;
      size: string;
      headboard: string;
      bedframeBody: string;
      finishColour: string;
      optional: string[];
    };
    product?: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId);
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/orders/session/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const orderData = await response.json();
      setOrder(orderData);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'We couldn\'t find your order details.'}
            </p>
            <Link href="/">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          {order.shippingAddress.email && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md max-w-md mx-auto">
              <p className="text-sm text-green-800">
                <strong>Account Created:</strong> We've created an account for you using your email address. 
                You can now sign in to track your order status.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono text-sm">{order.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default" className="bg-green-600">
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-orange-500">${order.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden border border-border/50 bg-secondary/20 flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <Package className="w-8 h-8 text-orange-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg">
                            {item.product?.name || `Custom Bed Frame`}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Product ID: {item.productId}
                          </p>
                          
                          {/* Product Configuration */}
                          {(() => {
                            const config = typeof item.configuration === 'string' 
                              ? JSON.parse(item.configuration) 
                              : item.configuration;
                            
                            return config && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <h4 className="font-medium text-foreground mb-2">Core Specifications</h4>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        <span className="font-medium">Material:</span> {config.material}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        <span className="font-medium">Size:</span> {config.size}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        <span className="font-medium">Finish:</span> {config.finishColour}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-foreground mb-2">Design Elements</h4>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        <span className="font-medium">Headboard:</span> {config.headboard}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        <span className="font-medium">Body:</span> {config.bedframeBody}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Optional Items */}
                                {config.optional && config.optional.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-foreground mb-2">Optional Add-ons</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {config.optional.map((option: string, index: number) => (
                                        <Badge key={index} variant="default" className="text-xs bg-orange-100 text-orange-800">
                                          + {option}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-lg">${item.total.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                          <div className="text-xs text-muted-foreground">${item.price.toLocaleString()} each</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </div>
                  <div>{order.shippingAddress.line1}</div>
                  {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </div>
                  <div>{order.shippingAddress.country}</div>
                  <div className="pt-2">
                    <div className="text-muted-foreground">Email:</div>
                    <div>{order.shippingAddress.email}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Phone:</div>
                    <div>{order.shippingAddress.phone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Delivery Information</h3>
              <p className="text-sm text-muted-foreground">
                Your order will be processed within 1-2 business days. 
                Estimated delivery: <strong>3-5 working days</strong> after processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}