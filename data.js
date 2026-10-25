export const monthlySales = [
  { month: "Jan", revenue: 4200, orders: 142 },
  { month: "Feb", revenue: 5100, orders: 168 },
  { month: "Mar", revenue: 4700, orders: 153 },
  { month: "Apr", revenue: 6200, orders: 198 },
  { month: "May", revenue: 5800, orders: 187 },
  { month: "Jun", revenue: 7100, orders: 223 },
  { month: "Jul", revenue: 6650, orders: 211 },
  { month: "Aug", revenue: 8150, orders: 256 },
  { month: "Sep", revenue: 7700, orders: 241 },
  { month: "Oct", revenue: 9200, orders: 289 },
  { month: "Nov", revenue: 9850, orders: 312 },
  { month: "Dec", revenue: 10400, orders: 338 }
];

export const demoProducts = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 79.99, stock: 120, units_sold: 840, status: "Active" },
  { id: 2, name: "Everyday Backpack", category: "Fashion", price: 49, stock: 65, units_sold: 620, status: "Active" },
  { id: 3, name: "Ceramic Coffee Set", category: "Home & Living", price: 34.5, stock: 42, units_sold: 415, status: "Active" },
  { id: 4, name: "Smart Watch Series 4", category: "Electronics", price: 199, stock: 18, units_sold: 390, status: "Low stock" },
  { id: 5, name: "Hydrating Face Serum", category: "Beauty", price: 24.99, stock: 88, units_sold: 370, status: "Active" },
  { id: 6, name: "Desk Lamp", category: "Home & Living", price: 42, stock: 31, units_sold: 295, status: "Active" },
  { id: 7, name: "Running Sneakers", category: "Fashion", price: 89, stock: 0, units_sold: 272, status: "Out of stock" },
  { id: 8, name: "Portable Speaker", category: "Electronics", price: 59.99, stock: 54, units_sold: 250, status: "Active" }
];

export const demoOrders = [
  { id: 1, order_code: "ORD-10481", customer_name: "Ava Patel", customer_email: "ava@example.com", order_date: "2026-10-18", amount: 249, status: "Delivered", payment_method: "Card", region: "West" },
  { id: 2, order_code: "ORD-10482", customer_name: "Noah Sharma", customer_email: "noah@example.com", order_date: "2026-10-18", amount: 79.99, status: "Processing", payment_method: "UPI", region: "North" },
  { id: 3, order_code: "ORD-10483", customer_name: "Mia Singh", customer_email: "mia@example.com", order_date: "2026-10-17", amount: 128.5, status: "Shipped", payment_method: "Card", region: "South" },
  { id: 4, order_code: "ORD-10484", customer_name: "Liam Das", customer_email: "liam@example.com", order_date: "2026-10-16", amount: 49, status: "Delivered", payment_method: "UPI", region: "East" },
  { id: 5, order_code: "ORD-10485", customer_name: "Isha Rao", customer_email: "isha@example.com", order_date: "2026-10-15", amount: 318, status: "Cancelled", payment_method: "Wallet", region: "West" },
  { id: 6, order_code: "ORD-10486", customer_name: "Arjun Mehta", customer_email: "arjun@example.com", order_date: "2026-10-14", amount: 159, status: "Delivered", payment_method: "Card", region: "North" }
];

export const demoCustomers = [
  { id: 1, customer_code: "CUS-001", name: "Ava Patel", email: "ava@example.com", segment: "VIP", orders_count: 14, lifetime_value: 1420.5, region: "West" },
  { id: 2, customer_code: "CUS-002", name: "Noah Sharma", email: "noah@example.com", segment: "New", orders_count: 1, lifetime_value: 79.99, region: "North" },
  { id: 3, customer_code: "CUS-003", name: "Mia Singh", email: "mia@example.com", segment: "Returning", orders_count: 7, lifetime_value: 682.25, region: "South" },
  { id: 4, customer_code: "CUS-004", name: "Liam Das", email: "liam@example.com", segment: "Returning", orders_count: 5, lifetime_value: 420, region: "East" },
  { id: 5, customer_code: "CUS-005", name: "Isha Rao", email: "isha@example.com", segment: "VIP", orders_count: 19, lifetime_value: 2380, region: "West" },
  { id: 6, customer_code: "CUS-006", name: "Arjun Mehta", email: "arjun@example.com", segment: "New", orders_count: 2, lifetime_value: 159, region: "North" }
];

export const demoReviews = [
  { id: 1, customer: "Mia Singh", product: "Wireless Headphones", rating: 5, comment: "Great sound quality and comfortable for long calls.", date: "2026-10-19", status: "Published" },
  { id: 2, customer: "Noah Sharma", product: "Everyday Backpack", rating: 4, comment: "Good quality with lots of useful pockets.", date: "2026-10-18", status: "Published" },
  { id: 3, customer: "Isha Rao", product: "Desk Lamp", rating: 3, comment: "Looks good, but delivery took longer than expected.", date: "2026-10-16", status: "Pending" }
];
