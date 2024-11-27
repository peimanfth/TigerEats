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
    balance >= 30 AND balance < 500;
