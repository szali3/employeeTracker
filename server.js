const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

//Empty arrays to store values from databaes to display lists
arryRole = [];
arryDepart = [];
arryEmp=[];

//Connect to database
const db = mysql.createConnection({ 
    host:'localhost',
    user: 'root',
    password: '011235Za`',
    database: 'employees'});

//Main Function to display main menu and do logic dependings on selection
function mainMenu(){
  // Main Menu
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
      // Get departments from database to an array
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
      //Get all employee names from database and convert to array
      for (i=0;i<rows.length;i++){
        arryEmp.push({"id":rows[i].id,"name":rows[i].name});
        }
        arryEmp.push({"id":0,"name":"None"}) //Add none to all NULL for manager
      })
      db.promise().query(`SELECT id,title as name FROM role`)
        .then(([rows,fields]) => {
        //Get all roles from database and convert to array 
        for (i=0;i<rows.length;i++){
          arryDepart.push({"id":rows[i].id,"name":rows[i].name});
        }
      })
      return viewSQL("addEmp",[arryEmp,arryDepart]);
    }
    else if(answers.mainChoice === 'update an employee role') {
      db.promise().query(`SELECT id,concat(first_name," ",last_name) as name FROM employee`)
      .then(([rows,fields]) => {
      // Get all employee names and convert to array
      for (i=0;i<rows.length;i++){
        arryEmp.push({"id":rows[i].id,"name":rows[i].name});
        }
      })
      db.promise().query(`SELECT id, title FROM role`)
      .then(([rows,fields]) => {
      //Get all roles and convert to array
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
  .catch((error) => {console.log(error)});
}

// Logic to get data and query results. some just input to database.
function viewSQL(answer,arrylist) {
  if (answer==="roles") {
    db.promise().query(`SELECT title as Title, salary as Salary, name as Depatment 
                        FROM role JOIN department 
                        ON role.department_id = department.id`)
      .then(([rows,fields]) => {
        console.table(rows)
        mainMenu()
      })
  } else if (answer==="employees") {
    db.promise().query(`
      SELECT t2.id,t2.first_name,t2.last_name,role.title,role.salary,concat(t1.first_name, " ", t1.last_name) as manager_name
      FROM employee t1 RIGHT JOIN employee t2 ON t1.id = t2.manager_id
      JOIN role ON t2.role_id=role.id JOIN department ON department.id = role.department_id ORDER BY id ASC;`
      ).then(([rows,fields]) => {
        console.table(rows);
      }).then(() => {
        mainMenu();
      })
  } else if(answer==="department") {
    db.promise().query(`SELECT *FROM department`)
    .then(([rows,fields]) => {
        console.table(rows)
        mainMenu()
      })
  } else if(answer==="addDepartment") {
    inquirer.prompt([{
      type: 'input',
      name: 'addDepartment',
      message:"Input department you want to add?"
    }])
    .then((answers) => {
      db.promise().query(`INSERT INTO department (name) VALUES ("${answers.addDepartment}")`)
      mainMenu();
    })
    .catch((error) => {console.log(error)})
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
      const resultEmp= arrylist[0].find( ({ name }) => name === answers.empSelect); //find Employee ID
      const resultRole = arrylist[1].find( ({ name }) => name === answers.roleSelect); // find role ID
      return `UPDATE employee SET role_id = "${resultRole.id}" WHERE id = "${resultEmp.id}"`})
    .then((data)=>{
      db.promise().query(data)
      mainMenu()
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
      const resultDept = arrylist[1].find( ({ name }) => name === answers.selDepart);// find department ID
      const resultName = arrylist[0].find( ({ name }) => name === answers.selManager);// find employee ID
      if (answers.selManager==="None"){
        return `INSERT INTO employee (first_name,last_name,role_id) 
                VALUES ("${answers.addFirstName}","${answers.addLastName}","${resultDept.id}");`  
      }
      return `INSERT INTO employee (first_name,last_name,role_id,manager_id) 
              VALUES ("${answers.addFirstName}","${answers.addLastName}","${resultDept.id}","${resultName.id}");`
    })
    .then((data)=>{
      db.promise().query(data)
      mainMenu();
    })
    .catch((error) => {console.log(error)});
  }
}

mainMenu();




