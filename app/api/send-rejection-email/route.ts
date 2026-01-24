import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, projectTitle, reason } = await request.json();

    if (!email || !projectTitle || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    if (!smtpUser || !smtpPass) {
      console.log('SMTP not configured. Email would be sent to:', email);
      console.log('Project:', projectTitle);
      console.log('Reason:', reason);
      return NextResponse.json({ 
        success: true, 
        message: 'Email logging only - SMTP not configured' 
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `SLRI Platform <${smtpUser}>`,
      to: email,
      subject: `Project Submission Update: ${projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Project Submission Update</h2>
          <p>Dear Student,</p>
          <p>Your project submission "<strong>${projectTitle}</strong>" has been reviewed by our team.</p>
          <p>Unfortunately, we are unable to approve your submission at this time. Please see the feedback below:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0;">
            <strong>Feedback:</strong>
            <p>${reason}</p>
          </div>
          <p>Please make the necessary changes and resubmit your project.</p>
          <p>If you have any questions, please contact the SLRI team.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>SLRI Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
