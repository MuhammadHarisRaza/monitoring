const _ =require("lodash")
const employees = require("../model/employee")


exports.employeeById = (req,res,next,id) =>{
    Employee.findById(id).exec((err, employee) =>{

        if(err|| !employee){
            return res.status(400).json({
                error:"Employee not found"
            })
        }

        req.profile = employee
        next()

    })
}

exports.hasAuthorization = (req, res, next) =>{
    var authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if(!authorized){
        return res.status(403).json({
            error: "Employee is not authorized to perform this action"
        })
    }
}


exports.allEmployees = (req, res) =>{
    Employee.find((err, employee) =>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json({
            employee
        })
    }).select("name email updated created")
}


exports.getEmployee = (req,res) =>{
    console.log(req.body)
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile)
}
