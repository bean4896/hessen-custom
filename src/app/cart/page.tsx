'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const CartPage = () => {
  const { items, totalItems, totalPrice, updateItemQuantity, removeItem } = useCart();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // Prevent quantity from going below 1
    if (newQuantity < 1) {
      return;
    }
    updateItemQuantity(itemId, newQuantity);
  };

  const handleRemoveClick = (itemId: string) => {
    setItemToRemove(itemId);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      setShowRemoveModal(false);
      setItemToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const subtotal = totalPrice;
  const tax = subtotal * 0.09; // 9% GST
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 lg:p-8 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="w-full max-w-md text-center bg-card border-border">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet. Start customizing your perfect bed frame!
            </p>
            <Link href="/">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                      {item.configuration && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.configuration.material}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.configuration.size}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.configuration.finishColour}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.configuration.headboard}
                          </Badge>
                          {item.configuration.optional && item.configuration.optional.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.configuration.optional.length} options
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <div className="flex items-center border border-border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 hover:bg-secondary"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 hover:bg-secondary"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-foreground">
                            ${(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-muted-foreground">
                              ${item.price.toLocaleString()} each
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveClick(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border sticky top-4">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span className="text-foreground">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (9%)</span>
                  <span className="text-foreground">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}
                  </span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-orange-500">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full border-border hover:border-border/80 text-foreground hover:text-foreground hover:bg-secondary">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
                <p>Free shipping on orders over $500</p>
                <p>Estimated delivery: 4-6 weeks</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this item from your cart? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelRemove}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;
