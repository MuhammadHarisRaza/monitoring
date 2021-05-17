exports.createProjectValidator = (req, res, next) =>{
    req.check("title","Write a title").notEmpty()
    req.check("title","Title must be betwenn 4 to 150 characters").isLength({
        min: 4,
        max: 150
    });

    req.check("description","Write a body").notEmpty()
    req.check("description","Body must be betwenn 4 to 2000 characters").isLength({
        min: 4,
        max: 2000
    });

    var errors = req.validationErrors()

    //if error show first error

    if(errors){
        var firstError = errors.map((error)=> error.msg)[0]
        return res.status(400).json({
            error: firstError
        })
    }

    //proceed to next middleware
    next();
}


exports.adminSignupValidator = ( req,res,next) => {
    req.check("name", "Name is required").notEmpty();

    req.check("email","Email is required")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min: 4,
        max:100
    })


    req.check("password","Password is required").notEmpty();
    req.check("password")
    .isLength({
        min: 6
    })
    .withMessage("Password must contain atleast 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")


    var errors = req.validationErrors();

    if(errors){
        var firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({
            error: firstError
        });;
    }

    next();
}