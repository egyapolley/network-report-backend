const Joi = require("joi");

module.exports ={

    UserRegister: (body) => {

        const schema = Joi.object({
            username: Joi.string()
                .trim()
                .lowercase()
                .label("Username")
                .alphanum()
                .min(2)
                .max(50)
                .required(),
            password: Joi.string()
                .label("Password")
                .min(5)
                .max(255)
                .required()

        });

        return schema.validate(body)

    },
    validateRequest: (body) => {

        const schema = Joi.object({
            node: Joi.string()
                .required()
                .max(255),

            reportCounter: Joi.string()
                .required(),
            period: Joi.string()
                .required()
                .trim()
                .max(255),
            startDate: Joi.string()
                .required()
                .trim()
                .max(255),
            endDate: Joi.string()
                .required()
                .max(255)
                .trim()
        });

        return schema.validate(body)


    }



}
