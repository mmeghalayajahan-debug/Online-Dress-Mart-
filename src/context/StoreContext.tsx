import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Complaint, User, StoreSettings, OrderStatus, ComplaintStatus } from '../types';
import { initialProducts, initialOrders, initialComplaints, initialStoreSettings } from '../data/initialData';
import { sound } from '../services/sound';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  complaints: Complaint[];
  currentUser: User | null;
  storeSettings: StoreSettings;
  isAdminLoggedIn: boolean;

  // Modals state
  isLampLoginOpen: boolean;
  setIsLampLoginOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isComplaintOpen: boolean;
  setIsComplaintOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Cart operations
  addToCart: (product: Product, size?: string, color?: { name: string; hex: string }, qty?: number) => void;
  updateCartQty: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Order operations
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  findOrderByIdOrNumber: (query: string) => Order | undefined;

  // Complaint operations
  submitComplaint: (complaintData: Omit<Complaint, 'id' | 'complaintId' | 'status' | 'createdAt' | 'updatedAt'>) => Complaint;
  updateComplaintStatus: (id: string, status: ComplaintStatus, notes?: string) => void;
  findComplaintById: (complaintId: string) => Complaint | undefined;

  // Product management (Admin)
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Auth operations
  loginCustomer: (email: string) => boolean;
  loginWithGoogle: () => Promise<User>;
  registerCustomer: (name: string, email: string, phone: string) => User;
  logout: () => void;
  adminLogin: (code: string) => boolean;
  adminLogout: () => void;
  changeAdminPasscode: (newCode: string) => boolean;

  // Settings
  updateStoreSettings: (settings: StoreSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'odm_products_v1',
  ORDERS: 'odm_orders_v1',
  COMPLAINTS: 'odm_complaints_v1',
  SETTINGS: 'odm_settings_v1',
  USER: 'odm_user_v1',
  CART: 'odm_cart_v1',
  ADMIN_AUTH: 'odm_admin_auth_v1',
  ADMIN_PASSCODE: 'odm_admin_passcode_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  // Complaints
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return saved ? JSON.parse(saved) : initialComplaints;
    } catch {
      return initialComplaints;
    }
  });

  // Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialStoreSettings;
    } catch {
      return initialStoreSettings;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Admin Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Modal UI state
  const [isLampLoginOpen, setIsLampLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Cart operations
  const addToCart = (product: Product, size?: string, color?: { name: string; hex: string }, qty = 1) => {
    const chosenSize = size || product.availableSizes[0] || 'Free Size';
    const chosenColor = color || product.availableColors[0] || { name: 'Default', hex: '#000000' };

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor.name === chosenColor.name
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      }
      return [...prev, { product, selectedSize: chosenSize, selectedColor: chosenColor, quantity: qty }];
    });

    sound.playCartAdd();
  };

  const updateCartQty = (index: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ODM-${new Date().getFullYear()}-${randomSuffix}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setLastPlacedOrder(newOrder);

    // Update product stock accordingly
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = orderData.items.find((item) => item.product.id === prod.id);
        if (orderedItem) {
          const updatedStock = Math.max(0, prod.stock - orderedItem.quantity);
          return {
            ...prod,
            stock: updatedStock,
            status: updatedStock === 0 ? 'out_of_stock' : prod.status,
          };
        }
        return prod;
      })
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status, updatedAt: new Date().toISOString() } : ord))
    );
  };

  const findOrderByIdOrNumber = (query: string) => {
    const cleaned = query.trim().toUpperCase();
    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleaned ||
        o.orderNumber.toUpperCase().includes(cleaned) ||
        o.id === query ||
        o.customerPhone.includes(query)
    );
  };

  // Complaints
  const submitComplaint = (
    complaintData: Omit<Complaint, 'id' | 'complaintId' | 'status' | 'createdAt' | 'updatedAt'>
  ): Complaint => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CMP-${new Date().getFullYear()}-${randomNum}`;
    const newComplaint: Complaint = {
      ...complaintData,
      id: `cmp-${Date.now()}`,
      complaintId,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, notes?: string) => {
    setComplaints((prev) =>
      prev.map((cmp) =>
        cmp.id === id
          ? {
              ...cmp,
              status,
              adminNotes: notes !== undefined ? notes : cmp.adminNotes,
              updatedAt: new Date().toISOString(),
            }
          : cmp
      )
    );
  };

  const findComplaintById = (complaintId: string) => {
    const cleaned = complaintId.trim().toUpperCase();
    return complaints.find(
      (c) =>
        c.complaintId.toUpperCase() === cleaned ||
        c.complaintId.toUpperCase().includes(cleaned) ||
        c.customerPhone.includes(complaintId)
    );
  };

  // Product management
  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...product, updatedAt: new Date().toISOString() };
        return next;
      }
      return [{ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Auth
  const loginCustomer = (email: string): boolean => {
    // Check if user exists or create quick session
    const existingName = email.split('@')[0];
    const user: User = {
      id: `usr-${Date.now()}`,
      name: existingName.charAt(0).toUpperCase() + existingName.slice(1),
      email,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    return true;
  };

  const loginWithGoogle = async (): Promise<User> => {
    // Simulated Google OAuth flow with instant smooth response & profile creation
    await new Promise((resolve) => setTimeout(resolve, 600));
    const randomId = Math.floor(100 + Math.random() * 900);
    const googleUser: User = {
      id: `usr-google-${Date.now()}`,
      name: 'Google User',
      email: `customer${randomId}@gmail.com`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'customer',
      googleId: `google-oauth-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(googleUser);
    return googleUser;
  };

  const registerCustomer = (name: string, email: string, phone: string): User => {
    const user: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const adminLogin = (code: string): boolean => {
    const trimmed = code.trim();
    const storedPasscode = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSCODE);
    // Custom passcode check or fallback defaults (admin123, 01897514604, or stored)
    if (
      (storedPasscode && trimmed === storedPasscode) ||
      trimmed === 'admin123' ||
      trimmed === '01897514604' ||
      trimmed === 'admin'
    ) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const changeAdminPasscode = (newCode: string): boolean => {
    if (!newCode || newCode.trim().length < 4) return false;
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, newCode.trim());
    return true;
  };

  const updateStoreSettings = (settings: StoreSettings) => {
    setStoreSettings(settings);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        complaints,
        currentUser,
        storeSettings,
        isAdminLoggedIn,

        isLampLoginOpen,
        setIsLampLoginOpen,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isComplaintOpen,
        setIsComplaintOpen,
        isAdminOpen,
        setIsAdminOpen,
        isProfileOpen,
        setIsProfileOpen,
        selectedProduct,
        setSelectedProduct,
        lastPlacedOrder,
        setLastPlacedOrder,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,

        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,

        placeOrder,
        updateOrderStatus,
        findOrderByIdOrNumber,

        submitComplaint,
        updateComplaintStatus,
        findComplaintById,

        saveProduct,
        deleteProduct,

        loginCustomer,
        loginWithGoogle,
        registerCustomer,
        logout,
        adminLogin,
        adminLogout,
        changeAdminPasscode,

        updateStoreSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
