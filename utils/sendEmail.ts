import nodeMailer from 'nodemailer';

export const sendEmail = async (options: any) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: 'sameertesting@outlook.com',
                pass: 'srnimje844',
            },
        });

        const mailOptions = {
            from: 'sameertesting@outlook.com',
            to: options.email,
            subject: options.subject,
            text: options.message,
        }

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        throw new Error('Email sending failed')
    }
}
