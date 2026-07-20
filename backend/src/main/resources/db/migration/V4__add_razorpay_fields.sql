ALTER TABLE orders ADD COLUMN razorpay_order_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN razorpay_payment_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN razorpay_signature VARCHAR(255);
