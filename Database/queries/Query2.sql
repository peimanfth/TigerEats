USE TigerEats;

SELECT 
    Orders.order_id,
    Orders.student_id,
    Students.email,
    Orders.order_date,
    Orders.total_amount,
    Orders.status,
    OrderDetails.item_id,
    MenuItems.name AS item_name,
    MenuItems.price AS item_price,
    OrderDetails.quantity,
    OrderDetails.subtotal
FROM 
    Orders
JOIN 
    Students ON Orders.student_id = Students.student_id
JOIN 
    OrderDetails ON Orders.order_id = OrderDetails.order_id
JOIN 
    MenuItems ON OrderDetails.item_id = MenuItems.item_id
WHERE 
    Orders.total_amount = (
        SELECT MAX(total_amount) FROM Orders
    );
