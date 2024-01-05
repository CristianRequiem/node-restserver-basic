const { response, request } = require("express")

const isAdminRole = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'It is being trying to check the user role without validating the token first'
        });
    }

    const { name, role } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `The user ${name} is not an admin`
        });
    }

    next();
}

const hasRole = (...roles) => {

    return (req = request, res = response, next) => {

        if (!req.user) {
            return res.status(500).json({
                msg: 'It is being trying to check the user role without validating the token first'
            });
        }

        const { name, role } = req.user;

        if (!roles.includes(role)) {
            return res.status(401).json({
                msg: `The user ${name} does not have an authorized role`
            }); 
        }

        next();
    }

}

module.exports = {
    isAdminRole,
    hasRole
}