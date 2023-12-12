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
const dbConnection = require('./config/db')


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
                case 'Add an employee':
                    addEmployee();
                    break;
                default:
                    break;
            }
        })
}

async function showDepartments() {
    const db = await dbConnection()
    try {
        const result = await db.query('SELECT * FROM department')
        console.table(result[0]);
        displayQuestion();
    } catch (error) {
        console.log(error)
    }
}

async function showRoles() {
    const db = await dbConnection()
    try {
        const result = await db.query('SELECT * FROM role')
        console.table(result[0]);
        displayQuestion();
    } catch (error) {
        console.log(error)
    }
}

async function showEmployees() {
    const db = await dbConnection()
    try {
        const result = await db.query('SELECT * FROM employee')
        console.table(result[0]);
        displayQuestion();
    } catch (error) {
        console.log(error)
    }
}

async function addDepartment() {
    const db = await dbConnection()
    try {
        const answers = await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'What is the name of the department',
                },
            ])
        const departmentName = await answers.departmentName;
        await db.query('INSERT INTO department (name) VALUES (?)', [departmentName])

        console.log(`New department '${departmentName}' Added to the database`);
        displayQuestion()
    } catch (error) {
        console.log(error)
    }

}

async function addRole() {
    const db = await dbConnection()
    try {
        const result = await db.query('SELECT * FROM department')
        const departments = result[0].map(d => ({ name: d.name, value: d.id }))

        const answers = await inquirer
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
                    choices: departments,
                },
            ])

        const roleName = answers.roleName;
        const roleSalary = answers.roleSalary;
        const roleDepartment = answers.roleDepartment;

        const results = await db.query(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
            [roleName, roleSalary, roleDepartment])
        console.log(`New role '${roleName}' Added to the database`);
        displayQuestion();
    } catch (error) {
        console.log(error)
    }

}

async function addEmployee() {
    const db = await dbConnection()
    try {
        const result = await db.query('SELECT * FROM role')
        const roles = result[0].map(r => ({ name: r.title, value: r.id }))
        const results = await db.query('SELECT * FROM employee')
        const managers = results[0].map(m => ({ name: m.first_name + " " + m.last_name, value: m.id }))

        const answers = await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employees first name?',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the employees last name?',
                },
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: 'What is the employees role?',
                    choices: roles,
                },
                {
                    type: 'list',
                    name: 'employeeManager',
                    message: 'Who is the employees manager?',
                    choices: managers,
                }
            ])
        const { firstName, lastName, employeeRole, employeeManager } = answers
        await db.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [firstName, lastName, employeeRole, employeeManager])
        console.log(`New employee '${firstName} ${lastName}' Added to the database`);
        displayQuestion();
    } catch (error) {
        console.log(error)
    }

}

displayQuestion()







