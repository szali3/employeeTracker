
INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Finance");
INSERT INTO department (name) VALUES ("Legal");

INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead",100000,1);
INSERT INTO role (title, salary, department_id) VALUES ("Salesperson",80000,1);
INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer",150000,2);
INSERT INTO role (title, salary, department_id) VALUES ("Software Engineer",120000,2);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant",125000,3);
INSERT INTO role (title, salary, department_id) VALUES ("Leagal Team Lead",250000,4);
INSERT INTO role (title, salary, department_id) VALUES ("Lawyer",190000,4);

INSERT INTO employee (first_name,last_name,role_id) VALUES ("John","Doe",1);
INSERT INTO employee (first_name,last_name,role_id) VALUES ("Mike","Chan",2);
INSERT INTO employee (first_name,last_name,role_id) VALUES ("Asheley","Rodriguez",3);
INSERT INTO employee (first_name,last_name,role_id) VALUES ("Kevin","Tuplik",4);
INSERT INTO employee (first_name,last_name,role_id) VALUES ("Malia","Brown",5);
INSERT INTO employee (first_name,last_name,role_id) VALUES ("Sarah","Lourd",6);
INSERT INTO employee (first_name,last_name,role_id) VALUES ("Tom","Allen",7);

UPDATE employee SET manager_id =3 WHERE id=1;
UPDATE employee SET manager_id =1 WHERE id=2;
UPDATE employee SET manager_id =3 WHERE id=4;
UPDATE employee SET manager_id =6 WHERE id=7;
