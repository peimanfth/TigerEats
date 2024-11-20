SELECT MenuItems.name, OrderDetails.quantity, OrderDetails.subtotal
FROM OrderDetails
JOIN MenuItems ON OrderDetails.item_id = MenuItems.item_id
WHERE OrderDetails.order_id = 1;
