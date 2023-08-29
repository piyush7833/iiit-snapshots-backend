
const emailTemplate=(url,subject,userName,para,task,ignore)=>(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IIITU Snapshot - Email Verification</title>
    <style>
        /* Add your custom styles here */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1a1a1a;
            padding: 20px;
            border: 1px solid #333;
            color: #ffffff;
        }
        .header {
            text-align: center;
            background-color: #201e1e;
        }
        .header img {
            width: 150px;
        }
        .content {
            padding: 20px;
        }
        .verification-button {
            display: inline-block;
            background-color: #e74c3c;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            background-color: #221d1d;
            padding: 10px;
            color: #ffffff;
        }
        .footer a {
            color: #ffffff;
            text-decoration: none;
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://firebasestorage.googleapis.com/v0/b/iiitusnapshots.appspot.com/o/logo%2Flogo.png?alt=media&token=97c6d29b-0d79-47f0-9533-d7b62a7e46d5" alt="IIITU Snapshot Logo">
        </div>
        <div class="content">
            <h2 style="color: #e74c3c;">${subject}</h2>
            <p>Hello <strong> ${userName} </strong>,</p>
            <p>${para}</p>
            <p><a href="[VerificationLink]" class="verification-button">${task}</a></p>
            <p>${ignore}</p>
            <p style="font-style: italic;">Best regards,<br>IIITU Snapshot Team</p>
        </div>
        <div class="footer">
            <a href="https://www.instagram.com/_piyush_8_3_3/">Instagram</a>
            <a href="https://www.linkedin.com/in/piyush-singh-403089221/">LinkedIn</a>
        </div>
    </div>
</body>
</html>

`)
export default emailTemplate;