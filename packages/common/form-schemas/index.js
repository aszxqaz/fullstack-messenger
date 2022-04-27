const Yup = require('yup')

const formSchema = Yup.object({
	username: Yup.string().required('Username required').min(6, 'Too short username'),
	password: Yup.string().required('Password required').min(6, 'Too short password'),
})

const friendSchema = Yup.object({
    friendName: Yup.string().required('Username required').min(6, 'Too short username')
})

module.exports = { formSchema, friendSchema }