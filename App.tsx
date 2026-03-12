import React, { useState, useEffect } from 'react';
import { formatCurrency, CATEGORIES, BRANDS, BRAND_IMAGES } from './constants';
import { Product, CartItem, User, ViewState, Order, OrderStatus, Gender } from './types';
import { db } from './services/db';
import CartDrawer from './components/CartDrawer';
import ProductDetailView from './components/ProductDetailView';
import UserProfileView from './components/UserProfileView';
import StylistChat from './components/StylistChat';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import VisualSearchModal from './components/VisualSearchModal';
import Toast from './components/Toast';
import { ShoppingBagIcon, SparklesIcon, SearchIcon, UserIcon, HeartIcon, ArrowRightIcon, CameraIcon } from './components/Icons';

const ITEMS_PER_PAGE = 12;

function App() {
    // --- TRẠNG THÁI (STATE) ---
    const [view, setView] = useState<ViewState>(ViewState.HOME);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [wishlist, setWishlist] = useState<Set<number>>(new Set());
    const [brands, setBrands] = useState<string[]>([]);

    // Trạng thái điều hướng
    const [activeGender, setActiveGender] = useState<Gender>('WOMEN');
    const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
    const [activeBrand, setActiveBrand] = useState<string>('Tất cả');

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Lớp phủ giao diện (UI Overlays)
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isStylistOpen, setIsStylistOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // --- KHỞI TẠO DỮ LIỆU ---
    useEffect(() => {
        setProducts(db.getProducts());
        setOrders(db.getOrders());
        setUser(db.getCurrentUser());
        setBrands(db.getBrands());
    }, []);

    // --- XỬ LÝ (HANDLERS) ---
    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        if (val.trim() !== '' && view !== ViewState.COLLECTION) {
            setActiveBrand('Tất cả');
            setActiveCategory('Tất cả');
            setView(ViewState.COLLECTION);
        }
    };

    const filteredProducts = products.filter((p: Product) => {
        if (view === ViewState.COLLECTION) {
            const matchesGender = activeGender ? p.gender === activeGender : true;
            const matchesCategory = activeCategory === 'Tất cả' || p.category === activeCategory;
            const matchesBrand = activeBrand === 'Tất cả' || p.brand === activeBrand;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesGender && matchesCategory && matchesBrand && matchesSearch;
        }
        return true;
    });

    const cartItemCount = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

    const handleAddToCart = (product: Product, size: string, color: string, quantity: number) => {
        setCart((prev: CartItem[]) => {
            const idx = prev.findIndex((item: CartItem) => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
            if (idx >= 0) {
                const newCart = [...prev];
                newCart[idx].quantity += quantity;
                return newCart;
            }
            const newItem: CartItem = {
                ...product,
                cartId: `${product.id}-${size}-${color}-${Date.now()}`,
                selectedSize: size,
                selectedColor: color,
                quantity
            };
            return [...prev, newItem];
        });
        setToastMessage(`Đã thêm ${product.name} vào giỏ!`);
        setIsCartOpen(true);
    };

    const handleUpdateCart = (id: string, qty: number) => setCart((prev: CartItem[]) => prev.map((i: CartItem) => i.cartId === id ? { ...i, quantity: qty } : i));
    const handleRemoveCart = (id: string) => setCart((prev: CartItem[]) => prev.filter((i: CartItem) => i.cartId !== id));

    const handleCheckoutInit = () => {
        if (!user) { setIsCartOpen(false); setIsAuthOpen(true); return; }
        setIsCartOpen(false); setIsCheckoutOpen(true);
    };

    const handlePaymentSuccess = () => {
        const newOrder: Order = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            date: new Date().toLocaleDateString('vi-VN'),
            items: [...cart],
            total: cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),
            status: 'pending',
            shippingAddress: user?.address || 'Tại cửa hàng',
            customerName: user?.name
        };
        db.addOrder(newOrder);
        setOrders((prev: Order[]) => [newOrder, ...prev]);
        setCart([]);
        setToastMessage("Đặt hàng thành công!");
    };

    const handleToggleWishlist = (product: Product) => {
        setWishlist((prev: Set<number>) => {
            const next = new Set(prev);
            if (next.has(product.id)) {
                next.delete(product.id);
                setToastMessage("Đã xóa khỏi yêu thích");
            } else {
                next.add(product.id);
                setToastMessage("Đã thêm vào yêu thích");
            }
            return next;
        });
    };

    const getPageTitle = () => {
        if (view === ViewState.BRAND_LIST) return "CÁC BỘ SƯU TẬP";
        if (view === ViewState.HOME) return "TRANG CHỦ";
        if (activeBrand !== 'Tất cả') return activeBrand.toUpperCase();
        const genderMap: Record<Gender, string> = { 'WOMEN': 'NỮ', 'MEN': 'NAM', 'KIDS': 'TRẺ EM', 'BABY': 'SƠ SINH' };
        const genderText = genderMap[activeGender as Gender] || 'SẢN PHẨM';
        const categoryText = activeCategory === 'Tất cả' ? 'TẤT CẢ SẢN PHẨM' : activeCategory.toUpperCase();
        return `${genderText} / ${categoryText}`;
    };

    // --- CÁC VIEWS ---

    const BrandListView = () => (
        <div className="pt-24 pb-20 max-w-[1440px] mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-wider">Bộ Sưu Tập & Thương Hiệu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {brands.map((brand: string, idx: number) => (
                    <div
                        key={idx}
                        onClick={() => {
                            setActiveBrand(brand);
                            setActiveCategory('Tất cả');
                            setView(ViewState.COLLECTION);
                            window.scrollTo(0, 0);
                        }}
                        className="group cursor-pointer relative overflow-hidden aspect-video bg-gray-100 border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                    >
                        <img
                            src={BRAND_IMAGES[brand] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"}
                            alt={brand}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center p-6 text-center">
                            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{brand}</h3>
                            <span className="opacity-0 group-hover:opacity-100 text-white text-xs border-b border-white pb-1 transition-opacity duration-300 delay-100 uppercase tracking-wide">Xem sản phẩm</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const HomeView = () => {
        const newArrivals = products.filter((p: Product) => p.isNew).slice(0, 8);
        return (
            <div className="w-full bg-white">
                {/* Hero */}
                <div className="relative w-full h-[85vh] bg-gray-900 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
                        alt="Hero Banner"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end pb-20 px-8 lg:px-24">
                        <div className="max-w-3xl animate-in slide-in-from-bottom-10 fade-in duration-1000">
                            <span className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Bộ sưu tập Thu / Đông 2024</span>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tighter leading-none">The Minimalist<br />Essence</h1>
                            <p className="text-gray-200 mb-8 text-lg font-medium max-w-lg leading-relaxed">Khám phá vẻ đẹp của sự đơn giản. Chất liệu cao cấp, phom dáng hiện đại, trường tồn với thời gian.</p>
                            <button onClick={() => { setActiveGender('WOMEN'); setView(ViewState.COLLECTION); }} className="group bg-white text-black px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-[#ED1C24] hover:text-white transition-colors flex items-center space-x-3 w-fit">
                                <span>Khám phá ngay</span><ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <section className="py-20 px-4 lg:px-12 max-w-[1600px] mx-auto">
                    <h2 className="text-3xl font-bold text-center uppercase tracking-widest mb-12">Danh mục nổi bật</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {(['WOMEN', 'MEN', 'KIDS', 'BABY'] as Gender[]).map((g: Gender) => (
                            <div key={g} onClick={() => { setActiveGender(g); setView(ViewState.COLLECTION); }} className="group relative h-[450px] cursor-pointer overflow-hidden bg-gray-100">
                                <img src={g === 'WOMEN' ? "https://images.unsplash.com/photo-1595777457583-95e059d581b8" : g === 'MEN' ? "https://images.unsplash.com/photo-1617137968427-85924c809a29" : g === 'KIDS' ? "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8" : "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-sm px-8 py-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-xl font-bold uppercase tracking-widest">{g === 'WOMEN' ? 'Nữ' : g === 'MEN' ? 'Nam' : g === 'KIDS' ? 'Trẻ em' : 'Sơ sinh'}</h3>
                                        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wide group-hover:text-black">Xem bộ sưu tập</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Lookbook */}
                <section className="bg-gray-100 py-20 px-4 lg:px-12">
                    <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-1/2 relative">
                            <div className="aspect-[4/5] bg-gray-200 overflow-hidden relative z-10">
                                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-[#ED1C24] z-0 hidden lg:block"></div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="text-[#ED1C24] font-bold uppercase tracking-widest text-sm mb-4 block">Bộ sưu tập nổi bật</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 uppercase tracking-tighter">Daily Flow</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">Mỗi thiết kế đều được tính toán tỉ mỉ để mang lại sự thoải mái tối đa. Từ chất liệu vải cotton thoáng khí đến công nghệ AirSense độc quyền, chúng tôi mang đến trang phục không chỉ đẹp mà còn giúp bạn tận hưởng cuộc sống.</p>
                            <button onClick={() => { setActiveBrand('Daily Flow'); setView(ViewState.COLLECTION); }} className="border-b-2 border-black pb-1 text-black font-bold uppercase tracking-wide hover:text-[#ED1C24] hover:border-[#ED1C24] transition-colors text-sm">Xem chi tiết bộ sưu tập</button>
                        </div>
                    </div>
                </section>

                {/* New Arrivals */}
                <section className="py-20 px-4 lg:px-12 max-w-[1600px] mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div><h2 className="text-3xl font-bold uppercase tracking-widest mb-2">Hàng mới về</h2><p className="text-gray-500">Những sản phẩm mới nhất tuần này</p></div>
                        <button onClick={() => { setActiveCategory('Tất cả'); setView(ViewState.COLLECTION); }} className="hidden md:flex items-center space-x-2 text-sm font-bold uppercase hover:text-[#ED1C24] transition-colors"><span>Xem tất cả</span><ArrowRightIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                        {newArrivals.map((product: Product) => (
                            <div key={product.id} className="group cursor-pointer flex flex-col" onClick={() => { setSelectedProduct(product); setView(ViewState.PRODUCT_DETAIL); window.scrollTo(0, 0); }}>
                                <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    {product.isNew && <span className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">New</span>}
                                    <button onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }} className="absolute bottom-3 right-3 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white shadow-md translate-y-2 group-hover:translate-y-0 duration-300">
                                        <HeartIcon className={`w-5 h-5 ${wishlist.has(product.id) ? 'text-[#ED1C24] hover:text-[#ED1C24]' : 'text-current'}`} fill={wishlist.has(product.id) ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-[#ED1C24] transition-colors uppercase tracking-tight">{product.name}</h4>
                                    <div className="flex justify-between items-center"><p className="text-xs text-gray-500 uppercase">{product.category}</p><span className="font-bold text-sm text-gray-900">{formatCurrency(product.price)}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    };

    const CollectionView = () => {
        const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
        const displayedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

        return (
            <div className="pt-24 pb-20 max-w-[1440px] mx-auto">
                <div className="mb-10 px-4 lg:px-8">
                    <div className="relative w-full aspect-[4/1] bg-gray-900 text-white overflow-hidden flex items-center justify-center">
                        <div className="text-center z-10"><h2 className="text-3xl font-bold uppercase tracking-widest mb-2">{getPageTitle()}</h2><p className="text-sm text-gray-400">Khám phá phong cách của riêng bạn</p></div>
                    </div>
                </div>

                <div className="px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="sticky top-28 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-2">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2 uppercase tracking-wide">Danh mục</h3>
                            <ul className="space-y-1 mb-8">
                                <li><button onClick={() => setActiveCategory('Tất cả')} className={`w-full text-left py-2 px-2 text-sm font-medium transition-colors ${activeCategory === 'Tất cả' ? 'text-[#ED1C24] font-bold bg-red-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>Tất cả sản phẩm</button></li>
                                {CATEGORIES.map((cat: string) => (
                                    <li key={cat}><button onClick={() => setActiveCategory(cat)} className={`w-full text-left py-2 px-2 text-sm font-medium transition-colors ${activeCategory === cat ? 'text-[#ED1C24] font-bold bg-red-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>{cat}</button></li>
                                ))}
                            </ul>
                            <h3 className="font-bold text-lg mb-4 border-b pb-2 uppercase tracking-wide">Bộ sưu tập</h3>
                            <ul className="space-y-1 mb-8">
                                <li><button onClick={() => setActiveBrand('Tất cả')} className={`w-full text-left py-2 px-2 text-sm font-medium transition-colors ${activeBrand === 'Tất cả' ? 'text-[#ED1C24] font-bold bg-red-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>Tất cả</button></li>
                                {brands.map((brand: string) => (
                                    <li key={brand}><button onClick={() => setActiveBrand(brand)} className={`w-full text-left py-2 px-2 text-sm font-medium transition-colors ${activeBrand === brand ? 'text-[#ED1C24] font-bold bg-red-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>{brand}</button></li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-xl font-bold uppercase tracking-wide">Kết quả<span className="text-gray-500 text-sm font-normal ml-2 lowercase">({filteredProducts.length} sản phẩm)</span></h3>
                        </div>
                        {filteredProducts.length === 0 ? (
                            <div className="py-20 text-center bg-gray-50"><p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p><button onClick={() => { setActiveCategory('Tất cả'); setActiveBrand('Tất cả'); setSearchQuery(''); }} className="mt-4 text-[#ED1C24] underline">Xóa bộ lọc</button></div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                                {displayedProducts.map((product: Product) => (
                                    <div key={product.id} className="group cursor-pointer flex flex-col" onClick={() => { setSelectedProduct(product); setView(ViewState.PRODUCT_DETAIL); window.scrollTo(0, 0); }}>
                                        <div className="relative aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute top-0 left-0 p-2 flex flex-col space-y-1">
                                                {product.isNew && <span className="bg-white/90 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Mới</span>}
                                                {product.isLimited && <span className="bg-[#ED1C24] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Giảm giá</span>}
                                            </div>
                                            <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleToggleWishlist(product); }} className="absolute bottom-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                                                <HeartIcon className={`w-5 h-5 ${wishlist.has(product.id) ? 'text-[#ED1C24]' : 'text-gray-400'}`} fill={wishlist.has(product.id) ? 'currentColor' : 'none'} />
                                            </button>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex space-x-1 mb-1">
                                                {product.colors.slice(0, 4).map((c: string, i: number) => (<div key={i} className="w-3 h-3 border border-gray-300 bg-gray-200" title={c} style={{ backgroundColor: c === 'Trắng' ? '#fff' : c === 'Đen' ? '#000' : 'gray' }}></div>))}
                                                {product.colors.length > 4 && <span className="text-[10px] text-gray-500">+{product.colors.length - 4}</span>}
                                            </div>
                                            <div className="mb-1"><span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{product.brand || 'Nexa Core'}</span></div>
                                            <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-[#ED1C24] transition-colors">{product.name}</h4>
                                            <p className="text-xs text-gray-500 mb-2">{product.gender === 'WOMEN' ? 'Nữ' : product.gender === 'MEN' ? 'Nam' : product.gender === 'KIDS' ? 'Trẻ em' : 'Sơ sinh'}</p>
                                            <div className="mt-auto flex items-baseline space-x-2">
                                                <span className={`font-bold text-base ${product.isLimited ? 'text-[#ED1C24]' : 'text-gray-900'}`}>{formatCurrency(product.price)}</span>
                                                {product.isLimited && <span className="text-xs text-gray-400 line-through">{formatCurrency(product.price * 1.2)}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {totalPages > 1 && (
                            <div className="mt-16 border-t pt-8 flex justify-center space-x-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page: number) => (
                                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 flex items-center justify-center font-bold text-sm border transition-colors ${currentPage === page ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>{page}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDER CHÍNH ---
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#ED1C24] selection:text-white">
            {view === ViewState.ADMIN_LOGIN || view === ViewState.ADMIN_DASHBOARD ? (
                view === ViewState.ADMIN_LOGIN ? (
                    <AdminLogin onLoginSuccess={() => setView(ViewState.ADMIN_DASHBOARD)} onBack={() => setView(ViewState.HOME)} />
                ) : (
                    <AdminDashboard
                        products={products} orders={orders} onLogout={() => setView(ViewState.HOME)}
                        onAddProduct={(p: Product) => { db.addProduct(p); setProducts((prev: Product[]) => [p, ...prev]); }}
                        onUpdateProduct={(p: Product) => { db.updateProduct(p); setProducts((prev: Product[]) => prev.map((pr: Product) => pr.id === p.id ? p : pr)); }}
                        onDeleteProduct={(id: number) => { db.deleteProduct(id); setProducts((prev: Product[]) => prev.filter((p: Product) => p.id !== id)); }}
                        onUpdateOrderStatus={(id: string, st: OrderStatus) => { db.updateOrderStatus(id, st); setOrders((prev: Order[]) => prev.map((o: Order) => o.id === id ? { ...o, status: st } : o)); }}
                    />
                )
            ) : (
                <>
                    <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-sm border-b border-gray-200">
                        <div className="bg-gray-100 text-xs text-gray-600 py-1 text-center font-medium">Miễn phí vận chuyển cho đơn hàng từ 999.000đ | Đổi trả trong 30 ngày</div>
                        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                            <div className="flex items-center space-x-8">
                                <button onClick={() => { setView(ViewState.HOME); setActiveCategory('Tất cả'); setActiveBrand('Tất cả'); }} className="w-10 h-10 bg-[#ED1C24] text-white flex flex-col items-center justify-center font-bold leading-none text-[10px] tracking-tighter hover:opacity-90 transition-opacity"><span>NEXA</span><span>MODE</span></button>
                                <nav className="hidden md:flex space-x-6">
                                    {(['WOMEN', 'MEN', 'KIDS', 'BABY'] as Gender[]).map((g: Gender) => (
                                        <button key={g} onClick={() => { setActiveGender(g); setView(ViewState.COLLECTION); setActiveCategory('Tất cả'); setActiveBrand('Tất cả'); }} className={`text-sm font-bold tracking-wide py-5 border-b-2 transition-colors ${activeGender === g && view === ViewState.COLLECTION ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}>{g === 'WOMEN' ? 'NỮ' : g === 'MEN' ? 'NAM' : g === 'KIDS' ? 'TRẺ EM' : 'SƠ SINH'}</button>
                                    ))}
                                    <button onClick={() => setView(ViewState.BRAND_LIST)} className={`text-sm font-bold tracking-wide py-5 border-b-2 transition-colors ${view === ViewState.BRAND_LIST ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}>THƯƠNG HIỆU</button>
                                </nav>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="hidden lg:flex items-center bg-gray-100 rounded-none px-3 py-2 w-64 border border-transparent focus-within:border-gray-400 focus-within:bg-white transition-all">
                                    <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500" />
                                    <SearchIcon className="w-4 h-4 text-gray-500" />
                                </div>
                                <button onClick={() => setIsVisualSearchOpen(true)} className="p-2 text-gray-500 hover:text-[#ED1C24] transition-colors" title="Tìm kiếm bằng hình ảnh"><CameraIcon className="w-5 h-5" /></button>
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => setIsStylistOpen(true)} className="p-3 hover:bg-gray-100 transition-colors"><SparklesIcon className="w-6 h-6 text-gray-800" /></button>
                                    <button onClick={() => user ? setView(ViewState.PROFILE) : setIsAuthOpen(true)} className="p-3 hover:bg-gray-100 transition-colors"><UserIcon className="w-6 h-6 text-gray-800" /></button>
                                    <button onClick={() => setIsCartOpen(true)} className="p-3 hover:bg-gray-100 transition-colors relative"><ShoppingBagIcon className="w-6 h-6 text-gray-800" />{cartItemCount > 0 && (<span className="absolute top-1 right-1 bg-[#ED1C24] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartItemCount}</span>)}</button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Routing Views */}
                    {view === ViewState.HOME && <HomeView />}
                    {view === ViewState.COLLECTION && <CollectionView />}
                    {view === ViewState.BRAND_LIST && <BrandListView />}
                    {view === ViewState.PRODUCT_DETAIL && selectedProduct && (
                        <div className="pt-24 pb-12">
                            <ProductDetailView
                                product={selectedProduct}
                                onAddToCart={handleAddToCart}
                                onBack={() => { setView(ViewState.COLLECTION); window.scrollTo(0, 0); }}
                                onSelectProduct={(p: Product) => { setSelectedProduct(p); window.scrollTo(0, 0); }}
                                isFavorite={wishlist.has(selectedProduct.id)}
                                onToggleFavorite={handleToggleWishlist}
                            />
                        </div>
                    )}
                    {view === ViewState.PROFILE && user && (
                        <div className="pt-24 pb-12">
                            <UserProfileView
                                user={user} orders={orders.filter((o: Order) => o.customerName === user.name)} wishlist={wishlist}
                                onLogout={() => { db.logoutUser(); setUser(null); setView(ViewState.HOME); }}
                                onSelectProduct={(p: Product) => { setSelectedProduct(p); setView(ViewState.PRODUCT_DETAIL); }}
                                onRemoveFromWishlist={(id: number) => handleToggleWishlist(products.find((p: Product) => p.id === id)!)}
                            />
                        </div>
                    )}

                    {/* Footer */}
                    <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200 mt-auto">
                        <div className="max-w-[1440px] mx-auto px-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                                <div><h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-900">Về NEXA MODE</h4><ul className="space-y-2 text-sm text-gray-600"><li><a href="#" className="hover:underline">Thông tin doanh nghiệp</a></li><li><a href="#" className="hover:underline">Tuyển dụng</a></li><li><a href="#" className="hover:underline">Cửa hàng</a></li></ul></div>
                                <div><h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-900">Trợ giúp</h4><ul className="space-y-2 text-sm text-gray-600"><li><a href="#" className="hover:underline">FAQ</a></li><li><a href="#" className="hover:underline">Chính sách trả hàng</a></li><li><a href="#" className="hover:underline">Chính sách bảo mật</a></li></ul></div>
                                <div><h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-900">Tài khoản</h4><ul className="space-y-2 text-sm text-gray-600"><li><a href="#" className="hover:underline">Thành viên</a></li><li><a href="#" className="hover:underline">Hồ sơ</a></li><li><a href="#" className="hover:underline">Phiếu giảm giá</a></li></ul></div>
                                <div><h4 className="font-bold text-sm uppercase tracking-wide mb-4 text-gray-900">Kết nối</h4><div className="flex space-x-4 text-gray-500"><span className="cursor-pointer hover:text-black">Facebook</span><span className="cursor-pointer hover:text-black">Instagram</span><span className="cursor-pointer hover:text-black">Youtube</span></div></div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 pt-8 border-t border-gray-200"><p>COPYRIGHT © NEXA MODE INC. ALL RIGHTS RESERVED.</p><button onClick={() => setView(ViewState.ADMIN_LOGIN)} className="hover:underline mt-2 md:mt-0">Admin Portal</button></div>
                        </div>
                    </footer>
                </>
            )}

            <button onClick={() => setIsStylistOpen(true)} className="fixed bottom-6 right-6 z-40 bg-[#ED1C24] text-white p-4 shadow-xl hover:bg-red-700 transition-colors rounded-none"><SparklesIcon className="w-6 h-6" /></button>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={handleUpdateCart} onRemoveItem={handleRemoveCart} onCheckout={handleCheckoutInit} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} onSuccess={handlePaymentSuccess} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={(u: User) => { if (u.email === 'admin@styleai.com') { setIsAuthOpen(false); setView(ViewState.ADMIN_DASHBOARD); } else { setUser(u); } }} />
            <StylistChat isOpen={isStylistOpen} onClose={() => setIsStylistOpen(false)} />
            <VisualSearchModal isOpen={isVisualSearchOpen} onClose={() => setIsVisualSearchOpen(false)} onSelectProduct={(p: Product) => { setSelectedProduct(p); setView(ViewState.PRODUCT_DETAIL); }} />
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        </div>
    );
}

export default App;