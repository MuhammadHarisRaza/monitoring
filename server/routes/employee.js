var express = require("express")
var { employeeById, allEmployees, getEmployee } =  require("../controller/employee")
var { employeeRequireSignin } = require("../controller/auth")

var router = express.Router();

router.get("/employees", allEmployees)
router.get("/employee/:employeeId",employeeRequireSignin, getEmployee)

router.param("employeeId", employeeById)

module.exports=router