'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoginModal from '@/components/auth/LoginModal';
import { useCart } from '@/hooks/useCart';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User,
  Bed,
  Settings,
  Heart,
  Settings2
} from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { totalItems: cartItemCount } = useCart();

  const navigation = [
    { name: 'Bedframe', href: '/bedframe', icon: Bed },
    { name: 'Kitchen', href: '/kitchen', icon: Settings },
    { name: 'Storage', href: '/storage-cabinets', icon: Heart },
    { name: 'Living Room', href: '/living-room-wall', icon: Settings2 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-foreground">Hessen</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/my-saved-configure">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 relative"
                title="My Saved Configure"
                asChild
              >
                <span>
                  <Settings2 className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-600">
                    3
                  </Badge>
                </span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 relative" asChild>
                <span>
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-orange-500 hover:bg-orange-600">
                      {cartItemCount}
                    </Badge>
                  )}
                </span>
              </Button>
            </Link>
            {/* Admin Link */}
            {session?.user && (session.user.email === 'admin@hessen.com' || 
              session.user.email?.includes('admin') ||
              (session.user as any).role === 'admin') && (
              <Link href="/internal">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 text-xs">
                  Admin
                </Button>
              </Link>
            )}
            {session?.user ? (
              <LoginModal>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                  <User className="w-5 h-5" />
                </Button>
              </LoginModal>
            ) : (
              <LoginModal>
                <Button variant="outline" size="sm" className="text-foreground border-border hover:border-border/80">
                  Sign In
                </Button>
              </LoginModal>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/checkout">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs bg-orange-500">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="flex items-center justify-center px-3 py-2 border-t border-border mt-2 pt-3">
                <LoginModal>
                  <Button variant="ghost" size="sm" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </LoginModal>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
