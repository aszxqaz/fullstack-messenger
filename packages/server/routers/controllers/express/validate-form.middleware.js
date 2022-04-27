const { formSchema } = require("@maxapp/common")

const validateForm = async (req, res, next) => {
    const formData = req.body
    try {
        const isValid = await formSchema.validate(formData)
        if (!isValid) throw new Error("Validation failed")
        next()
    } catch (err) {
        console.log(err)
        res.status(400).send()
    }
}

module.exports = validateForm
