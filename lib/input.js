const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {host:'localhost', 
    user: 'root', 
    password: '011235Za`',
    database: 'employees'});
    
function inputEmployee(){
    inquirer.prompt([
       {
      type: 'input',
      name: 'empFirstName',
      message:`Please input First Name?`,
    },{
   type: 'input',
      name: 'empLastName',
      message:"Please input Last Name?"
    },{
   type: 'input',
      name: 'empRole',
      message:"Please select Role?"
    },{
   type: 'input',
      name: 'empManager',
      message:"Please select Manager?"
    }])
    .then((answers) => {
      console.log(answers);
    })
    .catch((error) => {
        console.log(error);
    });
}
  
function inputRole(){
    inquirer
    .prompt([
       {
      type: 'input',
      name: 'roleNmae',
      message:"Please type role you want to add?"
    },{
      type: 'input',
      name: 'roleSalary',
      message:"Please type the salary?"
    }])
    .then((answers) => {
      console.log(answers);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        console.log(error);
      }
    });
}
  
function updateRole(){
    inquirer
    .prompt([
       {
      type: 'input',
      name: 'newRoleEmp',
      message:"Select employee to update role"
    },{
      type: 'input',
      name: 'newRoleAssign',
      message:"Select new role to be assigned"
    }])
    .then((answers) => {
      console.log(answers);    
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        console.log(error);
      }
    });
}
  
function updateManager(){
    inquirer
    .prompt([
       {
      type: 'input',
      name: 'newEmpManager',
      message:"Select employee to update manager"
    },{
      type: 'input',
      name: 'newEmpManAssigned',
      message:"Select new manager to be assigned"
    }])
    .then((answers) => {
      console.log(answers);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        console.log(error);
      }
    });
}

module.exports = {updateRole,inputRole,updateManager,inputEmployee}