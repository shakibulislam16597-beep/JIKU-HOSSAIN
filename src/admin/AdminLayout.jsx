import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import AdminDashboard from './AdminDashboard';
import ComingSoon from './ComingSoon';

import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  CreditCard,
  Users,
  Truck,
  Ticket,
  BarChart3,
  FileText,
  Bell,
  UserCheck,
  ClipboardList,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Store
} from 'lucide-react';

export default function AdminLayout({ currentHash, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({
    products: true,
    orders: false,
    inventory: false,
    payments: false,
    staff: false,
    security: false
  });

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.hash = '#/admin/login';
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const navGroups = [
    {
      type: 'single',
      label: 'Dashboard',
      icon: LayoutDashboard,
      hash: '#/admin/dashboard'
    },
    {
      type: 'group',
      key: 'products',
      label: 'Products',
      icon: Package,
      items: [
        { label: 'All Products', hash: '#/admin/products' },
        { label: 'Add Product', hash: '#/admin/products/new' },
        { label: 'Categories', hash: '#/admin/categories' },
        { label: 'Brands', hash: '#/admin/brands' },
        { label: 'Reviews', hash: '#/admin/reviews' }
      ]
    },
    {
      type: 'group',
      key: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      items: [
        { label: 'Stock', hash: '#/admin/inventory/stock' },
        { label: 'Stock In', hash: '#/admin/inventory/in' },
        { label: 'Stock Out', hash: '#/admin/inventory/out' },
        { label: 'Low Stock', hash: '#/admin/inventory/low' },
        { label: 'Stock History', hash: '#/admin/inventory/history' }
      ]
    },
    {
      type: 'group',
      key: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      items: [
        { label: 'All Orders', hash: '#/admin/orders' },
        { label: 'Pending', hash: '#/admin/orders/pending' },
        { label: 'Processing', hash: '#/admin/orders/processing' },
        { label: 'Shipped', hash: '#/admin/orders/shipped' },
        { label: 'Delivered', hash: '#/admin/orders/delivered' },
        { label: 'Cancelled', hash: '#/admin/orders/cancelled' },
        { label: 'Returns', hash: '#/admin/orders/returns' }
      ]
    },
    {
      type: 'group',
      key: 'payments',
      label: 'Payments',
      icon: CreditCard,
      items: [
        { label: 'Transactions', hash: '#/admin/payments/transactions' },
        { label: 'Successful', hash: '#/admin/payments/successful' },
        { label: 'Failed', hash: '#/admin/payments/failed' },
        { label: 'Refunds', hash: '#/admin/payments/refunds' },
        { label: 'Payment Settings', hash: '#/admin/payments/settings' }
      ]
    },
    {
      type: 'single',
      label: 'Customers',
      icon: Users,
      hash: '#/admin/customers'
    },
    {
      type: 'single',
      label: 'Delivery',
      icon: Truck,
      hash: '#/admin/delivery'
    },
    {
      type: 'single',
      label: 'Coupons',
      icon: Ticket,
      hash: '#/admin/coupons'
    },
    {
      type: 'single',
      label: 'Analytics',
      icon: BarChart3,
      hash: '#/admin/analytics'
    },
    {
      type: 'single',
      label: 'Reports',
      icon: FileText,
      hash: '#/admin/reports'
    },
    {
      type: 'single',
      label: 'Notifications',
      icon: Bell,
      hash: '#/admin/notifications'
    },
    {
      type: 'group',
      key: 'staff',
      label: 'Staff',
      icon: UserCheck,
      items: [
        { label: 'Admins', hash: '#/admin/staff/admins' },
        { label: 'Roles', hash: '#/admin/staff/roles' },
        { label: 'Permissions', hash: '#/admin/staff/permissions' }
      ]
    },
    {
      type: 'single',
      label: 'Audit Logs',
      icon: ClipboardList,
      hash: '#/admin/audit-logs'
    },
    {
      type: 'single',
      label: 'Settings',
      icon: Settings,
      hash: '#/admin/settings'
    },
    {
      type: 'group',
      key: 'security',
      label: 'Security',
      icon: Shield,
      items: [
        { label: '2FA', hash: '#/admin/security/2fa' },
        { label: 'Login History', hash: '#/admin/security/login-history' },
        { label: 'Sessions', hash: '#/admin/security/sessions' },
        { label: 'Security Logs', hash: '#/admin/security/security-logs' }
      ]
    }
  ];

  // Helper to resolve route page title and view
  const renderMainContent = () => {
    if (currentHash === '#/admin/dashboard' || currentHash === '#/admin' || currentHash === '#/admin/') {
      return <AdminDashboard />;
    }

    // Find title match from nav groups
    let activeTitle = 'Admin Portal';
    navGroups.forEach((group) => {
      if (group.type === 'single' && group.hash === currentHash) {
        activeTitle = group.label;
      } else if (group.type === 'group' && group.items) {
        group.items.forEach((sub) => {
          if (sub.hash === currentHash) {
            activeTitle = `${group.label} - ${sub.label}`;
          }
        });
      }
    });

    return <ComingSoon pageTitle={activeTitle} />;
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r-2 border-[#0E1330] text-[#0E1330] select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b-2 border-[#0E1330] bg-[#F7F8FC] flex items-center justify-between">
        <a href="#/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFC933] border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] flex items-center justify-center font-heading font-black text-sm">
            E
          </div>
          <div>
            <h2 className="text-sm font-heading font-extrabold uppercase tracking-wider text-[#0E1330]">
              Extrovat Admin
            </h2>
            <p className="text-[10px] font-sans text-[#5B6079]">Calm Management Console</p>
          </div>
        </a>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg border-2 border-[#0E1330] bg-[#FFFFFF] text-[#0E1330]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-sans">
        {navGroups.map((group, idx) => {
          if (group.type === 'single') {
            const Icon = group.icon;
            const isActive = currentHash === group.hash;
            return (
              <a
                key={idx}
                href={group.hash}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2436F5] text-[#FFFFFF] border-[#0E1330] shadow-[2px_2px_0px_#0E1330]'
                    : 'bg-transparent border-transparent text-[#0E1330] hover:bg-[#F7F8FC] hover:border-[#0E1330]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFC933]' : 'text-[#5B6079]'}`} />
                <span>{group.label}</span>
              </a>
            );
          }

          if (group.type === 'group') {
            const Icon = group.icon;
            const isExpanded = expandedGroups[group.key];
            const hasActiveChild = group.items.some((item) => item.hash === currentHash);

            return (
              <div key={idx} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border-2 font-bold transition-all cursor-pointer ${
                    hasActiveChild
                      ? 'bg-[#F7F8FC] border-[#0E1330] text-[#2436F5]'
                      : 'border-transparent text-[#0E1330] hover:bg-[#F7F8FC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#5B6079]" />
                    <span>{group.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#5B6079]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#5B6079]" />
                  )}
                </button>

                {isExpanded && (
                  <div className="pl-6 space-y-0.5 border-l-2 border-[#0E1330]/20 ml-4 py-1">
                    {group.items.map((sub, sIdx) => {
                      const isSubActive = currentHash === sub.hash;
                      return (
                        <a
                          key={sIdx}
                          href={sub.hash}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                            isSubActive
                              ? 'bg-[#2436F5] text-[#FFFFFF] border-[#0E1330]'
                              : 'border-transparent text-[#5B6079] hover:text-[#0E1330] hover:bg-[#F7F8FC]'
                          }`}
                        >
                          {sub.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t-2 border-[#0E1330] bg-[#F7F8FC] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <div className="truncate pr-2">
            <p className="text-[#0E1330] truncate">{user?.email || 'Admin Staff'}</p>
            <p className="text-[9px] text-[#5B6079]">Active Staff Session</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg border-2 border-[#0E1330] bg-[#FFFFFF] text-red-600 hover:bg-red-50 cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <a
          href="#/"
          className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-[#FFFFFF] border-2 border-[#0E1330] rounded-xl text-[11px] font-heading font-extrabold text-[#0E1330] hover:bg-[#FFC933] transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-[#2436F5]" /> View Storefront
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0E1330] font-sans flex flex-col lg:flex-row">
      {/* Mobile Top Header Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#FFFFFF] border-b-2 border-[#0E1330] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open sidebar menu"
            className="p-2 bg-[#F7F8FC] rounded-xl border-2 border-[#0E1330] text-[#0E1330] hover:bg-[#FFC933] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#0E1330]">
            Extrovat Admin
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      {/* Slide-in Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#0E1330]/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Fixed Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {renderSidebarContent()}
      </aside>

      {/* Main Content View Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {renderMainContent()}
      </main>
    </div>
  );
}
