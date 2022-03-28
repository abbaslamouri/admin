import Email from '~/server/utils/Email'
import { useBody } from 'h3'
import errorHandler from '~/server/utils/errorHandler'
import sgMail from '@sendgrid/mail'
import pug from 'pug'

export default async (req, res) => {
	res.statusCode = 200

	if (req.method === 'POST') {
		try {
			const { user, url } = await useBody(req)
			console.log('HHHHHH')

			sgMail.setApiKey(process.env.SENDGRID_API_KEY)
			const msg = {
				to: 'abbaslamouri@yrlus.com',
				from: 'support@yrlus.com', // Use the email address or domain you verified above
				subject: 'Sending with Twilio SendGrid is Fun',
				text: 'and easy to do anywhere, even with Node.js',
				// html: '<strong>and easy to do anywhere, even with Node.js</strong>',
				html: pug.renderFile(`server/templates/emails/password-reset.pug`, {
					firstname: 'Abbas',
					url: 'URL',
					subject: 'Sending with Twilio SendGrid is Fun',
				}),
			}
			//ES6
			// sgMail
			// 	.send(msg)
			// 	.then(() => {}, error => {
			// 		console.error(error);

			// 		if (error.response) {
			// 			console.error(error.response.body)
			// 		}
			// 	});
			//ES8

			const xx = await sgMail.send(msg)
			console.log(xx)

			// await new Email(user, url).sendPasswordReset()
			return {
				user,
				url,
				message: `Email sent to ${user.email}.  Please follow the link in your email to reset your pasword.  Please note that you have 1 hour to reset your password`,
			}
		} catch (error) {
			// console.log(error)
			const err = errorHandler(error)
			res.statusCode = err.statusCode
			return err.message
		}
	}
}
