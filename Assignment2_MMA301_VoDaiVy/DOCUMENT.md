# 📖 DOCUMENT – Phân tích toàn diện dự án Assignment 2 MMA301

> **Tác giả phân tích:** GitHub Copilot  
> **Dự án:** Mini E-Commerce App – React Native / Expo  
> **Ngôn ngữ phân tích:** Tiếng Việt  

---

## MỤC LỤC

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Cấu trúc thư mục chi tiết](#2-cấu-trúc-thư-mục-chi-tiết)
3. [Cách cài đặt và chạy dự án](#3-cách-cài-đặt-và-chạy-dự-án)
4. [Luồng khởi động ứng dụng](#4-luồng-khởi-động-ứng-dụng)
5. [API DummyJSON – Nguồn dữ liệu sản phẩm](#5-api-dummyjson--nguồn-dữ-liệu-sản-phẩm)
6. [Gemini AI – Tìm kiếm bằng ngôn ngữ tự nhiên](#6-gemini-ai--tìm-kiếm-bằng-ngôn-ngữ-tự-nhiên)
7. [Luồng dữ liệu tổng thể](#7-luồng-dữ-liệu-tổng-thể)
8. [Phân tích chi tiết từng file](#8-phân-tích-chi-tiết-từng-file)
   - [index.js](#81-indexjs)
   - [App.js](#82-appjs)
   - [app.json](#83-appjson)
   - [package.json](#84-packagejson)
   - [src/constants/theme.js](#85-srcconstantsthemejs)
   - [src/constants/config.js](#86-srcconstantsconfigjs)
   - [src/context/CartContext.js](#87-srccontextcartcontextjs)
   - [src/hooks/useCart.js](#88-srchooksuseCartjs)
   - [src/hooks/useGeminiAI.js](#89-srchooksusegeminiaijs)
   - [src/components/ProductCard.js](#810-srccomponentsproductcardjs)
   - [src/components/SkeletonLoader.js](#811-srccomponentsskeletonloaderjs)
   - [src/components/CartItem.js](#812-srccomponentscartitemjs)
   - [src/components/PriceSummary.js](#813-srccomponentspricesummaryjs)
   - [src/screens/ProductListScreen.js](#814-srcscreensproductlistscreenjs)
   - [src/screens/ProductDetailScreen.js](#815-srcscreensproductdetailscreenjs)
   - [src/screens/CartScreen.js](#816-srcscreenscartscreenjs)
9. [Các tính năng và luồng sử dụng](#9-các-tính-năng-và-luồng-sử-dụng)
10. [Thư viện sử dụng](#10-thư-viện-sử-dụng)
11. [Điểm kỹ thuật quan trọng](#11-điểm-kỹ-thuật-quan-trọng)

---

## 1. Tổng quan dự án

Đây là một **ứng dụng mua sắm online thu nhỏ (Mini E-Commerce)** được xây dựng bằng **React Native + Expo**. Ứng dụng mô phỏng một cửa hàng trực tuyến với ba màn hình chính:

| Màn hình | Tên file | Mô tả |
|---|---|---|
| **Trang chủ (Shop)** | `ProductListScreen.js` | Hiển thị danh sách sản phẩm, tìm kiếm, lọc theo danh mục, gợi ý AI |
| **Chi tiết sản phẩm** | `ProductDetailScreen.js` | Xem ảnh carousel, mô tả, rating, thêm vào giỏ |
| **Giỏ hàng** | `CartScreen.js` | Quản lý item, điều chỉnh số lượng, tính tổng tiền + phí ship |

**Điểm nổi bật của dự án:**
- Dữ liệu sản phẩm lấy **thực** từ API miễn phí `dummyjson.com`
- Tích hợp **Google Gemini AI** để hiểu yêu cầu tìm kiếm bằng ngôn ngữ tự nhiên
- Quản lý state giỏ hàng toàn cục bằng **React Context + useReducer** (không cần Redux)
- Hỗ trợ **Infinite Scroll** (cuộn xuống để tải thêm sản phẩm)
- Hiệu ứng **Skeleton Loading** (shimmer animation) khi đang tải dữ liệu

---

## 2. Cấu trúc thư mục chi tiết

```
Assignment2_MMA301_VoDaiVy/          ← Root folder của dự án
│
├── index.js                         ← Entry point – Expo gọi file này đầu tiên
├── App.js                           ← Root component: setup navigation + context
├── app.json                         ← Cấu hình Expo (tên app, icon, splash, version)
├── package.json                     ← Danh sách thư viện + scripts chạy app
├── package-lock.json                ← Lock file (phiên bản chính xác của dependencies)
│
├── assets/                          ← Tải nguyên tĩnh (icon app, splash screen)
│   ├── icon.png
│   ├── splash-icon.png
│   ├── android-icon-foreground.png
│   ├── android-icon-background.png
│   ├── android-icon-monochrome.png
│   └── favicon.png
│
└── src/                             ← Toàn bộ source code chính
    │
    ├── constants/                   ← Hằng số dùng chung
    │   ├── theme.js                 ← Màu sắc, font, spacing, shadow, border radius
    │   └── config.js                ← API key Gemini AI + tên model
    │
    ├── context/                     ← React Context (global state)
    │   └── CartContext.js           ← State + actions cho giỏ hàng
    │
    ├── hooks/                       ← Custom React Hooks
    │   ├── useCart.js               ← Hook truy cập giỏ hàng từ bất kỳ component nào
    │   └── useGeminiAI.js           ← Hook gọi Gemini API để phân tích yêu cầu tìm kiếm
    │
    ├── components/                  ← UI Components tái sử dụng
    │   ├── ProductCard.js           ← Card sản phẩm trong lưới 2 cột
    │   ├── SkeletonLoader.js        ← Hiệu ứng loading giả (animated shimmer)
    │   ├── CartItem.js              ← Một dòng sản phẩm trong giỏ hàng
    │   └── PriceSummary.js          ← Thẻ tóm tắt giá + phí ship
    │
    └── screens/                     ← Màn hình chính của app
        ├── ProductListScreen.js     ← Trang chủ (màn hình đầu tiên khi mở app)
        ├── ProductDetailScreen.js   ← Chi tiết sản phẩm
        └── CartScreen.js            ← Giỏ hàng
```

---

## 3. Cách cài đặt và chạy dự án

```bash
# 1. Di chuyển vào thư mục dự án
cd Assignment2_MMA301_VoDaiVy

# 2. Cài đặt tất cả thư viện trong package.json
npm install

# 3. Chạy ứng dụng
npx expo start        # Mở Expo DevTools
npx expo start --ios  # Chạy trên iOS Simulator
npx expo start --android  # Chạy trên Android Emulator
```

---

## 4. Luồng khởi động ứng dụng

Khi người dùng mở app, Expo thực thi theo thứ tự:

```
📱 Expo Runtime (hệ thống)
   │
   ▼
index.js  ──►  registerRootComponent(App)
                   │
                   ▼
              App.js
              ├── CartProvider     ← Tạo giỏ hàng rỗng trong RAM
              └── NavigationContainer
                      └── AppNavigator (Stack.Navigator)
                              ├── ProductListScreen  ← Màn hình đầu tiên
                              ├── ProductDetailScreen
                              └── CartScreen
```

**Tại sao `CartProvider` phải bọc ngoài `NavigationContainer`?**

Vì `CartHeaderButton` (icon giỏ hàng trên header) cần dùng cả `useCart()` lẫn `navigation`. Nếu `NavigationContainer` nằm ngoài `CartProvider`, thì `CartHeaderButton` sẽ không đọc được state giỏ hàng.

---

## 5. API DummyJSON – Nguồn dữ liệu sản phẩm

### 5.1 DummyJSON là gì?

`https://dummyjson.com/products` là một **REST API miễn phí, không cần đăng ký, không cần API key**. Nó chứa ~194 sản phẩm demo thuộc nhiều danh mục (điện thoại, laptop, quần áo, mỹ phẩm, nội thất…).

### 5.2 Các endpoint đang sử dụng trong dự án

```
Base URL: https://dummyjson.com/products
```

| HTTP Method | Endpoint | Tham số | Mục đích trong app |
|---|---|---|---|
| `GET` | `/products` | `limit=10&skip=0` | Tải 10 sản phẩm đầu tiên khi mở app |
| `GET` | `/products` | `limit=10&skip=10` | Tải thêm trang 2, 3, 4... (infinite scroll) |
| `GET` | `/products/search` | `q=laptop&limit=200` | Tìm kiếm theo từ khóa |
| `GET` | `/products/category/{slug}` | `limit=200` | Lọc sản phẩm theo danh mục |

**Ví dụ URL thực tế:**
```
https://dummyjson.com/products?limit=10&skip=0          → Trang 1
https://dummyjson.com/products?limit=10&skip=10         → Trang 2
https://dummyjson.com/products/search?q=laptop          → Tìm "laptop"
https://dummyjson.com/products/category/smartphones     → Lọc điện thoại
https://dummyjson.com/products/category/laptops         → Lọc laptop
https://dummyjson.com/products/category/womens-dresses  → Lọc váy đầm
```

### 5.3 Cấu trúc JSON một sản phẩm trả về

```json
{
  "id": 1,
  "title": "iPhone 9",
  "description": "An apple mobile which is nothing like apple",
  "price": 549.99,
  "discountPercentage": 12.96,
  "rating": 4.69,
  "stock": 94,
  "brand": "Apple",
  "category": "smartphones",
  "thumbnail": "https://cdn.dummyjson.com/product-data/images/1/thumbnail.webp",
  "images": [
    "https://cdn.dummyjson.com/product-data/images/1/1.webp",
    "https://cdn.dummyjson.com/product-data/images/1/2.webp"
  ],
  "tags": ["smartphones", "Apple"],
  "returnPolicy": "30 days return policy",
  "shippingInformation": "Ships in 1 month",
  "warrantyInformation": "1 year warranty"
}
```

### 5.4 Dữ liệu response tổng thể (khi fetch list)

```json
{
  "products": [ ...mảng sản phẩm... ],
  "total": 194,    ← Tổng số sản phẩm trong DB
  "skip": 0,       ← Đã bỏ qua bao nhiêu sản phẩm
  "limit": 10      ← Giới hạn mỗi lần lấy
}
```

### 5.5 Category slugs hợp lệ của DummyJSON

Các category slug mà dự án đang dùng:

| Slug (dùng trong URL) | Tên hiển thị |
|---|---|
| `smartphones` | Điện thoại |
| `laptops` | Laptop |
| `mens-watches` | Đồng hồ nam |
| `womens-dresses` | Váy đầm |
| `beauty` | Làm đẹp |
| `home-decoration` | Trang trí nhà |
| `skin-care` | Chăm sóc da |
| `fragrances` | Nước hoa |

### 5.6 Dữ liệu giỏ hàng – Không có API

Giỏ hàng **không gọi bất kỳ API nào**. Toàn bộ được lưu trong **React state (RAM)** qua `CartContext`. Khi tắt app, giỏ hàng bị xóa sạch.

Cấu trúc mỗi item trong giỏ:
```js
{
  id:       "1",             // String (convert từ number của API)
  name:     "iPhone 9",     // Lấy từ product.title
  price:    549.99,          // Lấy từ product.price
  image:    "https://...",  // Lấy từ product.thumbnail
  category: "smartphones",  // Lấy từ product.category
  quantity: 2               // Do CartContext tự quản lý
}
```

---

## 6. Gemini AI – Tìm kiếm bằng ngôn ngữ tự nhiên

### 6.1 Mục đích

Cho phép người dùng gõ yêu cầu kiểu: *"Tôi muốn mua điện thoại dưới 500 đô"* và hệ thống tự hiểu cần tìm gì.

### 6.2 API Gemini

- **URL:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=...`
- **Model:** `gemini-2.0-flash`
- **API Key:** Lưu trong `src/constants/config.js`
- **Phương thức:** `POST` với body JSON
- **Phí:** Google cấp quota miễn phí cho cá nhân

### 6.3 Luồng xử lý chi tiết

```
Người dùng gõ: "Tôi muốn mua laptop dưới $1000"
        │
        ▼
[Bước 1] extractPriceHint()
        →  Regex quét text, phát hiện "dưới $1000"
        →  Trả về: { value: 1000, mode: 'under' }
        │
        ▼
[Bước 2] sanitizeInput()
        →  Xóa số và ký hiệu tiền tệ khỏi text
        →  "Tôi muốn mua laptop dưới $1000" → "Tôi muốn mua laptop dưới"
        │
        ▼
[Bước 3] Gọi Gemini API (POST request)
        →  Gửi prompt kèm bảng mapping từ khóa
        →  Prompt: "User request: 'Tôi muốn mua laptop dưới'
                    Hãy trả về JSON: {keyword, explanation}"
        │
        ▼
[Bước 4] Gemini trả về JSON
        →  { "keyword": "laptop", "explanation": "User wants a laptop" }
        │
        ▼
[Bước 5] normalizeKeyword()
        →  Tra từ điển KEYWORD_NORMALIZE
        →  "laptops" → "laptop" (chuẩn hóa)
        │
        ▼
[Bước 6] Gọi DummyJSON API
        →  GET /products/search?q=laptop&limit=200
        │
        ▼
[Bước 7] Lọc theo priceHint
        →  Chỉ giữ sản phẩm có price <= 1000
        │
        ▼
[Bước 8] Hiển thị kết quả trong AI Modal
```

### 6.4 Fallback khi Gemini lỗi

Nếu API key sai hoặc Gemini trả lỗi, hệ thống dùng `extractFallbackKeyword()`:
- Tách text thành từng từ
- Bỏ stopwords ("the", "and", "for", "want"...)
- Lấy 1-2 từ có nghĩa đầu tiên
- Dùng làm keyword tìm kiếm

---

## 7. Luồng dữ liệu tổng thể

```
┌─────────────────────────────────────┐
│     INTERNET – DummyJSON API        │
│  https://dummyjson.com/products     │
└────────────────┬────────────────────┘
                 │  fetch() – HTTP GET
                 ▼
┌─────────────────────────────────────────────────────┐
│            ProductListScreen.js                     │
│                                                     │
│  Khi mở app:  fetchProducts(skip=0, replace=true)   │
│  Khi search:  searchProducts(query)                 │
│  Khi lọc:     fetch /category/{slug}                │
│  Khi scroll:  fetchProducts(skip=N, replace=false)  │
│                                                     │
│  FlatList 2 cột → ProductCard × N                   │
│    onPress → navigate('ProductDetail', {product})   │
│    onAddToCart → addToCart(cartItem)                │
└──────────────────┬──────────────────────────────────┘
                   │  addToCart({id, name, price, image, category})
                   ▼
┌─────────────────────────────────────────────────────┐
│            CartContext.js (Global state)            │
│                                                     │
│  useReducer(cartReducer, { items: [] })             │
│                                                     │
│  ADD_TO_CART:      items.push  hoặc  quantity++     │
│  REMOVE_FROM_CART: items.filter(id !== payload.id)  │
│  UPDATE_QUANTITY:  items.map  hoặc  items.filter    │
│  CLEAR_CART:       items = []                       │
└──────────────────┬──────────────────────────────────┘
                   │  useCart() → items, totalItems, totalPrice...
                   ▼
┌─────────────────────────────────────────────────────┐
│               CartScreen.js                        │
│                                                     │
│  FlatList → CartItem × N                           │
│    onIncrease → updateQuantity(id, qty+1)           │
│    onDecrease → updateQuantity(id, qty-1)           │
│    onRemove   → removeFromCart(id)                  │
│                                                     │
│  ListFooter → PriceSummary (subtotal, ship, total)  │
│  Sticky Footer → grandTotal + Checkout button       │
└─────────────────────────────────────────────────────┘

Luồng AI:
┌─────────────────────────────────────┐
│    Google Gemini API               │
│  (generativelanguage.googleapis.com)│
└──────────────┬──────────────────────┘
               │  POST /generateContent
               ▼
┌─────────────────────────────────────┐
│    useGeminiAI.js (custom hook)    │
│    analyzeRequest(text)            │
│    → keyword, explanation, price   │
└──────────────┬──────────────────────┘
               │  keyword
               ▼
┌─────────────────────────────────────┐
│    ProductListScreen – AI Modal    │
│    GET /products/search?q={keyword}│
│    Lọc theo priceHint nếu có       │
│    Hiển thị → "View All Results"   │
└─────────────────────────────────────┘
```

---

## 8. Phân tích chi tiết từng file

---

### 8.1 `index.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/index.js`

```js
import { registerRootComponent } from 'expo';  // Import từ thư viện Expo
import App from './App';                        // Import component gốc

registerRootComponent(App);
// registerRootComponent là bridge giữa Expo và React Native
// Nó gọi AppRegistry.registerComponent('main', () => App) bên trong
// Đồng thời setup môi trường đúng cho cả Expo Go và native build
```

**Vai trò:** File đơn giản nhất trong dự án. Expo tự động tìm và thực thi `index.js` khi khởi động. File này chỉ có một nhiệm vụ: đăng ký `App` là component gốc.

---

### 8.2 `App.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/App.js`

File này định nghĩa **cấu trúc khung** của toàn bộ ứng dụng. Gồm 3 component:

#### Component `CartHeaderButton`

```js
function CartHeaderButton({ navigation }) {
  const { totalItems } = useCart();
  // Lấy totalItems (tổng số lượng toàn giỏ) từ CartContext

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Cart')}  // Khi bấm → chuyển sang màn hình Cart
      style={styles.cartBtn}
      activeOpacity={0.7}   // Độ trong suốt khi nhấn (70% opacity)
    >
      <View style={styles.cartIconWrap}>
        <Text style={styles.cartIcon}>🛒</Text>   {/* Icon giỏ hàng */}
      </View>

      {totalItems > 0 && (   // Chỉ hiện badge khi có ít nhất 1 sản phẩm
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>
            {totalItems > 99 ? '99+' : totalItems}   // Giới hạn hiển thị tối đa "99+"
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
```

**Tại sao `CartHeaderButton` được tách thành component riêng?**

Vì `useCart()` chỉ hoạt động bên **trong** `CartProvider`. Nếu gọi `useCart()` trực tiếp trong `AppNavigator` mà không tách ra, sẽ bị lỗi vì `AppNavigator` có thể nằm ngoài `CartProvider`. Tách ra component riêng đảm bảo nó luôn được render bên trong `CartProvider`.

#### Component `AppNavigator`

```js
function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        // Cấu hình chung cho TẤT CẢ các màn hình trong Stack
        headerStyle:       { backgroundColor: COLORS.surface },  // Nền header trắng
        headerShadowVisible: false,         // Ẩn đường kẻ dưới header → flat design
        headerTitleStyle: {
          fontSize: FONT_SIZES.lg,           // Font size 18px
          fontWeight: FONT_WEIGHTS.bold,     // In đậm
          color: COLORS.textPrimary,         // Màu chữ tiêu đề
          letterSpacing: 0.2,               // Giãn chữ nhẹ
        },
        headerTintColor: COLORS.primary,    // Màu nút Back (mũi tên ←)
        contentStyle:    { backgroundColor: COLORS.background },  // Nền màn hình
        headerRight: () => <CartHeaderButton navigation={navigation} />,
        // → Icon 🛒 hiện ở GÓC PHẢI của mọi header
      })}
    >
      {/* Màn hình 1: Trang chủ */}
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ title: 'Shop' }}   // Tiêu đề header là "Shop"
      />

      {/* Màn hình 2: Chi tiết sản phẩm */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params?.product?.name ?? 'Detail'
          // Lấy tên sản phẩm từ params để làm tiêu đề header
          // Nếu không có → dùng "Detail"
        })}
      />

      {/* Màn hình 3: Giỏ hàng */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'My Cart',
          headerRight: () => null   // OVERRIDE: Ẩn icon giỏ hàng ở màn hình Cart (không cần)
        }}
      />
    </Stack.Navigator>
  );
}
```

#### Component gốc `App`

```js
export default function App() {
  return (
    <CartProvider>                    {/* Layer 1: Tạo global state giỏ hàng */}
      <NavigationContainer>           {/* Layer 2: Cho phép điều hướng giữa màn hình */}
        <StatusBar style="dark" backgroundColor={COLORS.surface} />
        {/* StatusBar: Thanh trạng thái trên cùng của điện thoại */}
        {/* style="dark" → chữ/icon status bar màu đen (phù hợp nền sáng) */}
        <AppNavigator />              {/* Layer 3: Định nghĩa các màn hình */}
      </NavigationContainer>
    </CartProvider>
  );
}
```

**Tại sao thứ tự bọc là `CartProvider > NavigationContainer > AppNavigator`?**

- `CartProvider` ở ngoài cùng → mọi component con (kể cả navigation) đều đọc được giỏ hàng
- `NavigationContainer` bên trong → navigation có thể dùng giỏ hàng via `useCart()`
- Đây là pattern tiêu chuẩn: **Providers (context) luôn bọc ngoài NavigationContainer**

---

### 8.3 `app.json`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/app.json`

File cấu hình metadata của ứng dụng Expo:

```json
{
  "expo": {
    "name": "Assignment2_MMA301_VoDaiVy",  // Tên app hiển thị trên thiết bị
    "slug": "Assignment2_MMA301_VoDaiVy",  // ID unique dùng để publish lên Expo
    "version": "1.0.0",                    // Phiên bản app
    "orientation": "portrait",             // Chỉ cho phép màn hình dọc
    "icon": "./assets/icon.png",           // Icon app (512×512px)
    "userInterfaceStyle": "light",         // Tắt dark mode (chỉ dùng light theme)
    "splash": {
      "image": "./assets/splash-icon.png", // Ảnh splash screen khi mở app
      "resizeMode": "contain",             // Giữ tỉ lệ ảnh
      "backgroundColor": "#ffffff"         // Nền trắng splash
    },
    "ios": {
      "supportsTablet": true              // Cho phép chạy trên iPad
    },
    "android": {
      "adaptiveIcon": {                   // Icon thích nghi cho Android
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "...",
        "backgroundImage": "...",
        "monochromeImage": "..."
      }
    }
  }
}
```

---

### 8.4 `package.json`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/package.json`

```json
{
  "name": "assignment2_mma301_vodaivy",
  "version": "1.0.0",
  "main": "index.js",          // File entry point
  "scripts": {
    "start":   "expo start",        // Khởi động Expo DevTools
    "android": "expo start --android",
    "ios":     "expo start --ios",
    "web":     "expo start --web"
  },
  "dependencies": {
    "@react-navigation/native":       "^7.0.14",  // Navigation core
    "@react-navigation/native-stack": "^7.2.0",   // Stack navigator
    "expo":                           "~54.0.0",  // Expo framework
    "expo-linear-gradient":           "~15.0.8",  // Hiệu ứng gradient màu
    "expo-status-bar":                "~3.0.9",   // Điều khiển status bar
    "react":                          "19.1.0",   // React core
    "react-native":                   "0.81.5",   // React Native core
    "react-native-safe-area-context": "~5.6.0",  // Xử lý notch/safe area
    "react-native-screens":           "~4.16.0"  // Native screen optimization
  }
}
```

---

### 8.5 `src/constants/theme.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/constants/theme.js`

File này định nghĩa **Design System** của ứng dụng – tất cả giá trị thiết kế dùng chung.

```js
// ── Bảng màu ──────────────────────────────────────────────────────────────────
export const COLORS = {
  // Màu chủ đạo (Indigo-Blue family)
  primary:      '#4F63D2',  // Màu brand chính – xanh lam/indigo đậm
  primaryDark:  '#3A4EB8',  // Trạng thái pressed/active (tối hơn 10%)
  primaryLight: '#EEF0FD',  // Nền tông nhạt (dùng cho button outline, badge)

  // Màu nhấn
  accent: '#6C63FF',        // Tím-xanh nổi bật (dùng cho tổng tiền, highlight)

  // Nền
  background: '#F8F9FA',    // Off-white – nền các màn hình (không trắng tinh)
  surface:    '#FFFFFF',    // Trắng tinh – card, modal, header
  border:     '#E9ECEF',    // Màu viền và đường kẻ

  // Văn bản
  textPrimary:   '#212529', // Tiêu đề và body text – xám rất đậm
  textSecondary: '#6C757D', // Mô tả phụ, caption – xám trung
  textDisabled:  '#ADB5BD', // Placeholder, disabled – xám nhạt

  // Semantic (có ý nghĩa)
  success: '#28A745',       // Xanh lá – Free shipping, thành công
  warning: '#FFC107',       // Vàng – cảnh báo
  error:   '#DC3545',       // Đỏ – lỗi, nút xóa
  info:    '#17A2B8',       // Xanh nhạt – thông tin
};

// ── Kích thước font ────────────────────────────────────────────────────────────
export const FONT_SIZES = {
  xs:   11,   // Rất nhỏ – badge, label phụ
  sm:   13,   // Nhỏ – category, caption
  md:   15,   // Vừa – body text thông thường
  base: 16,   // Base – kích thước chuẩn
  lg:   18,   // Lớn – tiêu đề section, tab title
  xl:   22,   // Rất lớn – tiêu đề màn hình
  xxl:  28,   // Heading lớn
  huge: 34,   // Cực lớn
};

// ── Độ đậm font ───────────────────────────────────────────────────────────────
export const FONT_WEIGHTS = {
  regular:   '400', // Bình thường
  medium:    '500', // Hơi đậm
  semiBold:  '600', // Nửa đậm
  bold:      '700', // Đậm
  extraBold: '800', // Rất đậm
};

// ── Khoảng cách (padding/margin) ─────────────────────────────────────────────
export const SPACING = {
  xs:   4,   // 4px
  sm:   8,   // 8px
  md:   12,  // 12px
  base: 16,  // 16px (chuẩn)
  lg:   20,  // 20px
  xl:   24,  // 24px
  xxl:  32,  // 32px
  huge: 48,  // 48px
};

// ── Bo góc ────────────────────────────────────────────────────────────────────
export const RADIUS = {
  sm:   6,   // Bo nhẹ – button nhỏ
  md:   10,  // Bo vừa – card nhỏ
  lg:   16,  // Bo lớn – card chính
  xl:   24,  // Bo rất lớn
  full: 999, // Bo tròn hoàn toàn – pill button, badge
};

// ── Đổ bóng ───────────────────────────────────────────────────────────────────
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },  // Bóng nhỏ phía dưới
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,  // Android elevation
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
  lg: { ... }  // Bóng lớn cho modal/hero
};
```

**Tại sao cần file này?**

Thay vì viết `color: '#4F63D2'` rải rác khắp 16 file, ta import `COLORS.primary`. Nếu sau này muốn đổi màu chủ đạo của toàn app, chỉ cần sửa **1 dòng** trong file này, toàn bộ app tự cập nhật.

---

### 8.6 `src/constants/config.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/constants/config.js`

```js
export const GEMINI_API_KEY = 'AIzaSyA8HYBeSCWZi_XcQCJbsVlQdQ54hOHqSsY';
// API key để xác thực với Google Gemini API
// ⚠️ CẢNH BÁO BẢO MẬT: Trong ứng dụng production thực tế, KHÔNG được để
// API key trong client-side code như thế này. Cần gọi qua backend server.

export const GEMINI_MODEL = 'gemini-2.0-flash';
// Tên model Gemini sẽ dùng
// gemini-2.0-flash: Model nhanh, tối ưu cho tác vụ nhỏ (phân tích text ngắn)
// Các model khác: gemini-1.5-pro, gemini-1.5-flash
```

---

### 8.7 `src/context/CartContext.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/context/CartContext.js`

File quan trọng nhất về quản lý state. Dùng pattern **Context + useReducer** (tương đương Redux nhưng built-in, không cần thư viện ngoài).

#### Phần 1: State ban đầu

```js
const initialState = {
  items: []
  // Mảng rỗng – ban đầu giỏ hàng không có gì
  // Mỗi phần tử sẽ có dạng: { id, name, price, image, category, quantity }
};
```

#### Phần 2: Định nghĩa Action Types

```js
export const CART_ACTIONS = {
  ADD_TO_CART:      'ADD_TO_CART',      // Thêm sản phẩm vào giỏ
  REMOVE_FROM_CART: 'REMOVE_FROM_CART', // Xóa hoàn toàn một sản phẩm
  UPDATE_QUANTITY:  'UPDATE_QUANTITY',  // Thay đổi số lượng (0 → tự xóa)
  CLEAR_CART:       'CLEAR_CART',       // Xóa toàn bộ giỏ hàng
};
// Export để các component khác có thể dispatch đúng action type
```

#### Phần 3: Reducer Function (Logic xử lý state)

```js
function cartReducer(state, action) {
  // state: state hiện tại { items: [...] }
  // action: { type: '...', payload: {...} }

  switch (action.type) {

    case CART_ACTIONS.ADD_TO_CART: {
      // Tìm xem sản phẩm đã có trong giỏ chưa (so sánh id)
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        // Sản phẩm ĐÃ có → tăng quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity ?? 1) }
            //   ↑ Spread operator: copy toàn bộ fields, chỉ override quantity
            //   ?? 1: Nếu payload không có quantity → mặc định tăng thêm 1
            : item  // Các item khác không thay đổi
        );
        return { ...state, items: updatedItems };
        // Không mutate state trực tiếp – tạo object mới (immutability)
      }

      // Sản phẩm CHƯA có → thêm mới vào cuối mảng
      return {
        ...state,
        items: [
          ...state.items,                    // Giữ nguyên items cũ
          { ...action.payload, quantity: action.payload.quantity ?? 1 }
          // Thêm sản phẩm mới với quantity mặc định là 1
        ],
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        // filter() loại bỏ item có id trùng với payload.id
        // Giữ lại tất cả items khác
      };

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Nếu số lượng về 0 hoặc âm → xóa item luôn
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      // Nếu số lượng hợp lệ → cập nhật
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };
      // Xóa tất cả – chỉ cần đặt items thành mảng rỗng

    default:
      return state;
      // Action không nhận dạng được → trả về state không đổi
  }
}
```

**Reducer là gì?** Là hàm thuần túy `(state, action) → newState`. Không bao giờ thay đổi `state` trực tiếp, luôn tạo object mới. Điều này giúp React phát hiện thay đổi và re-render đúng component.

#### Phần 4: Context và Provider

```js
export const CartContext = createContext(null);
// Tạo Context object – như một "kênh truyền dữ liệu" xuyên suốt component tree
// null là giá trị mặc định khi không có Provider bao bên ngoài

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  // useReducer: giống useState nhưng dùng khi state phức tạp hơn
  // state = { items: [...] } – state hiện tại
  // dispatch = hàm để gửi action (vd: dispatch({ type: 'ADD_TO_CART', payload: {...} }))

  // Wrap dispatch thành các hàm dễ dùng hơn
  const addToCart = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
  }, []);
  // useCallback([]) – hàm này không bao giờ thay đổi (deps rỗng)
  // → Tránh tạo lại hàm mỗi lần CartProvider re-render
  // → Tối ưu hiệu suất: các component con nhận hàm này không bị re-render không cần thiết

  const removeFromCart = useCallback((id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: { id } });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
      // value: Tất cả những gì đặt ở đây đều có thể đọc từ useContext(CartContext)
    >
      {children}
      {/* children: Toàn bộ component con (trong trường hợp này là toàn bộ app) */}
    </CartContext.Provider>
  );
}
```

---

### 8.8 `src/hooks/useCart.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/hooks/useCart.js`

Custom hook bao bọc `CartContext` và tính thêm các giá trị dẫn xuất (derived values).

```js
export default function useCart() {
  const context = useContext(CartContext);
  // Đọc value từ CartContext.Provider gần nhất trong component tree

  if (!context) {
    throw new Error('useCart must be used within a <CartProvider>');
    // Bảo vệ: Nếu dùng hook này ngoài CartProvider sẽ báo lỗi rõ ràng
    // Thay vì bị lỗi khó debug sau đó
  }

  const { state, addToCart, removeFromCart, updateQuantity, clearCart } = context;

  // ── Các giá trị tính toán (Derived Values) ──────────────────────────────────

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
    // Chỉ tính lại khi state.items thay đổi
    // Ví dụ: [{qty:2}, {qty:3}] → 2+3 = 5
  );

  const totalPrice = useMemo(
    () => state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    [state.items]
    // Ví dụ: [{price:10, qty:2}, {price:5, qty:3}] → 10*2 + 5*3 = 35
  );

  const formattedTotalPrice = useMemo(
    () => totalPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }),
    [totalPrice]
    // toLocaleString: Convert 549.99 → "$549.99"
    // minimumFractionDigits: 2 → luôn có 2 chữ số thập phân (vd: "$10.00" không phải "$10")
  );

  const isEmpty = state.items.length === 0;
  // true nếu giỏ hàng rỗng – dùng để hiển thị empty state screen

  const getItemQuantity = (productId) => {
    const item = state.items.find((i) => i.id === productId);
    return item ? item.quantity : 0;
    // Trả về số lượng của sản phẩm cụ thể, 0 nếu chưa có trong giỏ
  };

  const isInCart = (productId) =>
    state.items.some((i) => i.id === productId);
  // some(): trả về true nếu có ít nhất 1 item khớp điều kiện

  return {
    items:               state.items,     // Mảng items
    isEmpty,                              // Boolean
    totalItems,                           // Số nguyên (total quantity)
    totalPrice,                           // Số thực (total USD)
    formattedTotalPrice,                  // String "$XX.XX"
    getItemQuantity,                      // Function(id) → number
    isInCart,                             // Function(id) → boolean
    addToCart,    removeFromCart,         // Actions từ context
    updateQuantity, clearCart,
  };
}
```

**`useMemo` là gì?** React hook tương tự `useCallback` nhưng cho giá trị (không phải hàm). Chỉ tính lại giá trị khi dependency thay đổi – ngăn tính lại không cần thiết mỗi lần render (ví dụ khi scroll màn hình).

---

### 8.9 `src/hooks/useGeminiAI.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/hooks/useGeminiAI.js`

Hook phức tạp nhất, xử lý tìm kiếm AI.

#### Phần 1: KEYWORD_MAP (String gửi cho Gemini)

```js
const KEYWORD_MAP = `
smartphone/mobile/phone → "phone"
laptop/computer/notebook → "laptop"
...
`;
// Chuỗi text đưa vào prompt Gemini như một "từ điển hướng dẫn"
// Gemini đọc bảng này để biết: khi user nói "mobile" thì phải trả về "phone"
// Vì DummyJSON chỉ hiểu "phone", không hiểu "mobile" hay "smartphone"
```

#### Phần 2: KEYWORD_NORMALIZE (Object tra cứu local)

```js
const KEYWORD_NORMALIZE = {
  smartphone: 'phone', smartphones: 'phone', mobiles: 'phone',
  laptops: 'laptop', computer: 'laptop', notebooks: 'laptop',
  dresses: 'dress', 'womens dresses': 'dress',
  // ... ~60 entries
};
// Sau khi Gemini trả về, dùng object này để chuẩn hóa thêm
// Vì Gemini có thể trả về "laptops" (số nhiều) nhưng API cần "laptop"
```

#### Phần 3: Hàm `extractPriceHint` (export, có thể dùng bên ngoài)

```js
export function extractPriceHint(raw) {
  const t = (raw ?? '').toLowerCase().replace(/,/g, '');
  // Chuyển về chữ thường, xóa dấu phẩy (1,999 → 1999)

  let m;

  // Pattern: "under/below/less than $500"  hoặc "< $500"
  m = t.match(/(?:under|below|less\s+than|<)\s*\$?\s*([\d.]+)/);
  if (m) return { value: parseFloat(m[1]), mode: 'under' };

  // Pattern: "over/above/more than $100"
  m = t.match(/(?:over|above|more\s+than|greater\s+than|>)\s*\$?\s*([\d.]+)/);
  if (m) return { value: parseFloat(m[1]), mode: 'over' };

  // Pattern: "$200 bag"  →  mode 'around' (gần khoảng đó)
  m = t.match(/\$\s*([\d.]+)/);
  if (m) return { value: parseFloat(m[1]), mode: 'around' };

  // Pattern: "200$"
  m = t.match(/([\d.]+)\s*\$/);
  if (m) return { value: parseFloat(m[1]), mode: 'around' };

  // Pattern: "200 usd/vnd/eur"
  m = t.match(/([\d.]+)\s*(?:usd|vnd|eur|gbp|đ)/);
  if (m) return { value: parseFloat(m[1]), mode: 'around' };

  // Số đơn độc >= 10 (có thể là giá tiền)
  m = t.match(/\b(\d{2,}(?:\.\d+)?)\b/);
  if (m && parseFloat(m[1]) >= 10) return { value: parseFloat(m[1]), mode: 'around' };

  return null; // Không phát hiện giá
}
```

#### Phần 4: Hàm `sanitizeInput` (private)

```js
function sanitizeInput(raw) {
  return (raw ?? '')
    .replace(/\$[\d,. ]+/g, '')        // Xóa "$1999.99" hoặc "$ 200"
    .replace(/[\d,.]+\s*\$/g, '')      // Xóa "1999.99$"
    .replace(/[\d,.]+\s*(usd|vnd|eur|gbp|đ|usd)/gi, '') // Xóa "200 USD"
    .replace(/\b\d[\d,.]*\b/g, '')     // Xóa số đứng độc lập
    .replace(/\s{2,}/g, ' ')           // Xóa khoảng trắng thừa
    .trim();
  // Ví dụ: "laptop under $1000" → "laptop under"
  // Gửi lên Gemini chỉ phần "loại sản phẩm", không có budget
  // Để Gemini không bị phân tâm bởi con số
}
```

#### Phần 5: Hàm `normalizeKeyword` (private)

```js
function normalizeKeyword(kw) {
  // Bước 1: Xóa số/ký tự tiền tệ còn sót từ Gemini output
  const stripped = (kw ?? '')
    .toLowerCase()
    .replace(/[\d$€£₫,.]+/g, '')  // Xóa "laptop 1999" → "laptop"
    .trim();

  // Bước 2: Tra exact match
  if (KEYWORD_NORMALIZE[stripped]) return KEYWORD_NORMALIZE[stripped];

  // Bước 3: Tách từng từ và tra (xử lý "womens dresses" → tra "dresses" → "dress")
  const words = stripped.split(/\s+/);
  for (const w of words) {
    if (KEYWORD_NORMALIZE[w]) return KEYWORD_NORMALIZE[w];
  }

  // Bước 4: Không tìm được → trả về nguyên
  return stripped;
}
```

#### Phần 6: PROMPT_TEMPLATE (Prompt gửi Gemini)

```js
const PROMPT_TEMPLATE = (userRequest) =>
  `You are a product-search assistant for an online store...

Mapping (user concept → search term to use):
${KEYWORD_MAP}

User request: "${userRequest}"

Rules:
1. IGNORE all prices, numbers, currencies...
2. Focus ONLY on the product type/category mentioned.
3. Your "keyword" MUST be EXACTLY one of the quoted strings...
4. Do NOT include numbers, plural forms, possessives...
5. If the request matches nothing, default to "phone".

Respond ONLY with this exact JSON (no markdown, no code fences):
{"keyword":"exact quoted term","explanation":"one short sentence"}`;

// Prompt engineering kỹ càng:
// - Cho Gemini vai trò cụ thể ("product-search assistant")
// - Cung cấp bảng mapping từ khóa
// - Rules rõ ràng để ngăn hallucination
// - Bắt buộc output JSON thuần (không markdown)
```

#### Phần 7: Hook `useGeminiAI` (main export)

```js
export default function useGeminiAI() {
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState(null);

  const analyzeRequest = useCallback(async (userRequest) => {
    if (!userRequest?.trim()) return null;

    const priceHint      = extractPriceHint(userRequest); // Trích xuất giá TRƯỚC
    const cleanedRequest = sanitizeInput(userRequest);    // Xóa số để gửi Gemini

    // Fallback: Nếu API key không được cấu hình
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      const keyword = normalizeKeyword(extractFallbackKeyword(cleanedRequest));
      return { keyword, explanation: `Searching for: "${keyword}"`, priceHint };
    }

    setLoading(true);
    setError(null);

    try {
      // Gọi Gemini API
      const res = await fetch(GEMINI_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: PROMPT_TEMPLATE(cleanedRequest) }] }],
          generationConfig: {
            temperature: 0.1,     // Gần 0 = ít sáng tạo, nhiều chính xác
            maxOutputTokens: 120, // Giới hạn output ngắn gọn (chỉ cần 1 JSON nhỏ)
          },
        }),
      });

      if (!res.ok) throw new Error(`Gemini ${res.status}`);

      const data    = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      // Optional chaining (?.) để tránh crash nếu response thiếu fields

      // Xử lý markdown code fence một số model Gemini tự thêm vào
      const cleaned   = rawText.replace(/```json|```/gi, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*?\}/); // Tìm {...}
      if (!jsonMatch) throw new Error('No JSON block in AI response');

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.keyword) throw new Error('AI response missing keyword');

      return {
        keyword:     normalizeKeyword(parsed.keyword),
        explanation: parsed.explanation.trim(),
        priceHint,
      };
    } catch (err) {
      setError(err.message);
      // Fallback khi Gemini lỗi: tự extract từ text
      const keyword = normalizeKeyword(extractFallbackKeyword(cleanedRequest));
      return { keyword, explanation: `Searching for: "${keyword}"`, priceHint };
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyzeRequest, loading, error };
}
```

#### Phần 8: Hàm `extractFallbackKeyword` (backup)

```js
const STOPWORDS = new Set([
  'a','an','the','i','me','my','want','need','find','show','give','get','buy',
  'looking','for','some','any','best','good','cheap','under','over','about',
  'with','without','can','you','please','would','like','around','less','more',
  'product','item','things','stuff','price','budget','cost',
]);
// Set: cấu trúc dữ liệu tìm kiếm O(1) – nhanh hơn Array.includes()

function extractFallbackKeyword(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  // 1. Lowercase tất cả
  // 2. Xóa ký tự đặc biệt (chỉ giữ chữ cái, số, khoảng trắng)
  // 3. Split thành mảng từng từ

  const meaningful = words.filter(
    w => w.length >= 3           // Bỏ từ ngắn hơn 3 ký tự
      && !STOPWORDS.has(w)       // Bỏ stopwords
      && !/^\d+$/.test(w)        // Bỏ số thuần túy (giá tiền đã sót lại)
  );

  return meaningful.slice(0, 2).join(' ') // Lấy tối đa 2 từ đầu tiên có nghĩa
    || text.trim().split(/\s+/).slice(0, 2).join(' '); // Fallback: 2 từ đầu kể cả stopword
}
```

---

### 8.10 `src/components/ProductCard.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/components/ProductCard.js`

#### Sub-component `StarRating`

```js
function StarRating({ rating = 0 }) {
  const full  = Math.floor(rating);           // Số sao đầy (vd: 4.3 → floor = 4)
  const half  = rating - full >= 0.5;         // Có sao nửa? (4.6 - 4 = 0.6 >= 0.5 → true)
  const empty = 5 - full - (half ? 1 : 0);   // Số sao trống (5 - 4 - 1 = 0)

  return (
    <View style={sr.row}>
      {Array(full).fill(0).map((_, i) => (
        <Text key={`f${i}`} style={sr.star}>★</Text>   // Sao vàng đầy
      ))}
      {half && <Text style={[sr.star, sr.half]}>★</Text>}  // Sao nửa (opacity 0.5)
      {Array(empty).fill(0).map((_, i) => (
        <Text key={`e${i}`} style={sr.empty}>★</Text>  // Sao xám trống
      ))}
      <Text style={sr.label}>{rating.toFixed(1)}</Text> // Số điểm "4.3"
    </View>
  );
}
```

#### Component chính `ProductCard`

```js
function ProductCard({ product, onPress, onAddToCart }) {
  // Destructure props của product
  const { title, price, thumbnail, rating, category, discountPercentage } = product;

  const hasDiscount = discountPercentage && discountPercentage > 0;
  // true nếu có giảm giá (discountPercentage tồn tại và > 0)

  const originalPrice = hasDiscount
    ? (price / (1 - discountPercentage / 100))
    : null;
  // Công thức tính giá gốc từ giá sau giảm và % giảm:
  // originalPrice = currentPrice / (1 - discountPct/100)
  // Ví dụ: price=$549, discount=12.96% → original = 549 / (1 - 0.1296) ≈ $630

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>

      {/* Vùng ảnh sản phẩm */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: thumbnail }}  // Tải ảnh từ URL (CDN của DummyJSON)
          style={styles.image}
          resizeMode="contain"         // Co ảnh vừa khung, không cắt xén
        />
        {hasDiscount && (            {/* Badge giảm giá góc trái trên */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>-{Math.round(discountPercentage)}%</Text>
          </View>
        )}
      </View>

      {/* Phần thân card */}
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <Text style={styles.category} numberOfLines={1}>{category}</Text>
          {/* numberOfLines={1}: Cắt ngắn nếu quá dài, tránh vỡ layout */}
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {/* numberOfLines={2}: Tối đa 2 dòng, minHeight: 34 đảm bảo không jitter */}
          <StarRating rating={rating} />
        </View>

        {/* Footer card: giá + nút thêm */}
        <View style={styles.footer}>
          <View style={styles.priceBlock}>
            <Text style={styles.price}>${price.toFixed(2)}</Text>
            {/* toFixed(2): luôn 2 chữ số thập phân "$549.99" */}
            <View style={styles.originalPriceSlot}>
              {/* Slot cố định chiều cao dù có hay không có giá gốc */}
              {hasDiscount && (
                <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
                // Giá gốc gạch ngang (textDecorationLine: 'line-through' trong styles)
              )}
            </View>
          </View>

          {/* Nút "+" thêm vào giỏ */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onAddToCart}      // Gọi callback từ ProductListScreen
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            // hitSlop: Mở rộng vùng chạm 8px mỗi phía → dễ bấm hơn trên mobile
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);
// memo(): Higher-Order Component (HOC) – bọc component lại
// Chỉ re-render khi props thay đổi thực sự (shallow comparison)
// QUAN TRỌNG: FlatList có thể có 50-100 cards, không có memo thì mỗi lần
// giỏ hàng thay đổi (badge trên header) → toàn bộ 100 cards re-render
```

---

### 8.11 `src/components/SkeletonLoader.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/components/SkeletonLoader.js`

Hiệu ứng placeholder animated hiển thị khi đang tải dữ liệu lần đầu.

```js
export default function SkeletonLoader({ count = 6 }) {
  // count: số lượng skeleton cards cần render (mặc định 6)

  const shimmer = useRef(new Animated.Value(0)).current;
  // useRef: Tạo Animated.Value mà không trigger re-render khi thay đổi
  // Animated.Value(0): Biến số có thể animate, ban đầu = 0

  useEffect(() => {
    const anim = Animated.loop(        // Vòng lặp vô hạn
      Animated.sequence([              // Chạy tuần tự
        // 1. Làm sáng dần (0 → 1) trong 750ms
        Animated.timing(shimmer, { toValue: 1, duration: 750, useNativeDriver: true }),
        // 2. Làm tối dần (1 → 0) trong 750ms
        Animated.timing(shimmer, { toValue: 0, duration: 750, useNativeDriver: true }),
      ])
    );
    anim.start();             // Bắt đầu animation khi component mount
    return () => anim.stop(); // Cleanup: dừng animation khi component unmount
  }, [shimmer]);              // Chỉ chạy 1 lần khi mount (shimmer không thay đổi)

  const animatedStyle = {
    opacity: shimmer.interpolate({
      inputRange:  [0, 1],       // Khi shimmer value từ 0→1
      outputRange: [0.45, 0.9],  // opacity chạy từ 45%→90%
    }),
  };
  // interpolate: Ánh xạ giá trị input sang output (hữu ích cho animation phức tạp)

  // Tạo mảng rows (mỗi row có 2 cards)
  const rows = Array(Math.ceil(count / 2)).fill(null);
  // Math.ceil(6/2) = 3 rows → 6 cards

  return (
    <View style={sk.container}>
      {rows.map((_, rowIdx) => (
        <View key={rowIdx} style={sk.row}>
          <SkeletonCard animatedStyle={animatedStyle} />
          {rowIdx * 2 + 1 < count && <SkeletonCard animatedStyle={animatedStyle} />}
          {/* Điều kiện để không render card thứ 2 ở row cuối nếu count lẻ */}
        </View>
      ))}
    </View>
  );
}
```

**`useNativeDriver: true` nghĩa là gì?**

Chạy animation trên **Native Thread** (thread riêng của thiết bị), thay vì JavaScript Thread. Điều này giúp animation mượt mà ngay cả khi JS thread bận xử lý fetch API. Chỉ hoạt động với các thuộc tính `opacity` và `transform`.

---

### 8.12 `src/components/CartItem.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/components/CartItem.js`

Component hiển thị một dòng sản phẩm trong giỏ hàng.

```js
export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  // Props:
  // item      – { id, name, price, image, category, quantity }
  // onIncrease – callback: () => updateQuantity(id, qty + 1)
  // onDecrease – callback: () => updateQuantity(id, qty - 1)
  //              Khi qty - 1 = 0, CartContext reducer tự xóa item
  // onRemove   – callback: () => removeFromCart(id)

  return (
    <View style={styles.wrap}>

      {/* ── Cột trái: Ảnh sản phẩm ── */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ fontSize: 28 }}>📦</Text>
          {/* Fallback emoji nếu không có ảnh */}
        </View>
      )}

      {/* ── Cột giữa: Thông tin sản phẩm ── */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        {/* Hàng điều chỉnh số lượng: [ − ] [2] [ + ] */}
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Cột phải: Tổng tiền dòng + nút xóa ── */}
      <View style={styles.right}>
        <Text style={styles.lineTotal}>
          ${(item.price * item.quantity).toFixed(2)}
          {/* Line total = đơn giá × số lượng */}
        </Text>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.removeBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

### 8.13 `src/components/PriceSummary.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/components/PriceSummary.js`

#### Hàm `calcShipping` (named export – dùng cả ở CartScreen)

```js
export function calcShipping(totalPrice, totalQty) {
  // Logic tính phí ship:
  if (totalPrice >= 50 || totalQty >= 5) return 0;    // Đủ điều kiện → FREE
  if (totalPrice >= 25) return 2.99;                   // Trung bình → $2.99
  return 5.99;                                         // Thấp nhất → $5.99
}
```

| Điều kiện | Phí ship |
|---|---|
| Tổng tiền ≥ $50 **HOẶC** ≥ 5 items | FREE (miễn phí) |
| Tổng tiền $25 – $49.99 | $2.99 |
| Tổng tiền < $25 | $5.99 |

#### Component `PriceSummary`

```js
export default function PriceSummary({ items, totalPrice, formattedTotalPrice }) {
  const totalQty   = items.reduce((s, i) => s + i.quantity, 0);
  const shipping   = calcShipping(totalPrice, totalQty);
  const grandTotal = totalPrice + shipping;

  // Tính khoảng còn thiếu để đạt free ship
  const priceLeft   = Math.max(0, 50 - totalPrice); // VD: totalPrice=$30 → cần $20 nữa
  const qtyLeft     = Math.max(0, 5 - totalQty);    // VD: 3 items → cần 2 items nữa
  const progressPct = Math.min(1, totalPrice / 50); // 0.0 → 1.0 (progress bar)
  // Math.min(1, ...): Tránh vượt quá 100% nếu totalPrice > $50

  // Logic gợi ý nào dễ đạt free ship hơn:
  // Giả sử mỗi item trung bình $10 → qtyLeft * 10 tương đương tiền cần thêm
  // Nếu priceLeft ≤ qtyLeft × 10 → gợi ý thêm tiền (dễ hơn)
  // Ngược lại → gợi ý thêm item

  return (
    <View style={styles.card}>
      {/* Dòng Subtotal */}
      <View style={styles.row}>
        <Text>Subtotal ({totalQty} items)</Text>
        <Text>{formattedTotalPrice}</Text>
      </View>

      {/* Dòng Shipping */}
      <View style={styles.row}>
        <Text>Shipping</Text>
        <Text style={shipping === 0 ? styles.free : null}>
          {shipping === 0 ? 'FREE 🎉' : `$${shipping.toFixed(2)}`}
        </Text>
      </View>

      {/* Progress bar – chỉ hiện khi chưa FREE */}
      {shipping > 0 && (
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${Math.round(progressPct * 100)}%` }]} />
          </View>
          <Text style={styles.shippingNote}>
            {priceLeft <= qtyLeft * 10
              ? `Add $${priceLeft.toFixed(2)} more to get FREE shipping`
              : `Add ${qtyLeft} more item${qtyLeft !== 1 ? 's' : ''} to get FREE shipping`}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Dòng Grand Total */}
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          {grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </Text>
      </View>
    </View>
  );
}
```

---

### 8.14 `src/screens/ProductListScreen.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/screens/ProductListScreen.js`

Màn hình phức tạp nhất của ứng dụng – trang chủ.

#### Hằng số và cấu hình

```js
const LIMIT    = 10;     // Số sản phẩm mỗi lần fetch (pagination)
const BASE_URL = 'https://dummyjson.com/products';

// Chips cố định trong AI Modal (bypass Gemini – gọi thẳng /category/)
const AI_SUGGESTION_CHIPS = [
  { label: '📱 smartphones < $500', category: 'smartphones',    priceHint: { mode: 'under', value: 500 } },
  { label: '💻 Laptop < $1,999',   category: 'laptops',        priceHint: { mode: 'under', value: 1999 } },
  { label: '💄 Skincare',          category: 'skin-care' },
  { label: "👗 Women's Dresses < $50", category: 'womens-dresses', priceHint: { mode: 'under', value: 50 } },
  { label: "⌚ Men's Watches",      category: 'mens-watches' },
  { label: '🌸 Fragrances',        category: 'fragrances' },
];

// Chips lọc danh mục (thanh scroll ngang)
const CATEGORIES = [
  { emoji: '✦', name: 'All',     value: '' },  // value rỗng = tải tất cả
  { emoji: '📱', name: 'Phones', value: 'smartphones' },
  { emoji: '💻', name: 'Laptop', value: 'laptops' },
  { emoji: '⌚', name: 'Watches', value: 'mens-watches' },
  { emoji: '👗', name: 'Dresses', value: 'womens-dresses' },
  { emoji: '💄', name: 'Beauty',  value: 'beauty' },
  { emoji: '🛋', name: 'Home',   value: 'home-decoration' },
];
```

#### State variables

```js
// Data State
const [products,    setProducts   ] = useState([]);    // Danh sách sản phẩm hiển thị
const [loading,     setLoading    ] = useState(true);  // Đang tải lần đầu? (hiện skeleton)
const [loadingMore, setLoadingMore] = useState(false); // Đang tải thêm? (hiện spinner cuối list)
const [skip,        setSkip       ] = useState(0);     // Đã load bao nhiêu item rồi (pagination)
const [total,       setTotal      ] = useState(0);     // Tổng số item (từ API)
const [error,       setError      ] = useState(null);  // Thông báo lỗi

// Search State
const [searchQuery, setSearchQuery] = useState('');    // Text trong search bar
const [searching,   setSearching  ] = useState(false); // Đang tìm kiếm?
const searchTimeout                 = useRef(null);    // Debounce timer ref

// AI Modal State
const [aiModalVisible,  setAiModalVisible ] = useState(false);  // Modal mở/đóng?
const [aiInput,         setAiInput        ] = useState('');     // Text nhập trong modal
const [aiStep,          setAiStep         ] = useState('input');// 'input'|'thinking'|'results'
const [aiResults,       setAiResults      ] = useState([]);     // Kết quả AI tìm được
const [aiResultKeyword, setAiResultKeyword] = useState('');     // Keyword AI đã dùng
const [aiResultExpl,    setAiResultExpl   ] = useState('');     // Giải thích từ Gemini

// UI State
const [activeCategory, setActiveCategory] = useState(''); // Category chip đang active
const [aiKeyword,      setAiKeyword      ] = useState(''); // Chip kết quả AI trên màn hình chính
```

#### Fetch Functions

```js
const fetchProducts = useCallback(async (currentSkip = 0, replace = false) => {
  try {
    // replace=true → loading skeleton, replace=false → spinner cuối list
    replace ? setLoading(true) : setLoadingMore(true);
    setError(null);

    const res  = await fetch(`${BASE_URL}?limit=${LIMIT}&skip=${currentSkip}`);
    // URL ví dụ: https://dummyjson.com/products?limit=10&skip=0

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // data = { products: [...], total: 194, skip: 0, limit: 10 }

    setProducts(prev =>
      replace ? data.products         // replace → xóa cũ, dùng mới
              : [...prev, ...data.products]  // append → giữ cũ, thêm mới
    );
    setTotal(data.total);              // 194 sản phẩm tổng cộng
    setSkip(currentSkip + data.products.length); // skip tiếp theo = 0 + 10 = 10
  } catch (e) {
    setError('Failed to load products. Tap Retry.');
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
}, []);

const searchProducts = useCallback(async (query) => {
  try {
    setSearching(true);
    const res  = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&limit=200`);
    // encodeURIComponent: Encode URL-safe (vd: "men's watch" → "men%27s%20watch")
    // limit=200: Lấy nhiều nhất có thể để lọc client-side phía dưới

    const data = await res.json();

    // ── Client-side extra filter ──────────────────────────────────────────────
    // DummyJSON đôi khi trả về kết quả mờ nhạt (fuzzy search)
    // Ví dụ: search "laptop" có thể trả về "laptop bag" (túi laptop, không phải laptop thật)
    // Bộ lọc này giữ lại sản phẩm mà title/category/tags thực sự chứa từ khóa

    const lq = query.toLowerCase();
    const SKIP_WORDS = new Set(['the','and','for','under','over','with','from','best','good','some','any']);
    const qWords = lq.split(/\s+/).filter(w => w.length >= 3 && !SKIP_WORDS.has(w));
    // Ví dụ: query = "wireless headphones" → qWords = ["wireless", "headphones"]

    const filtered = data.products.filter((p) => {
      const haystack = [p.title, p.category, ...(p.tags ?? [])].join(' ').toLowerCase();
      // haystack: tiêu đề + category + tags ghép vào một chuỗi để tra
      return qWords.length > 0
        ? qWords.some(w => haystack.includes(w))  // Ít nhất 1 từ phải có trong haystack
        : haystack.includes(lq);                  // Fallback: tìm nguyên query
    });

    setProducts(filtered);
    setTotal(filtered.length);
  } catch (e) {
    setError('Search failed. Please try again.');
  } finally {
    setSearching(false);
  }
}, []);
```

#### Debounced Search Effect

```js
useEffect(() => {
  clearTimeout(searchTimeout.current); // Hủy timer cũ nếu user vẫn đang gõ

  // Guards: Bảo vệ không cho debounce ghi đè kết quả AI/category
  if (aiJustSearchedRef.current) {
    aiJustSearchedRef.current = false;
    return;
  }

  if (trimmedQuery === '') {
    fetchProducts(0, true); // Quay về trang chủ khi xóa search
    return;
  }
  if (trimmedQuery.length < 2) return; // Không search khi gõ < 2 ký tự

  // Đặt timer 500ms – chỉ gọi API sau khi user ngừng gõ
  searchTimeout.current = setTimeout(() => searchProducts(trimmedQuery), 500);
  return () => clearTimeout(searchTimeout.current); // Cleanup khi unmount
}, [trimmedQuery, fetchProducts, searchProducts]);
```

**Tại sao cần debounce?** Không muốn gọi API mỗi ký tự người dùng gõ (vd: "l-a-p-t-o-p" = 6 request). Chờ user ngừng gõ 500ms mới gọi → 1 request.

#### FAB (Floating Action Button) và AI Modal

```js
// ── FAB nhấp nháy animation ──────────────────────────────────────────────────
useEffect(() => {
  const anim = Animated.loop(
    Animated.sequence([
      Animated.timing(fabPulse, { toValue: 1.13, duration: 900, useNativeDriver: true }),
      Animated.timing(fabPulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
    ])
  );
  anim.start();
  return () => anim.stop();
}, [fabPulse]);
// FAB phóng to 13% rồi thu lại liên tục để thu hút sự chú ý

// ── AI Modal submit (gọi Gemini) ─────────────────────────────────────────────
const handleAiSubmit = async (text) => {
  const query = (typeof text === 'string' ? text : aiInput).trim();
  if (!query || aiLoading) return;

  setAiStep('thinking'); // Chuyển sang màn hình loading spinner

  const result = await analyzeRequest(query); // Gọi Gemini
  // result = { keyword: "laptop", explanation: "...", priceHint: { value: 1000, mode: "under" } }

  if (!result) { setAiStep('input'); return; }

  const res  = await fetch(`${BASE_URL}/search?q=${result.keyword}&limit=200`);
  const data = await res.json();

  // ── Lọc theo giá nếu có priceHint ────────────────────────────────────────
  let products = data.products;
  const ph = result.priceHint;
  if (ph && !isNaN(ph.value)) {
    const TOLERANCE = 0.30; // ±30% cho mode 'around'
    if (ph.mode === 'under') {
      products = products.filter(p => p.price <= ph.value);
    } else if (ph.mode === 'over') {
      products = products.filter(p => p.price >= ph.value);
    } else {
      // 'around': bracket ±30%
      products = products.filter(p =>
        p.price >= ph.value * 0.7 && p.price <= ph.value * 1.3
      );
    }
  }

  setAiResults(products);
  setAiStep('results'); // Chuyển sang màn hình hiển thị kết quả
};
```

#### Infinite Scroll

```js
const handleEndReached = () => {
  // Guard: Không load thêm khi đang search, đang load, hoặc đã hết
  if (isSearch || loadingMore || loading || skip >= total) return;
  fetchProducts(skip, false); // false = append, không replace
};

// Trong FlatList:
<FlatList
  onEndReached={handleEndReached}
  onEndReachedThreshold={0.4}
  // Kích hoạt khi còn 40% nội dung chưa cuộn tới → tải trước khi user đến cuối
/>
```

#### FlatList renderItem

```js
const renderItem = ({ item }) => (
  <ProductCard
    product={item}
    onPress={() => navigation.navigate('ProductDetail', { product: item })}
    // Khi bấm vào card → điều hướng tới ProductDetail với toàn bộ object product
    onAddToCart={() => addToCart({
      id:       String(item.id),     // Convert number → string
      name:     item.title,          // title của API → name trong cart
      price:    item.price,
      image:    item.thumbnail,
      category: item.category,
    })}
  />
);
```

---

### 8.15 `src/screens/ProductDetailScreen.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/screens/ProductDetailScreen.js`

#### Sub-component `ImageCarousel`

```js
function ImageCarousel({ images = [] }) {
  const [active, setActive] = useState(0); // Index ảnh đang hiển thị

  return (
    <View style={ic.wrapper}>
      <FlatList
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal           // Cuộn ngang
        pagingEnabled        // Snap vào từng ảnh (scroll chẵn theo width màn hình)
        showsHorizontalScrollIndicator={false}  // Ẩn thanh scroll
        onMomentumScrollEnd={(e) => {
          // Tính ảnh đang hiển thị từ contentOffset
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setActive(idx);
          // SCREEN_W: chiều rộng màn hình → mỗi ảnh chiếm đúng 1 màn hình
        }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={ic.image} resizeMode="contain" />
        )}
      />

      {/* Chấm tròn phía dưới → dot indicator */}
      {images.length > 1 && (
        <View style={ic.dots}>
          {images.map((_, i) => (
            <View key={i} style={[ic.dot, i === active && ic.dotActive]} />
            // Chấm active: rộng hơn (20px) và màu primary; còn lại nhỏ (6px) xám
          ))}
        </View>
      )}

      {/* Counter "1 / 3" ở góc phải trên */}
      {images.length > 1 && (
        <View style={ic.counter}>
          <Text style={ic.counterText}>{active + 1} / {images.length}</Text>
        </View>
      )}
    </View>
  );
}
```

#### Màn hình chính `ProductDetailScreen`

```js
export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  // Nhận object product từ ProductListScreen khi navigate('ProductDetail', { product: item })

  const { addToCart, isInCart, getItemQuantity, totalItems } = useCart();
  const inCart   = isInCart(String(product.id));      // Sản phẩm này đã trong giỏ chưa?
  const quantity = getItemQuantity(String(product.id)); // Bao nhiêu cái rồi?

  // Xử lý images: nếu mảng rỗng, dùng thumbnail làm fallback
  const images = product.images?.length ? product.images : [product.thumbnail];

  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  const handleAddToCart = () => {
    addToCart({
      id:       String(product.id),
      name:     product.title,
      price:    product.price,
      image:    product.thumbnail,
      category: product.category,
    });
  };
  // Có thể gọi nhiều lần (mỗi lần tăng quantity 1) nhờ logic trong reducer

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Carousel ảnh ── */}
        <ImageCarousel images={images} />

        <View style={styles.content}>
          {/* Category pill + Brand */}
          <View style={styles.categoryRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            {product.brand && <Text style={styles.brandText}>{product.brand}</Text>}
          </View>

          {/* Tên sản phẩm */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Rating + Stock badge */}
          <View style={styles.ratingRow}>
            <StarRow rating={product.rating} reviewCount={product.stock} />
            <View style={[styles.stockBadge, {
              backgroundColor: product.stock > 0 ? '#D1FAE5' : '#FEE2E2'
            }]}>
              <View style={[styles.stockDot, {
                backgroundColor: product.stock > 0 ? '#10B981' : '#EF4444'
              }]} />
              <Text>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</Text>
            </View>
          </View>

          {/* Giá + discount badge */}
          <View style={styles.priceBlock}>
            <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
            {hasDiscount && (
              <View style={styles.discountBadge}>
                <Text>-{Math.round(product.discountPercentage)}% OFF</Text>
              </View>
            )}
          </View>

          {/* 3 ô thông tin nhanh */}
          <View style={styles.tilesRow}>
            <InfoTile icon="📦" label="Availability" value={product.stock > 0 ? 'In Stock' : 'Sold Out'} />
            <InfoTile icon="↩️" label="Returns"      value={product.returnPolicy ?? '30-day return'} />
            <InfoTile icon="🚚" label="Shipping"     value={product.shippingInformation ?? 'Fast delivery'} />
          </View>

          {/* Mô tả */}
          <Text style={styles.sectionLabel}>About this item</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Bảo hành (nếu có trong API) */}
          {product.warrantyInformation && (
            <View style={styles.warrantyBox}>
              <Text>🛡️</Text>
              <View>
                <Text style={styles.warrantyLabel}>Warranty</Text>
                <Text>{product.warrantyInformation}</Text>
              </View>
            </View>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {product.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}># {tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Badge "✓ In your cart — 2 units" nếu đã có trong giỏ */}
          {inCart && (
            <View style={styles.inCartBadge}>
              <Text>✓  In your cart — {quantity} {quantity === 1 ? 'unit' : 'units'}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Footer cố định: Nút Add to Cart ── */}
      <View style={styles.footer}>
        {/* Nút mini icon giỏ hàng → về CartScreen */}
        <TouchableOpacity
          style={styles.cartOutlineBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartOutlineIcon}>🛒</Text>
          {totalItems > 0 && (   // Badge số item trong giỏ
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Nút Add to Cart chính */}
        <TouchableOpacity
          style={[styles.addBtn, inCart && styles.addBtnAlt]}
          onPress={handleAddToCart}
        >
          <Text style={styles.addBtnText}>
            {inCart ? '+ Add Another' : 'Add to Cart'}
            {/* Thay đổi text dựa theo trạng thái đã có trong giỏ hay chưa */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

### 8.16 `src/screens/CartScreen.js`

**Đường dẫn:** `Assignment2_MMA301_VoDaiVy/src/screens/CartScreen.js`

```js
export default function CartScreen({ navigation }) {
  const {
    items, isEmpty, totalItems, totalPrice, formattedTotalPrice,
    removeFromCart, updateQuantity, clearCart,
  } = useCart();
  // Lấy toàn bộ state và actions từ CartContext qua useCart hook

  const totalQty    = items.reduce((s, i) => s + i.quantity, 0);
  const shipping    = calcShipping(totalPrice, totalQty);  // Import từ PriceSummary.js
  const grandTotal  = totalPrice + shipping;
  const grandTotalF = grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  // ── Màn hình giỏ hàng rỗng ─────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIllustration}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>...</Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('ProductList')}
          // Nút "Continue Shopping" → quay lại trang chủ
        >
          <Text style={styles.shopBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Màn hình giỏ hàng có items ────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
            // Khi qty giảm về 0, CartContext reducer tự động xóa item
            onRemove={() => removeFromCart(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
        // Khoảng cách 8px giữa các items

        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text>{totalItems} items in cart</Text>
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearAll}>Clear All</Text>
              {/* Xóa toàn bộ giỏ hàng */}
            </TouchableOpacity>
          </View>
        }

        ListFooterComponent={
          <PriceSummary
            items={items}
            totalPrice={totalPrice}
            formattedTotalPrice={formattedTotalPrice}
          />
          // Card tóm tắt giá xuất hiện sau item cuối cùng trong list
        }
      />

      {/* ── Footer cố định ở đáy màn hình ── */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>
            Total{shipping === 0 ? ' (Free ship 🎉)' : ` (Ship $${shipping.toFixed(2)})`}
          </Text>
          <Text style={styles.footerTotalValue}>{grandTotalF}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.7}>
          <Text style={styles.checkoutBtnText}>Checkout →</Text>
          {/* Nút Checkout – hiện tại chưa có logic, chỉ là UI placeholder */}
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

## 9. Các tính năng và luồng sử dụng

### 9.1 Tính năng 1: Xem danh sách sản phẩm

```
Mở app
→ ProductListScreen mount
→ useEffect gọi fetchProducts(0, true)
→ fetch GET https://dummyjson.com/products?limit=10&skip=0
→ setLoading(true) → hiện SkeletonLoader (6 cards giả)
→ API trả về 10 sản phẩm
→ setProducts(data.products)
→ setLoading(false)
→ Ẩn SkeletonLoader, hiện FlatList với 10 ProductCard
```

### 9.2 Tính năng 2: Infinite Scroll (cuộn để tải thêm)

```
User cuộn xuống ≈ 60% list
→ FlatList.onEndReached kích hoạt
→ handleEndReached() kiểm tra: không search, không loading, skip(10) < total(194)
→ fetchProducts(skip=10, replace=false)
→ setLoadingMore(true) → hiện spinner nhỏ cuối list
→ fetch GET .../products?limit=10&skip=10
→ setProducts(prev => [...prev, ...newProducts]) → append 10 sản phẩm mới
→ skip = 20, total = 194 → còn hàng để load tiếp
```

### 9.3 Tính năng 3: Tìm kiếm sản phẩm

```
User gõ "laptop" vào search bar
→ setSearchQuery("l") → trimmedQuery.length = 1 < 2 → hiện hint "Type 1 more..."
→ gõ tiếp "a" → trimmedQuery.length = 2 ≥ 2
→ Đặt debounce timer 500ms
→ User gõ tiếp "p", "t"... mỗi lần timer reset
→ User dừng gõ (sau "laptop") → 500ms trôi qua
→ searchProducts("laptop")
→ fetch GET .../products/search?q=laptop&limit=200
→ Client-side filter: giữ sản phẩm có "laptop" trong title/category/tags
→ setProducts(filtered) → hiển thị kết quả
```

### 9.4 Tính năng 4: Lọc theo danh mục

```
User bấm chip "📱 Phones"
→ handleCategoryPress({ value: 'smartphones' })
→ aiJustSearchedRef.current = true (ngắt debounce)
→ setSearchQuery('') → xóa search bar
→ setLoading(true) → hiện skeleton
→ fetch GET .../products/category/smartphones?limit=200
→ setProducts(data.products) → hiện tất cả điện thoại
→ Chip "Phones" highlight gradient màu
```

### 9.5 Tính năng 5: Tìm kiếm bằng AI (Gemini)

```
User bấm FAB "✦ AI"
→ aiModalVisible = true → Modal slide up
→ aiStep = 'input' → hiện text input + suggestion chips

Option A (Suggestion Chip):
  User bấm chip "📱 smartphones < $500"
  → handleChipTap(chip) → aiStep = 'thinking'
  → fetch GET .../category/smartphones?limit=200
  → filter price <= 500
  → aiStep = 'results' → hiện danh sách thumbnail

Option B (Tự nhập):
  User gõ "I want a laptop under $1000"
  → bấm "✦ Search with AI"
  → handleAiSubmit()
  → extractPriceHint() → { value: 1000, mode: 'under' }
  → sanitizeInput() → "I want a laptop under"
  → analyzeRequest() → POST Gemini API
  → Gemini trả về: { keyword: "laptop" }
  → normalizeKeyword("laptop") → "laptop"
  → fetch GET .../search?q=laptop&limit=200
  → filter price <= 1000
  → aiStep = 'results'

Tiếp theo:
  User bấm "View All Results"
  → products = aiResults, aiModal đóng
  → Màn hình chính hiện kết quả AI với chip label
```

### 9.6 Tính năng 6: Thêm vào giỏ hàng

```
Từ ProductListScreen (bấm nút "+"):
  onAddToCart → addToCart({ id:'1', name:'iPhone', price:549, image:'...', category:'smartphones' })
  → CartContext dispatch(ADD_TO_CART)
  → cartReducer: item chưa có → items.push({ ...payload, quantity: 1 })
  → CartHeaderButton: totalItems tăng → badge đỏ hiện số "1"

Thêm lần 2 (cùng sản phẩm):
  → cartReducer: item ĐÃ có → items.map → quantity: 1+1=2
  → Badge hiện "2"

Từ ProductDetailScreen:
  handleAddToCart → addToCart(...)
  → Button chuyển từ "Add to Cart" → "+ Add Another"
  → Badge "✓ In your cart — 1 unit" xuất hiện
```

### 9.7 Tính năng 7: Quản lý giỏ hàng

```
CartScreen mở:
→ items từ useCart() hiện trong FlatList (CartItem × N)
→ PriceSummary hiện subtotal, shipping, progress bar, total

Tăng số lượng (bấm "+"):
  → onIncrease → updateQuantity(id, quantity + 1)
  → reducer UPDATE_QUANTITY → quantity thay đổi
  → line total tự cập nhật (price × quantity)
  → PriceSummary tự cập nhật subtotal, shipping tier

Giảm về 0 (bấm "−" đến hết):
  → updateQuantity(id, 0)
  → reducer: quantity <= 0 → filter item ra
  → Item biến mất khỏi list

Xóa (bấm 🗑):
  → removeFromCart(id)
  → reducer REMOVE_FROM_CART → filter ra

Clear All:
  → clearCart()
  → reducer CLEAR_CART → items = []
  → isEmpty = true → hiện màn hình "Your cart is empty"
```

---

## 10. Thư viện sử dụng

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| `expo` | ~54.0.0 | Framework chạy React Native, CLI, build tools |
| `react` | 19.1.0 | Core React library |
| `react-native` | 0.81.5 | Core React Native (UI primitives: View, Text, Image...) |
| `expo-status-bar` | ~3.0.9 | Điều khiển thanh trạng thái trên cùng điện thoại |
| `expo-linear-gradient` | ~15.0.8 | Hiệu ứng gradient (hero header, FAB, buttons) |
| `@react-navigation/native` | ^7.0.14 | Navigation container và utilities |
| `@react-navigation/native-stack` | ^7.2.0 | Stack navigator (push/pop màn hình, header) |
| `react-native-screens` | ~4.16.0 | Tối ưu hiệu suất navigation bằng native screens |
| `react-native-safe-area-context` | ~5.6.0 | Xử lý notch, Dynamic Island, home indicator bar |

---

## 11. Điểm kỹ thuật quan trọng

### 11.1 Pattern: Context + useReducer (thay thế Redux)

Thay vì cài thêm Redux (thư viện ngoài), dự án dùng:
- `React.createContext` → tạo kênh truyền dữ liệu
- `useReducer` → quản lý state phức tạp với pure function
- `useContext` → đọc dữ liệu từ bất kỳ component con nào

Phù hợp cho app nhỏ/vừa; Redux phù hợp cho app lớn có nhiều feature hơn.

### 11.2 Immutability trong Reducer

```js
// ❌ SAI (mutate state trực tiếp)
state.items.push(newItem);

// ✅ ĐÚNG (tạo object mới)
return { ...state, items: [...state.items, newItem] };
```

React phát hiện thay đổi bằng cách so sánh **reference** (địa chỉ bộ nhớ). Nếu mutate trực tiếp, reference không đổi → React không biết cần re-render.

### 11.3 Performance: memo + useCallback + useMemo

```
memo(ProductCard)     → Chỉ re-render card khi props thực sự thay đổi
useCallback(addToCart) → Hàm không bị tạo lại mỗi render của CartProvider
useMemo(totalItems)   → Chỉ tính lại tổng khi items thay đổi
```

### 11.4 Giỏ hàng chỉ lưu trong RAM

- Không dùng `AsyncStorage` hay database
- Tắt app → mất dữ liệu giỏ hàng
- Để persist: cần thêm `AsyncStorage` và sync trong `CartContext`

### 11.5 API Key trong client – Rủi ro bảo mật

```js
// src/constants/config.js
export const GEMINI_API_KEY = 'AIzaSyA8...'; // ⚠️ NGUY HIỂM trong production!
```

Trong ứng dụng thực tế:
1. **KHÔNG** để API key trong code client (dễ bị đọc từ APK/IPA)
2. Xây dựng **backend server** (Node.js/Python)
3. Client gọi backend → backend gọi Gemini → trả về kết quả

### 11.6 `aiJustSearchedRef` – Tránh race condition

```js
const aiJustSearchedRef = useRef(false);
// Khi AI/category search vừa chạy, set = true
// useEffect debounce sẽ kiểm tra và bỏ qua nếu = true
// Tránh debounce effect vô tình fetch lại và ghi đè kết quả AI
```

### 11.7 `encodeURIComponent` cho URL an toàn

```js
fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
// "men's watch" → "men%27s%20watch"
// Tránh ký tự đặc biệt phá vỡ URL (apostrophe, space, &, =...)
```

### 11.8 Optional chaining (`?.`) để tránh crash

```js
const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
// Nếu bất kỳ bước nào là undefined/null → trả về '' thay vì crash
// Quan trọng khi parse response từ API ngoài (không kiểm soát được cấu trúc)
```

---

> **Kết luận:** Đây là một ứng dụng React Native được thiết kế khá chuẩn mực cho mục đích học tập tại trường. Nó áp dụng nhiều pattern thực tế: Context API, custom hooks, debounce, infinite scroll, animation, và tích hợp AI. Điểm cần cải thiện cho production: persistent storage (AsyncStorage), bảo mật API key, và error boundary cho các màn hình.
