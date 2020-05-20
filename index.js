const mysql = require("mysql");
const inquirer = require("inquirer"); 

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "@@MxP326",
  database: "company_db"
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start(); 
});

function start() {
 
  inquirer.prompt([
    {
      type:"list",
      choices:["Add a department","Add a role","Add an employee","View all departments","View all roles","View all employees","Update an employee's role","Exit"],
      message:"Please select an option:",
      name:"option"
    }
  ])
  .then(function(answers){

    switch (answers.option) {
      case "Add a department":
        addDepartment(); 
        break; 
      case "Add a role":
        addRole(); 
        break; 
      case "Add an employee":
        addEmployee(); 
        break; 
      case "View all departments":
        viewDepartments(); 
        break; 
      case "View all roles":
        viewRoles(); 
        break; 
      case "View all employees":
        viewEmployees(); 
        break; 
      case "Update an employee's role":
        updateRole(); 
        break; 
      case "Quit":
        connection.end();
        break;
      default:
        connection.end();
        break;
    }
  });  
} 

function addDepartment() {

  inquirer.prompt([
    {
      type:"input",
      message:"Type the name of the department:",
      name:"departmentName"
    }
  ])
  .then(function(answers){ 

    const query ="INSERT INTO department SET ?"; 

    connection.query(query, {name: answers.departmentName},function(err,res) {
      if(err) throw err; 

      console.log(`\n${answers.departmentName} department successfully added!\n`); 

      firstprompt(); 
    }); 
  })
}

function addRole() {

  let departmentNames = []; 

  const query = "SELECT name FROM department"; 

  connection.query(query, function (err, res) {
    if (err) throw err;
    for(let i = 0; i < res.length; i++) {
      departmentNames.push(res[i].name); 
    }

    inquirer.prompt([
      {
        type:"input",
        message:"Type the role:",
        name:"roleTitle"
      }, 
      {
        type:"number",
        message:"Type the salary of the role:",
        name:"roleSalary"
      },
      {
        type:"list",
        choices:departmentNames, 
        message:"Choose the department which this role belongs to:",
        name:"roleDepartment"
      }
    ])
    .then(function(answers){ 

      let departmentID = null; 

      const idQuery = "SELECT id FROM department WHERE ?"; 

      connection.query(idQuery, {name:answers.roleDepartment}, function (idErr, idRes) {

        if (idErr) throw idErr;

        departmentID = idRes[0].id; 
        const addQuery ="INSERT INTO role SET ?"; 

        connection.query(addQuery, 
        {
          title: answers.roleTitle,
          salary: answers.roleSalary,
          department_id: departmentID
        },
        function(err,res) {
          if(err) throw err; 

          console.log(`\n${answers.roleTitle} role successfully added!\n`); 

          firstprompt(); 
        }); 
      });
    }); 
  });
}

function addEmployee() {

  let roleNames = []; 
  const query = "SELECT title FROM role"; 

  connection.query(query, function (err, res) {

    if (err) throw err;

    for(let i = 0; i < res.length; i++) {
      roleNames.push(res[i].title); 
    }

    inquirer.prompt([
      {
        type:"input",
        message:"Type the employee's first name:",
        name:"employeeFN"
      },
      {
        type:"input",
        message:"Type the employee's last name:",
        name:"employeeLN"
      },
      {
        type:"list",
        choices:roleNames, 
        message:"Select the employee's role:",
        name:"employeeRole"
      },
      {
        type:"confirm",
        message:"Does this employee have a manager?",
        default:true, 
        name:"hasManager"
      },
      {
        type:"input",
        message:"Type the first name of the employee's manager:",
        name:"managerFirst",
        when:function(answer){
          return answer.hasManager === true
        }
      },
      {
        type:"input",
        message:"Type the last name of the employee's manager:",
        name:"managerLast",
        when:function(answer){
          return answer.hasManager === true
        }
      }
    ])
    .then(function(answers){ 

      let roleID = null; 
      const roleQuery = "SELECT id FROM role WHERE ?"; 

      connection.query(roleQuery, {title:answers.employeeRole}, function (roleErr, roleRes) {

        if (roleErr) throw roleErr;
        roleID = roleRes[0].id; 

        if(answers.hasManager) {

          let managerID = null; 
          const managerQuery = "SELECT id FROM employee WHERE ? AND ?"; 

          connection.query(managerQuery, 
          [
            {first_name:answers.managerFirst},
            {last_name:answers.managerLast}
          ], 
          function (managerErr, managerRes) {
            if (managerErr) throw managerErr;
            managerID = managerRes[0].id; 

            console.log(managerID); 

            const addQuery ="INSERT INTO employee SET ?"; 

            connection.query(addQuery, 
            {
              first_name: answers.employeeFN,
              last_name: answers.employeeLN,
              role_id: roleID,
              manager_id: managerID
            },
            function(err,res) {
              if(err) throw err; 

              console.log(`\n${answers.employeeFN} ${answers.employeeLN} successfully added as an employee\n`); 
              firstprompt(); 
            }); 
          });
        }
        else {

          const addQuery ="INSERT INTO employee SET ?"; 

          connection.query(addQuery, 
          {
            first_name: answers.employeeFN,
            last_name: answers.employeeLN,
            role_id: roleID,
          },
          function(err,res) {
            if(err) throw err; 

            console.log(`\n${answers.employeeFN} ${answers.employeeLN} successfully added as an employee\n`); 
            firstprompt(); 
          });
        }
      });
    });
  });
}

function viewDepartments() {

  const query = "SELECT * FROM department"; 

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    firstprompt(); 
  });
}

function viewRoles() {

  const query = "SELECT * FROM role";

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    firstprompt(); 
  });
}

function viewEmployees() {

  const query = "SELECT * FROM employee"; 

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    firstprompt(); 
  });
}

function updateRole() {

  let roleNames = []; 
  const query = "SELECT title FROM role"; 

  connection.query(query, function (err, res) {
    if (err) throw err;
    for(let i = 0; i < res.length; i++) {
      roleNames .push(res[i].title); 
    }
 
    inquirer.prompt([
      {
        type:"input",
        message:"Type the employee's first name",
        name:"employeeFN"
      },
      {
        type:"input",
        message:"Type the employee's last name",
        name:"employeeLN"
      },
      {
        type:"list",
        choices:roleNames, 
        message:"Select the employee's new role:",
        name:"employeeRole"
      }
    ])
    .then(function(answers){ 

      let newRoleID = null; 
      const roleQuery = "SELECT id FROM role WHERE ?"; 

      connection.query(roleQuery, {title:answers.employeeRole}, function (roleErr, roleRes) {
        if (roleErr) throw roleErr;
        newRoleID = roleRes[0].id; 

        const query = "UPDATE employee SET ? WHERE ? AND ?"

        connection.query(query,
        [
          {
            role_id:newRoleID
          },
          {
            first_name: answers.employeeFN
          },
          {
            last_name: answers.employeeLN 
          }
        ],
        function(err, res) {
          if (err) throw err;

          console.log(`\n${answers.employeeFN} ${answers.employeeLN}'s role has been updated to ${answers.employeeRole}!\n`); 
          firstprompt(); 
        });
      }); 
    }); 
  }); 
}

function firstprompt() {
 
  inquirer.prompt([
    {
      type:"list",
      choices:["Yes","No"],
      message:"Do you want to continue?",
      name:"option"
    }
  ])
  .then(function(answers){

    switch (answers.option) {
      case "Yes":
        start(); 
        break; 
      case "No":
        connection.end();
        break;
      default:
        connection.end();
        break;
    }
  });  
} 



