USE TigerEats;

SELECT 
    Reviews.review_id,
    Reviews.rating,
    Reviews.comments,
    Reviews.review_date,
    Restaurants.name AS restaurant_name
FROM 
    Reviews
JOIN 
    Students ON Reviews.student_id = Students.student_id
JOIN 
    Restaurants ON Reviews.restaurant_id = Restaurants.restaurant_id
WHERE 
    Students.email = 'john.doe@example.com';
