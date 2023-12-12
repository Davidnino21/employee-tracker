// ```md
// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
// ```

const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./config/db')


function displayQuestion() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
            },
        ])

        .then((answers) => {

            switch (answers.action) {
                case 'View all departments':
                    showDepartments()
                    break;
                case 'View all roles':
                    showRoles();
                    break;
                case 'View all employees':
                    showEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                default:
                    break;
            }
        })
}

function showDepartments() {
    db.query('SELECT * FROM department', (err, result) => {
        if (err) throw err;

        console.table(result);
        displayQuestion();
    });
}

function showRoles() {
    db.query('SELECT * FROM role', (err, result) => {
        if (err) throw err;

        console.table(result);
        displayQuestion();
    });
}
function showEmployees() {
    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;

        console.table(result);
        displayQuestion();
    });
}
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the department',
            },
        ])
        .then((answers) => {
            const departmentName = answers.departmentName;
            db.query('INSERT INTO department (name) VALUES (?)', [departmentName], (err, result) => {
                if (err) throw err;
                console.log(`New department '${departmentName}' Added to the database`);
                displayQuestion()
            })
        })
}
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'roleDepartment',
                message: 'Which department does the role belong to?',
                choices: ['Engineering', 'Finances', 'Web Development', 'Sales']
            },
        ])
        .then((answers) => {
            const roleName = answers.roleName;
            const roleSalary = answers.roleSalary;
            const roleDepartment = answers.roleDepartment;

            db.query(
                'INSERT INTO role (title, salary, department_id)) VALUES (?, ?, (SELECT id FROM department WHERE name =?))',
                [roleName, roleSalary, roleDepartment],
                (err, result) => {
                if(err) throw err;
                console.log(`New role '${roleName}' Added to the database`);
                displayQuestion();
            }
            );
        });

    }


displayQuestion()







