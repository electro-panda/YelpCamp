const BaseJoi = require("joi");
const SanitizeHtml = require('sanitize-html');

const extension = (joi) => {
    return {

        type: 'string',
        base: joi.string(),
        messages:{
            'string.escapeHTML':'{{#label}} must not include HTML!'
        },
        rules: {
            escapeHTML: {

                validate(value,helpers) {
                    const clean=SanitizeHtml(value,{
                        allowedTags:[],
                        allowedAttributes:{},
                    });
                    if(clean!==value) return helpers.error('string.escapeHTML',{value});
                    return clean;
                },
            },
        },
    };
};

const Joi=BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().escapeHTML().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().escapeHTML().required(),
        description: Joi.string().escapeHTML().required(),
        images: Joi.array().items(
            Joi.object({
                url: Joi.string().escapeHTML().required(),
                filename: Joi.string().required()
            })
        ),
    }).required(),
    deleteImages: Joi.array().items(Joi.string().escapeHTML())
}).required();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().escapeHTML().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
}).required();

