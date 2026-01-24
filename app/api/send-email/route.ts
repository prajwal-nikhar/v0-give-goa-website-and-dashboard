import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { project } = await req.json();

    if (!project) {
      return NextResponse.json({ error: 'Project data not provided' }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    if (!smtpUser || !smtpPass) {
      console.log('SMTP not configured. Email would be sent for project:', project.title);
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

    const isApproved = project.status === 'approved';
    const subject = isApproved 
      ? `Project Approved: ${project.title}`
      : `Project Update: ${project.title}`;
    
    const htmlContent = isApproved
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Congratulations!</h2>
          <p>Dear Student,</p>
          <p>Your project submission "<strong>${project.title}</strong>" has been approved!</p>
          <p>Your project is now live on the SLRI platform and visible to the community.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>SLRI Team</strong></p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Project Status Update</h2>
          <p>Dear Student,</p>
          <p>Your project submission "<strong>${project.title}</strong>" status has been updated to: <strong>${project.status}</strong>.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>SLRI Team</strong></p>
        </div>
      `;

    const mailOptions = {
      from: `SLRI Platform <${smtpUser}>`,
      to: project.submitter_email,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
