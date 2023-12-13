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
                case 'Update an employee role':
                    updateEmployee();
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
        const result = await db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id')
        console.table(result[0]);
        displayQuestion();
    } catch (error) {
        console.log(error)
    }
}

async function showEmployees() {
    const db = await dbConnection()
    try {
        const result = await db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
        m.last_name AS manager FROM employee as e JOIN role as r ON e.role_id = r.id JOIN department AS d ON r.department_id = d.id LEFT JOIN employee AS m ON e.manager_id = m.id`)
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

async function updateEmployee() {
    const db = await dbConnection()
    try {
        const results = await db.query('SELECT * FROM employee')
        const employees = results[0].map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));
        const result = await db.query('SELECT * FROM role')
        const roles = result[0].map(r => ({ name: r.title, value: r.id }))

        const answers = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Which employee role do you want to update?',
                    choices: employees,
                },
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: 'Which role do you want to assign the selected employee?',
                    choices: roles,
                },
            ])

        const { employeeId, employeeRole } = answers
        await db.query(
            'UPDATE employee SET role_id = ? WHERE id = ?', [employeeRole, employeeId])
        console.log('Updated employees role');
        displayQuestion();
    } catch (error) {
        console.log(error)
    }
}


displayQuestion()







