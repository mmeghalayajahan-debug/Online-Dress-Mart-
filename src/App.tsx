import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { HeroBanner } from './components/home/HeroBanner';
import { ProductCatalogSection } from './components/home/ProductCatalogSection';
import { Footer } from './components/layout/Footer';
import { FloatingContactBar } from './components/layout/FloatingContactBar';
import { PullStringLampLogin } from './components/auth/PullStringLampLogin';
import { ProductDetailsModal } from './components/products/ProductDetailsModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/orders/OrderConfirmationModal';
import { CustomerProfileModal } from './components/account/CustomerProfileModal';
import { ComplaintBoxModal } from './components/support/ComplaintBoxModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AiCustomerAssistant } from './components/ai/AiCustomerAssistant';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#0c0d14] text-[#e8e9ed] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#ffd700]">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Banner with Brand Story and Actions */}
          <HeroBanner />

          {/* Product Catalog with Filtering, Sorting and Details */}
          <ProductCatalogSection />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Floating Thumb Navigation Bar */}
        <FloatingContactBar />

        {/* AI Customer Support Floating Widget */}
        <AiCustomerAssistant />

        {/* ===================== MODALS & OVERLAYS ===================== */}
        {/* 1. Pull-String Lamp Cinematic Login */}
        <PullStringLampLogin />

        {/* 2. Product Details Modal with Interactive Zoom */}
        <ProductDetailsModal />

        {/* 3. Slide-over Shopping Cart */}
        <CartDrawer />

        {/* 4. Checkout Modal */}
        <CheckoutModal />

        {/* 5. Order Confirmation Screen with Invoice Print */}
        <OrderConfirmationModal />

        {/* 6. Customer Account Profile & Order Tracking */}
        <CustomerProfileModal />

        {/* 7. Complaint & Support Box with Ticket Lookup */}
        <ComplaintBoxModal />

        {/* 8. Admin Control Panel */}
        <AdminDashboard />
      </div>
    </StoreProvider>
  );
}
