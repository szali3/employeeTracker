const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

roleArray = [];
empArray = [];
arryRole = [];
arryDepart = [];
arryEmp=[];

const db = mysql.createConnection({ 
    host:'localhost',
    user: 'root',
    password: '011235Za`',
    database: 'employees'});

function mainMenu(){
  inquirer.prompt(
    [{
      type: 'list',
      name: 'mainChoice',
      message:"What would you like to do?",
      choices:[ "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role"
        ]}
      ])
  .then((answers) => {
    if(answers.mainChoice === 'view all roles') {
      return viewSQL("roles");
    }
    else if(answers.mainChoice === 'view all employees') {
      return viewSQL("employees");
    }
    else if(answers.mainChoice === 'view all departments') {
      return viewSQL("department");
    }
    else if(answers.mainChoice === 'add a department') {
      return viewSQL("addDepartment");
    }
    else if(answers.mainChoice === 'add a role') {
      db.promise().query(`SELECT * FROM department`)
        .then(([rows,fields]) => {
        for (i=0;i<rows.length;i++){
          arryDepart.push({"id":rows[i].id,"name":rows[i].name});
        }
        })
      return viewSQL("addRole",arryDepart);
    }
    else if(answers.mainChoice === 'add an employee') {
      db.promise().query(`SELECT id,concat(first_name," ",last_name) as name FROM employee`)
      .then(([rows,fields]) => {
      for (i=0;i<rows.length;i++){
        arryEmp.push({"id":rows[i].id,"name":rows[i].name});
        }
      })
      db.promise().query(`SELECT * FROM department`)
        .then(([rows,fields]) => {
        for (i=0;i<rows.length;i++){
          arryDepart.push({"id":rows[i].id,"name":rows[i].name});
        }
      })
      return viewSQL("addEmp",[arryEmp,arryDepart]);
    }
    else if(answers.mainChoice === 'update an employee role') {
      db.promise().query(`SELECT id,concat(first_name," ",last_name) as name FROM employee`)
      .then(([rows,fields]) => {
      for (i=0;i<rows.length;i++){
        arryEmp.push({"id":rows[i].id,"name":rows[i].name});
        }
      })
      db.promise().query(`SELECT id, title FROM role`)
      .then(([rows,fields]) => {
      for (i=0;i<rows.length;i++){
        arryRole.push({"id":rows[i].id,"name":rows[i].title});
        }
        return viewSQL("selRole",[arryEmp,arryRole])
      })
    }
    else {
      mainMenu();
    }
  })
  .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          console.log(error);
        }
      });
    }
 
  function viewSQL(answer,arrylist) {
    if (answer==="roles") {
      db.promise().query(`
        SELECT title as Title, salary as Salary, name as Depatment 
        FROM role JOIN department 
        ON role.department_id = department.id`)
        .then(([rows,fields]) => {
          console.table(rows);
        }).then(() => {
          mainMenu();
          })
    } else if (answer==="employees") {
      db.promise().query(`
        SELECT 
        t2.id,t2.first_name,t2.last_name,role.title,role.salary,concat(t1.first_name, " ", t1.last_name) as manager_name
        FROM employee t1
        RIGHT JOIN employee t2
        ON t1.id = t2.manager_id
        JOIN role ON t2.role_id=role.id
        JOIN department ON department.id = role.department_id;`
        ).then(([rows,fields]) => {
          console.table(rows);
        }).then(() => {
          mainMenu();
        })
    } else if(answer==="department") {
      db.promise().query(`
        SELECT 
        *
        FROM department`
        ).then(([rows,fields]) => {
          console.table(rows);
        }).then(() => {
          mainMenu();
        })
    } else if(answer==="addDepartment") {
      inquirer.prompt([{
        type: 'input',
        name: 'addDepartment',
        message:"Input department you want to add?"
      }])
      .then((answers) => {
        db.promise().query(`
        INSERT INTO 
        department
        (name) VALUES ("${answers.addDepartment}")`
        ).then(([rows,fields]) => {
          //console.table(rows);
        }).then(() => {
          mainMenu();
        })
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
        }
      })
    } else if(answer==="selRole") {
      inquirer.prompt([{
        type: 'list',
        name: 'empSelect',
        message:"Select Whose role you want to change?",
        choices: arrylist[0]
      },
      {
        type: 'list',
        name: 'roleSelect',
        message:"Select the role you want to change to?",
        choices: arrylist[1]
      }])
      .then((answers) => {
        const resultEmp= arrylist[0].find( ({ name }) => name === answers.empSelect);
        const resultRole = arrylist[1].find( ({ name }) => name === answers.roleSelect);
        return `UPDATE employee SET role_id = "${resultRole.id}" WHERE id = "${resultEmp.id}"`
      })
      .then((data)=>{
        db.promise().query(
        data).then(([rows,fields]) => {
          console.table(rows);
        }).then(() => {
          mainMenu();
        })
      })
    } else if(answer==="addEmp") {
      inquirer.prompt([{
        type: 'input',
        name: 'addFirstName',
        message:"Input employee first name"
      },
      {
        type: 'input',
        name: 'addLastName',
        message:"Input employee last name" 
      },{
        type: 'list',
        name: 'selDepart',
        message:"what department you want to select?" ,
        choices: arrylist[1]
      },{
        type: 'list',
        name: 'selManager',
        message:"who is manager?" ,
        choices: arrylist[0]
      }
    ])
      .then((answers) => {
        const resultDept = arrylist[1].find( ({ name }) => name === answers.selDepart);
        const resultName = arrylist[0].find( ({ name }) => name === answers.selManager);
        return `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ("${answers.addFirstName}","${answers.addLastName}","${resultDept.id}","${resultName.id}");`
      })
      .then((data)=>{
        db.promise().query(
        data
        ).then(([rows,fields]) => {
          console.table(rows);
        }).then(() => {
          mainMenu();
        })
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          console.log(error);
        }
      })
    }
}

mainMenu();




