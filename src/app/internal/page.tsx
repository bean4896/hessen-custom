'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Users, 
  ShoppingBag, 
  Search,
  Filter,
  Eye,
  Calendar,
  DollarSign,
  Package,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    total: number;
    configuration?: {
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
}

interface Customer {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
  }>;
}

export default function InternalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check if user is admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/');
      return;
    }

    // Check if user is admin (you can modify this logic based on your admin system)
    const isAdmin = session.user.email === 'admin@hessen.com' || 
                   session.user.email?.includes('admin') ||
                   (session.user as any).role === 'admin';
    
    if (!isAdmin) {
      router.push('/');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders');
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }

      // Fetch customers
      const customersResponse = await fetch('/api/admin/customers');
      if (customersResponse.ok) {
        const customersData = await customersResponse.json();
        setCustomers(customersData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const filteredCustomers = customers.filter(customer => {
    return (
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
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
            Back to Site
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Internal Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage orders and customers
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('orders')}
            className={activeTab === 'orders' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Orders ({orders.length})
          </Button>
          <Button
            variant={activeTab === 'customers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('customers')}
            className={activeTab === 'customers' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            Customers ({customers.length})
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === 'orders' && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>

        {/* Content */}
        {activeTab === 'orders' ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {order.user.name || 'Guest'} • {order.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-2">Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="border border-border rounded-lg p-3">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="font-medium">{item.product?.name || `Product ${item.productId}`} × {item.quantity}</span>
                              <span>${item.total.toLocaleString()}</span>
                            </div>
                            
                            {/* Product Configuration */}
                            {item.configuration && (
                              <div className="space-y-2">
                                <div className="text-xs text-muted-foreground">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="font-medium">Material:</span> {item.configuration.material}
                                    </div>
                                    <div>
                                      <span className="font-medium">Size:</span> {item.configuration.size}
                                    </div>
                                    <div>
                                      <span className="font-medium">Finish:</span> {item.configuration.finishColour}
                                    </div>
                                    <div>
                                      <span className="font-medium">Headboard:</span> {item.configuration.headboard}
                                    </div>
                                  </div>
                                  {item.configuration.bedframeBody && (
                                    <div className="mt-1">
                                      <span className="font-medium">Body:</span> {item.configuration.bedframeBody}
                                    </div>
                                  )}
                                  {item.configuration.optional && item.configuration.optional.length > 0 && (
                                    <div className="mt-1">
                                      <span className="font-medium">Add-ons:</span> {item.configuration.optional.join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span>${order.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>${order.shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Shipping Address
                      </h4>
                      <div className="text-sm space-y-1">
                        <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <p>{order.shippingAddress.email}</p>
                        <p>{order.shippingAddress.phone}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                      <div className="mt-3 flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredOrders.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{customer.name || 'Guest User'}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {customer.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {customer.orders.length} orders
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total: ${customer.orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Order History</h4>
                    <div className="space-y-2">
                      {customer.orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between text-sm border border-border rounded p-2">
                          <div>
                            <span className="font-medium">#{order.orderNumber}</span>
                            <Badge className={`ml-2 ${getStatusColor(order.status)} text-white text-xs`}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p>${order.total.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredCustomers.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No customers found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
