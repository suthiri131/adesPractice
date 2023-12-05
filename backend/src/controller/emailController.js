const transporter = require("../utils/email");
exports.sendEmail = async (req, res) => {
  try {
    // Extract data from the request body
    const { to, subject, text } = req.body;
    console.log(req.body);
    // Define the email options
    const mailOptions = {
      from: "VacaVerse Travel Agency <vacaverse.travel@gmail.com>",
      to,
      subject,
      text,
    };

    // Send the email using the transporter from the utility file
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
