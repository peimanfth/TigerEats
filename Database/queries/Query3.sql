USE TigerEats;

SELECT 
    MenuItems.item_id,
    MenuItems.name AS item_name,
    MenuItems.description,
    MenuItems.price,
    MenuItems.availability
FROM 
    MenuItems
JOIN 
    Restaurants ON MenuItems.restaurant_id = Restaurants.restaurant_id
WHERE 
    Restaurants.name = 'Tiger Grill';
