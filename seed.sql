USE ecommerce_forecasting;
INSERT INTO products (name, category, price, stock, units_sold, status) VALUES
('Wireless Headphones','Electronics',79.99,120,840,'Active'),
('Everyday Backpack','Fashion',49.00,65,620,'Active'),
('Ceramic Coffee Set','Home & Living',34.50,42,415,'Active'),
('Smart Watch Series 4','Electronics',199.00,18,390,'Low stock'),
('Hydrating Face Serum','Beauty',24.99,88,370,'Active'),
('Desk Lamp','Home & Living',42.00,31,295,'Active');
INSERT INTO orders (order_code,customer_name,customer_email,order_date,amount,status,payment_method,region) VALUES
('ORD-10481','Ava Patel','ava@example.com','2026-10-18',249.00,'Delivered','Card','West'),
('ORD-10482','Noah Sharma','noah@example.com','2026-10-18',79.99,'Processing','UPI','North'),
('ORD-10483','Mia Singh','mia@example.com','2026-10-17',128.50,'Shipped','Card','South'),
('ORD-10484','Liam Das','liam@example.com','2026-10-16',49.00,'Delivered','UPI','East');
INSERT INTO customers (customer_code,name,email,segment,orders_count,lifetime_value,region) VALUES
('CUS-001','Ava Patel','ava@example.com','VIP',14,1420.50,'West'),
('CUS-002','Noah Sharma','noah@example.com','New',1,79.99,'North'),
('CUS-003','Mia Singh','mia@example.com','Returning',7,682.25,'South'),
('CUS-004','Liam Das','liam@example.com','Returning',5,420.00,'East');
