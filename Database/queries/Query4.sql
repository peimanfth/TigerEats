USE TigerEats;

SELECT 
    student_id,
    first_name,
    last_name,
    email,
    balance
FROM 
    Students
WHERE 
    balance >= 100 AND balance < 500;
