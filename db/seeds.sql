INSERT INTO department (name)
VALUES  ("Engineering"),
        ("Finances"),
        ("Web Development"),
        ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES  ("Lead Engineer", 120000, 1),
        ("Accountant", 70000, 2),
        ("Lead Software Engineer", 160000, 3),
        ("Sales Lead", 50000, 4),
        ("Junior Developer", 80000, 3),
        ("SalesPerson", 40000, 4),
        ("Account Manager", 120000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Moss", 3, NULL),
        ("Jessica", "Par", 5, 1),
        ("Greg", "Norman", 1, Null),
        ("Sarah", "Walker",4, NULL),
        ("Heather", "Cole", 4, 4),
        ("Luke", "Skywalker", 7, NULL),
        ("Bill", "Bryant", 2, 6);



