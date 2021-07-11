--view all departments
SELECT * FROM department;

--view all roles
SELECT * FROM role;

--view all employees
SELECT * FROM employees;

--add a department
INSERT INTO department (name) VALUES ("HR");

--add a role
INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead",100000,1);

--add an employee
INSERT INTO employees (first_name,last_name,role_id) VALUES ("John","Doe",1);

--update an employee role