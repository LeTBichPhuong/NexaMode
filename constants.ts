import { Product, Gender } from './types';

export const CATEGORIES = ["Áo khoác", "Áo thun", "Áo sơ mi", "Quần", "Váy", "Đồ mặc nhà", "Phụ kiện"];
const COLORS = ["Đen", "Trắng", "Xám", "Navy", "Đỏ", "Be", "Nâu", "Xanh Olive", "Hồng Pastel", "Xanh Dương"];

export const BRANDS = [
    "Nexa Core",
    "Daily Flow",
    "Metro Graphic",
    "AirSense Tech",
    "HeatGuard Warm",
    "Studio Collection",
    "+N Minimalist",
    "Urban Utility",
    "Classic Denim",
    "Soft Touch"
];

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80";

// Hình ảnh cho Thương hiệu (Phong cách Tạp chí / Lookbook)
export const BRAND_IMAGES: Record<string, string> = {
    "Nexa Core": "https://images.unsplash.com/photo-1550614000-4b9519e0037a?w=800&q=80",
    "Daily Flow": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    "Metro Graphic": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    "AirSense Tech": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    "HeatGuard Warm": "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80",
    "Studio Collection": "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
    "+N Minimalist": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    "Urban Utility": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
    "Classic Denim": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    "Soft Touch": "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80"
};

// Kích thước chuẩn
const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["110", "120", "130", "140", "150", "160"];

// HÌNH ẢNH CHI TIẾT ĐẢM BẢO 100% KHÔNG THIẾU
const CATEGORY_IMAGES: Record<Gender, Record<string, string[]>> = {
    WOMEN: {
        "Áo khoác": [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
            "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80",
            "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
            "https://images.unsplash.com/photo-1559563458-52c69522130a?w=800&q=80"
        ],
        "Áo thun": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
        ],
        "Áo sơ mi": [
            "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=80",
            "https://images.unsplash.com/photo-1604006852445-099496646549?w=800&q=80",
            "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80"
        ],
        "Quần": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
            "https://images.unsplash.com/photo-1584370848010-d7cc637703e6?w=800&q=80",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"
        ],
        "Váy": [
            "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80"
        ],
        "Đồ mặc nhà": [
            "https://images.unsplash.com/photo-1605763240004-7e93b172d754?w=800&q=80",
            "https://images.unsplash.com/photo-1596356453261-0d265ae2520d?w=800&q=80",
            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
        ],
        "Phụ kiện": [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
            "https://images.unsplash.com/photo-1611010344434-297eb04dc67d?w=800&q=80"
        ]
    },
    MEN: {
        "Áo khoác": [
            "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
            "https://images.unsplash.com/photo-1551028919-ac7bcb7d715a?w=800&q=80",
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
        ],
        "Áo thun": [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"
        ],
        "Áo sơ mi": [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
            "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80"
        ],
        "Quần": [
            "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
            "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80",
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"
        ],
        "Váy": [
            "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80" // Nam mặc váy nghệ thuật/phá cách
        ],
        "Đồ mặc nhà": [
            "https://images.unsplash.com/photo-1596356453261-0d265ae2520d?w=800&q=80",
            "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80"
        ],
        "Phụ kiện": [
            "https://images.unsplash.com/photo-1521127474489-d524412fd4fb?w=800&q=80",
            "https://images.unsplash.com/photo-1627123424574-18bd03b4e985?w=800&q=80",
            "https://images.unsplash.com/photo-1589363460779-cd71c5a451cf?w=800&q=80"
        ]
    },
    KIDS: {
        "Áo khoác": ["https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&q=80", "https://images.unsplash.com/photo-1617331971708-368734a74366?w=800&q=80"],
        "Áo thun": ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80", "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80"],
        "Áo sơ mi": ["https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80"],
        "Quần": ["https://images.unsplash.com/photo-1519238263496-6361937a42d8?w=800&q=80", "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80"],
        "Váy": ["https://images.unsplash.com/photo-1621452773781-0f992fd03d50?w=800&q=80", "https://images.unsplash.com/photo-1514755187796-03f4448557a5?w=800&q=80"],
        "Đồ mặc nhà": ["https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=800&q=80"],
        "Phụ kiện": ["https://images.unsplash.com/photo-1614030424754-20155a6d3f26?w=800&q=80", "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&q=80"]
    },
    BABY: {
        "Áo khoác": ["https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80"],
        "Áo thun": ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"],
        "Áo sơ mi": ["https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80"],
        "Quần": ["https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80"],
        "Váy": ["https://images.unsplash.com/photo-1514755187796-03f4448557a5?w=800&q=80"],
        "Đồ mặc nhà": ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80"],
        "Phụ kiện": ["https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80"]
    }
};

const BASE_NAMES = {
    "Áo khoác": ["Ultra Light Down Parka", "Blocktech Rain Coat", "Áo Khoác Bomber", "Blazer Dáng Rộng"],
    "Áo thun": ["Metro Graphic Arts", "Cotton Oversized", "Áo Thun Cổ Tròn", "Áo Polo Piqué"],
    "Áo sơ mi": ["Sơ Mi Linen", "Sơ Mi Oxford", "Sơ Mi Flannel", "Sơ Mi Rayon"],
    "Quần": ["Quần Jeans Dáng Suông", "Quần Ezy Mắt Cá Chân", "Quần Short Chino", "Quần Jogger Nỉ"],
    "Váy": ["Váy Xếp Ly Dài", "Đầm Sơ Mi", "Chân Váy Chữ A", "Váy Rayon In Hoa"],
    "Đồ mặc nhà": ["Bộ Pyjama Satin", "Bộ Mặc Nhà Thoáng Khí", "Quần Nỉ Mềm", "Áo Nỉ Lounge"],
    "Phụ kiện": ["Túi Bán Nguyệt", "Mũ Lưỡi Trai Chống UV", "Thắt Lưng Da", "Túi Canvas"]
};

export const MOCK_PRODUCTS: Product[] = [];
let idCounter = 1;

const createMockProducts = () => {
    const genders: Gender[] = ['WOMEN', 'MEN', 'KIDS', 'BABY'];

    genders.forEach(gender => {
        CATEGORIES.forEach(cat => {
            const names = BASE_NAMES[cat as keyof typeof BASE_NAMES] || ["Sản phẩm Nexa"];
            const images = CATEGORY_IMAGES[gender]?.[cat] || [];

            // Đảm bảo mỗi mục luôn có ít nhất 6 sản phẩm
            const count = 6 + Math.floor(Math.random() * 4);

            for (let i = 0; i < count; i++) {
                const nameBase = names[i % names.length];

                // Lấy ảnh theo vòng lặp, nếu mảng rỗng thì mượn từ WOMEN (là mục đầy đủ nhất)
                let img = images.length > 0 ? images[i % images.length] : null;
                if (!img) {
                    const fallback = CATEGORY_IMAGES['WOMEN'][cat] || [DEFAULT_FALLBACK];
                    img = fallback[i % fallback.length];
                }

                MOCK_PRODUCTS.push({
                    id: idCounter++,
                    name: `${nameBase} ${gender === 'KIDS' ? '(Trẻ em)' : gender === 'BABY' ? '(Sơ sinh)' : ''}`,
                    brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
                    category: cat,
                    gender: gender,
                    price: (Math.floor(Math.random() * 20) + 3) * 50000 - 1000,
                    image: img,
                    description: `Sản phẩm ${nameBase} thuộc bộ sưu tập mới nhất, kết hợp sự thoải mái và phong cách hiện đại. Chất liệu được tuyển chọn kỹ lưỡng, phù hợp với mọi hoạt động hàng ngày.`,
                    colors: COLORS.sort(() => 0.5 - Math.random()).slice(0, 4),
                    sizes: (gender === 'KIDS' || gender === 'BABY') ? KIDS_SIZES : ADULT_SIZES,
                    isNew: Math.random() > 0.6,
                    isLimited: Math.random() > 0.85
                });
            }
        });
    });
};

createMockProducts();

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};