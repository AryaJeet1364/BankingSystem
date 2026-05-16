const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"AJLedger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to AJLedger – Registration Successful";

  const text = `
Dear ${name},

Thank you for registering with AJLedger.

We are pleased to welcome you to AJLedger, your trusted digital banking and financial management platform. Your account registration has been completed successfully.

With AJLedger, you can securely manage your finances, monitor transactions, and access banking services with ease and convenience.

For security purposes, please do not share your login credentials or OTPs with anyone.

If you require any assistance, our support team is always available to help you.

Thank you for choosing AJLedger.

Warm regards,
Team AJLedger
`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 40px; border-radius: 8px;">

      <h2 style="color: #1a237e; margin-bottom: 20px;">
        Welcome to AJLedger
      </h2>

      <p>Dear <strong>${name}</strong>,</p>

      <p>
        Thank you for registering with <strong>AJLedger</strong>.
      </p>

      <p>
        We are pleased to welcome you to AJLedger, your trusted digital banking
        and financial management platform. Your account registration has been
        completed successfully.
      </p>

      <p>
        With AJLedger, you can securely manage your finances, monitor
        transactions, and access banking services with ease and convenience.
      </p>

      <div style="
        background-color: #f8f9fc;
        border-left: 4px solid #1a237e;
        padding: 12px 16px;
        margin: 24px 0;
      ">
        <strong>Security Reminder:</strong><br />
        Never share your password, OTP, or banking credentials with anyone.
      </div>

      <p>
        If you require any assistance, our support team is always available to help you.
      </p>

      <br />

      <p>Thank you for choosing AJLedger.</p>

      <p style="margin-top: 30px;">
        Warm regards,<br />
        <strong>Team AJLedger</strong>
      </p>

    </div>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html)
}


async function sendTransactionEmail(
  userEmail,
  name,
  amount,
  fromAccount,
  toAccount
) {
  const formattedAmount = Number(amount).toLocaleString("en-IN");

  const maskAccount = (acc) => {
    return `XXXXXX${String(acc).slice(-4)}`;
  };

  const maskedFrom = maskAccount(fromAccount);
  const maskedTo = maskAccount(toAccount);

  const transactionId = `TXN${Date.now()}`;

  const transactionTime = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `₹${formattedAmount} Transfer Successful – AJLedger`;

  const text = `
Dear ${name},

Your transaction has been completed successfully.

Transaction Details
--------------------------------------------------
Transaction ID : ${transactionId}
Amount         : ₹${formattedAmount}
From Account   : ${maskedFrom}
To Account     : ${maskedTo}
Date & Time    : ${transactionTime}
--------------------------------------------------

The transfer was securely processed through AJLedger.

If you did not authorize this transaction, please contact our support team immediately.

Security Reminder:
Never share your OTP, password, or banking credentials with anyone.

Thank you for banking with AJLedger.

Warm regards,
Team AJLedger
`;

  const html = `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f4f6f8;
    padding: 30px;
  ">

    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    ">

      <div style="
        background-color: #1a237e;
        color: white;
        padding: 24px;
        text-align: center;
      ">
        <h2 style="margin: 0;">
          Transaction Successful
        </h2>
      </div>

      <div style="padding: 35px; color: #333;">

        <p style="font-size: 16px;">
          Dear <strong>${name}</strong>,
        </p>

        <p style="line-height: 1.6;">
          Your transaction has been completed successfully through
          <strong>AJLedger</strong>.
        </p>

        <div style="
          background-color: #f8f9fc;
          border: 1px solid #dfe3eb;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        ">

          <table
            width="100%"
            cellpadding="10"
            cellspacing="0"
            style="font-size: 14px; border-collapse: collapse;"
          >

            <tr>
              <td><strong>Transaction ID</strong></td>
              <td style="text-align: right;">
                ${transactionId}
              </td>
            </tr>

            <tr>
              <td><strong>Amount</strong></td>
              <td style="
                text-align: right;
                color: #1a237e;
                font-weight: bold;
              ">
                ₹${formattedAmount}
              </td>
            </tr>

            <tr>
              <td><strong>From Account</strong></td>
              <td style="text-align: right;">
                ${maskedFrom}
              </td>
            </tr>

            <tr>
              <td><strong>To Account</strong></td>
              <td style="text-align: right;">
                ${maskedTo}
              </td>
            </tr>

            <tr>
              <td><strong>Date & Time</strong></td>
              <td style="text-align: right;">
                ${transactionTime}
              </td>
            </tr>

          </table>
        </div>

        <div style="
          background-color: #fff8e1;
          border-left: 4px solid #f9a825;
          padding: 14px 16px;
          margin: 24px 0;
          line-height: 1.6;
        ">
          <strong>Security Reminder:</strong><br />
          Never share your OTP, password, or banking credentials with anyone.
        </div>

        <p style="line-height: 1.6;">
          If you did not authorize this transaction,
          please contact our support team immediately.
        </p>

        <p style="margin-top: 35px;">
          Thank you for banking with AJLedger.
        </p>

        <p style="margin-top: 25px;">
          Warm regards,<br />
          <strong>Team AJLedger</strong>
        </p>

      </div>
    </div>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}


async function sendTransactionFailureEmail(
  userEmail,
  name,
  amount,
  fromAccount,
  toAccount,
  reason = "The transaction could not be processed at this time."
) {
  const formattedAmount = Number(amount).toLocaleString("en-IN");

  const maskAccount = (acc) => {
    return `XXXXXX${String(acc).slice(-4)}`;
  };

  const maskedFrom = maskAccount(fromAccount);
  const maskedTo = maskAccount(toAccount);

  const transactionId = `TXN${Date.now()}`;

  const transactionTime = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `₹${formattedAmount} Transfer Failed – AJLedger`;

  const text = `
Dear ${name},

We regret to inform you that your transaction could not be completed.

Transaction Details
--------------------------------------------------
Transaction ID : ${transactionId}
Amount         : ₹${formattedAmount}
From Account   : ${maskedFrom}
To Account     : ${maskedTo}
Date & Time    : ${transactionTime}
--------------------------------------------------

Reason:
${reason}

No amount has been debited from your account if the transaction was unsuccessful.

If the issue persists, please contact our support team for assistance.

Security Reminder:
Never share your OTP, password, or banking credentials with anyone.

Thank you for banking with AJLedger.

Warm regards,
Team AJLedger
`;

  const html = `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f4f6f8;
    padding: 30px;
  ">

    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    ">

      <div style="
        background-color: #c62828;
        color: white;
        padding: 24px;
        text-align: center;
      ">
        <h2 style="margin: 0;">
          Transaction Failed
        </h2>
      </div>

      <div style="padding: 35px; color: #333;">

        <p style="font-size: 16px;">
          Dear <strong>${name}</strong>,
        </p>

        <p style="line-height: 1.6;">
          We regret to inform you that your transaction through
          <strong>AJLedger</strong> could not be completed.
        </p>

        <div style="
          background-color: #fdf7f7;
          border: 1px solid #f0d6d6;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        ">

          <table
            width="100%"
            cellpadding="10"
            cellspacing="0"
            style="font-size: 14px; border-collapse: collapse;"
          >

            <tr>
              <td><strong>Transaction ID</strong></td>
              <td style="text-align: right;">
                ${transactionId}
              </td>
            </tr>

            <tr>
              <td><strong>Amount</strong></td>
              <td style="
                text-align: right;
                color: #c62828;
                font-weight: bold;
              ">
                ₹${formattedAmount}
              </td>
            </tr>

            <tr>
              <td><strong>From Account</strong></td>
              <td style="text-align: right;">
                ${maskedFrom}
              </td>
            </tr>

            <tr>
              <td><strong>To Account</strong></td>
              <td style="text-align: right;">
                ${maskedTo}
              </td>
            </tr>

            <tr>
              <td><strong>Date & Time</strong></td>
              <td style="text-align: right;">
                ${transactionTime}
              </td>
            </tr>

            <tr>
              <td><strong>Reason</strong></td>
              <td style="
                text-align: right;
                color: #c62828;
              ">
                ${reason}
              </td>
            </tr>

          </table>
        </div>

        <div style="
          background-color: #fff3f3;
          border-left: 4px solid #c62828;
          padding: 14px 16px;
          margin: 24px 0;
          line-height: 1.6;
        ">
          <strong>Important:</strong><br />
          No amount has been debited from your account if the transaction was unsuccessful.
        </div>

        <div style="
          background-color: #fff8e1;
          border-left: 4px solid #f9a825;
          padding: 14px 16px;
          margin: 24px 0;
          line-height: 1.6;
        ">
          <strong>Security Reminder:</strong><br />
          Never share your OTP, password, or banking credentials with anyone.
        </div>

        <p style="line-height: 1.6;">
          If the issue persists, please contact our support team for assistance.
        </p>

        <p style="margin-top: 35px;">
          Thank you for banking with AJLedger.
        </p>

        <p style="margin-top: 25px;">
          Warm regards,<br />
          <strong>Team AJLedger</strong>
        </p>

      </div>
    </div>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}




module.exports = {
    sendRegistrationEmail, sendTransactionEmail, sendTransactionFailureEmail
}