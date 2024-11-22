USE TigerEats;

SELECT 
    Restaurants.restaurant_id,
    Restaurants.name AS restaurant_name,
    Restaurants.location
FROM 
    Restaurants
JOIN 
    RestaurantHours ON Restaurants.restaurant_id = RestaurantHours.restaurant_id
WHERE 
    RestaurantHours.day_of_week = 'Sunday'
    AND RestaurantHours.open_time <= '10:00:00'
    AND RestaurantHours.close_time >= '12:00:00';
