// Ez Gmail - Prebuilt Template Library
// Ez IT Solutions - http://www.Ez-IT-Solutions.com
// Professional email templates ready to use

const TEMPLATE_LIBRARY = {
  // Work/Professional Templates
  work: [
    {
      name: 'Meeting Follow-up',
      category: 'Work',
      subject: 'Re: Meeting with {{name}}',
      body: `Hi {{name}},

Thank you for taking the time to meet with me today. I really enjoyed our discussion about {{topic}}.

As we discussed, the next steps are:
- {{nextStep1}}
- {{nextStep2}}

I'll follow up with you by {{followUpDate}} to check on progress.

Please let me know if you have any questions in the meantime.

Best regards,
{{yourName}}`
    },
    {
      name: 'Project Update',
      category: 'Work',
      subject: '{{projectName}} - Status Update',
      body: `Hi {{recipientName}},

I wanted to give you a quick update on {{projectName}}.

Current Status: {{status}}

Completed This Week:
- {{accomplishment1}}
- {{accomplishment2}}

Next Week's Goals:
- {{goal1}}
- {{goal2}}

Timeline: {{timeline}}

Let me know if you have any questions or concerns.

Best regards,
{{yourName}}`
    },
    {
      name: 'Out of Office',
      category: 'Work',
      subject: 'Out of Office: {{yourName}}',
      body: `Thank you for your email.

I am currently out of the office from {{startDate}} to {{endDate}} with limited access to email.

If you need immediate assistance, please contact:
{{backupContact}} at {{backupEmail}}

I will respond to your message when I return on {{returnDate}}.

Best regards,
{{yourName}}`
    },
    {
      name: 'Introduction Email',
      category: 'Work',
      subject: 'Introduction: {{person1}} and {{person2}}',
      body: `Hi {{person1}} and {{person2}},

I'd like to introduce you to each other!

{{person1}}, meet {{person2}} - {{person2Description}}

{{person2}}, meet {{person1}} - {{person1Description}}

I think you two would benefit from connecting about {{topic}}.

I'll let you take it from here!

Best,
{{yourName}}`
    },
    {
      name: 'Thank You - Professional',
      category: 'Work',
      subject: 'Thank You - {{occasion}}',
      body: `Hi {{name}},

I wanted to take a moment to thank you for {{reason}}.

Your {{contribution}} made a significant impact on {{outcome}}.

I truly appreciate your {{quality}} and look forward to working together again.

Best regards,
{{yourName}}`
    },
    {
      name: 'Request for Information',
      category: 'Work',
      subject: 'Request: {{topic}}',
      body: `Hi {{name}},

I hope this email finds you well.

I'm reaching out to request information about {{topic}}.

Specifically, I need:
- {{item1}}
- {{item2}}
- {{item3}}

Would you be able to provide this by {{deadline}}?

Please let me know if you need any clarification.

Thank you,
{{yourName}}`
    },
    {
      name: 'Meeting Request',
      category: 'Work',
      subject: 'Meeting Request: {{topic}}',
      body: `Hi {{name}},

I'd like to schedule a meeting to discuss {{topic}}.

Proposed times:
- {{option1}}
- {{option2}}
- {{option3}}

The meeting should take approximately {{duration}}.

Please let me know which time works best for you, or suggest an alternative.

Looking forward to connecting,
{{yourName}}`
    }
  ],

  // Support/Customer Service Templates
  support: [
    {
      name: 'Issue Acknowledgment',
      category: 'Support',
      subject: 'Re: {{issueType}} - Ticket #{{ticketNumber}}',
      body: `Hi {{customerName}},

Thank you for contacting us about {{issueType}}.

I've received your request and created ticket #{{ticketNumber}} to track this issue.

I understand that {{issueSummary}}, and I'm here to help resolve this as quickly as possible.

I'm currently investigating and will update you within {{timeframe}} with either a solution or next steps.

If you have any additional information that might help, please reply to this email.

Best regards,
{{supportName}}
{{companyName}} Support Team`
    },
    {
      name: 'Issue Resolved',
      category: 'Support',
      subject: 'Resolved: {{issueType}} - Ticket #{{ticketNumber}}',
      body: `Hi {{customerName}},

Great news! I've resolved the issue with {{issueType}}.

What was done:
{{resolution}}

You should now be able to {{expectedOutcome}}.

I'm marking this ticket as resolved, but please don't hesitate to reach out if you experience any further issues or have questions.

Thank you for your patience!

Best regards,
{{supportName}}
{{companyName}} Support Team`
    },
    {
      name: 'Follow-up Check-in',
      category: 'Support',
      subject: 'Follow-up: {{issueType}}',
      body: `Hi {{customerName}},

I'm following up on the {{issueType}} issue we resolved on {{resolutionDate}}.

I wanted to check in and make sure everything is still working properly.

Is everything functioning as expected?

If you're experiencing any issues or have questions, please let me know and I'll be happy to help.

Best regards,
{{supportName}}
{{companyName}} Support Team`
    },
    {
      name: 'Feedback Request',
      category: 'Support',
      subject: 'How did we do? Ticket #{{ticketNumber}}',
      body: `Hi {{customerName}},

Thank you for contacting {{companyName}} support regarding {{issueType}}.

We'd love to hear about your experience! Your feedback helps us improve our service.

How would you rate your support experience?
⭐⭐⭐⭐⭐ Excellent
⭐⭐⭐⭐ Good
⭐⭐⭐ Average
⭐⭐ Below Average
⭐ Poor

Any additional comments or suggestions?

Thank you for being a valued customer!

Best regards,
{{supportName}}
{{companyName}} Support Team`
    },
    {
      name: 'Escalation Notice',
      category: 'Support',
      subject: 'Update: {{issueType}} - Escalated',
      body: `Hi {{customerName}},

I wanted to update you on ticket #{{ticketNumber}} regarding {{issueType}}.

This issue requires specialized attention, so I've escalated it to our {{teamName}} team.

{{specialistName}} will be taking over and will contact you within {{timeframe}} with an update.

Your ticket remains a priority, and we're committed to resolving this as quickly as possible.

Thank you for your patience and understanding.

Best regards,
{{supportName}}
{{companyName}} Support Team`
    }
  ],

  // Sales/Business Templates
  sales: [
    {
      name: 'Cold Outreach',
      category: 'Sales',
      subject: '{{topic}} for {{companyName}}',
      body: `Hi {{name}},

I hope this email finds you well.

I'm reaching out because I noticed that {{companyName}} {{observation}}.

We specialize in helping companies like yours {{solution}}.

Our clients typically see:
- {{benefit1}}
- {{benefit2}}
- {{benefit3}}

Would you be open to a brief 15-minute call to discuss how we might help {{companyName}} achieve {{goal}}?

I have availability {{availability}}.

Looking forward to connecting,
{{yourName}}
{{yourTitle}}
{{yourCompany}}`
    },
    {
      name: 'Proposal Follow-up',
      category: 'Sales',
      subject: 'Following up: {{proposalName}}',
      body: `Hi {{name}},

I wanted to follow up on the proposal I sent on {{proposalDate}} for {{projectName}}.

Have you had a chance to review it?

I'm happy to answer any questions or discuss any aspects of the proposal in more detail.

Key highlights:
- {{highlight1}}
- {{highlight2}}
- {{highlight3}}

Would you like to schedule a call to discuss next steps?

Best regards,
{{yourName}}
{{yourTitle}}
{{yourCompany}}`
    },
    {
      name: 'Quote/Estimate',
      category: 'Sales',
      subject: 'Quote for {{projectName}}',
      body: `Hi {{name}},

Thank you for your interest in {{service}}.

Based on our discussion, here's a quote for {{projectName}}:

Services:
- {{service1}}: {{price1}}
- {{service2}}: {{price2}}
- {{service3}}: {{price3}}

Total: {{totalPrice}}

Timeline: {{timeline}}
Payment Terms: {{paymentTerms}}

This quote is valid until {{expirationDate}}.

Please let me know if you have any questions or would like to proceed.

Best regards,
{{yourName}}
{{yourTitle}}
{{yourCompany}}`
    },
    {
      name: 'Invoice Reminder',
      category: 'Sales',
      subject: 'Payment Reminder: Invoice #{{invoiceNumber}}',
      body: `Hi {{name}},

I hope you're doing well.

This is a friendly reminder that invoice #{{invoiceNumber}} for {{amount}} was due on {{dueDate}}.

Invoice Details:
- Date: {{invoiceDate}}
- Amount: {{amount}}
- Services: {{services}}

If you've already sent payment, please disregard this email. Otherwise, please let me know if you have any questions or need a copy of the invoice.

Payment can be made via:
{{paymentMethods}}

Thank you,
{{yourName}}
{{yourCompany}}`
    },
    {
      name: 'Welcome New Client',
      category: 'Sales',
      subject: 'Welcome to {{companyName}}!',
      body: `Hi {{clientName}},

Welcome to {{companyName}}! We're thrilled to have you as a client.

Here's what happens next:
1. {{step1}}
2. {{step2}}
3. {{step3}}

Your main point of contact will be:
{{contactName}} - {{contactEmail}} - {{contactPhone}}

Important information:
- Account Number: {{accountNumber}}
- Start Date: {{startDate}}
- {{additionalInfo}}

If you have any questions, don't hesitate to reach out. We're here to help!

Welcome aboard,
{{yourName}}
{{yourTitle}}
{{companyName}}`
    }
  ],

  // Personal Templates
  personal: [
    {
      name: 'Event Invitation',
      category: 'Personal',
      subject: 'You\'re Invited: {{eventName}}',
      body: `Hi {{name}},

I'm excited to invite you to {{eventName}}!

Details:
📅 Date: {{date}}
🕐 Time: {{time}}
📍 Location: {{location}}

{{eventDescription}}

Please RSVP by {{rsvpDate}} so I can plan accordingly.

Hope to see you there!

Best,
{{yourName}}`
    },
    {
      name: 'RSVP Response',
      category: 'Personal',
      subject: 'Re: {{eventName}} - RSVP',
      body: `Hi {{hostName}},

Thank you for the invitation to {{eventName}}!

I'm {{response}} to attend.

{{additionalMessage}}

Looking forward to it!

Best,
{{yourName}}`
    },
    {
      name: 'Thank You - Personal',
      category: 'Personal',
      subject: 'Thank You!',
      body: `Hi {{name}},

I wanted to say thank you for {{reason}}.

{{personalMessage}}

Your {{quality}} means so much to me, and I'm grateful to have you in my life.

Thanks again,
{{yourName}}`
    },
    {
      name: 'Apology',
      category: 'Personal',
      subject: 'My Apologies',
      body: `Hi {{name}},

I wanted to reach out and apologize for {{situation}}.

{{explanation}}

I understand that this may have {{impact}}, and I take full responsibility.

Moving forward, I will {{commitment}}.

I value our relationship and hope you can accept my sincere apology.

Best regards,
{{yourName}}`
    },
    {
      name: 'Congratulations',
      category: 'Personal',
      subject: 'Congratulations on {{achievement}}!',
      body: `Hi {{name}},

Congratulations on {{achievement}}!

{{personalMessage}}

You should be incredibly proud of this accomplishment. Your hard work and dedication have truly paid off.

Wishing you continued success,
{{yourName}}`
    }
  ],

  // Signature Templates
  signature: [
    {
      name: 'Professional Signature',
      category: 'Signature',
      subject: '',
      body: `Best regards,
{{yourName}}
{{yourTitle}}
{{companyName}}

📧 {{email}}
📱 {{phone}}
🌐 {{website}}`
    },
    {
      name: 'Corporate Signature',
      category: 'Signature',
      subject: '',
      body: `Sincerely,

{{yourName}}
{{yourTitle}} | {{department}}
{{companyName}}

E: {{email}}
P: {{phone}}
W: {{website}}

{{address}}
{{city}}, {{state}} {{zip}}`
    },
    {
      name: 'Tech Professional Signature',
      category: 'Signature',
      subject: '',
      body: `Thanks,
{{yourName}}

{{yourTitle}} @ {{companyName}}
{{email}} | {{phone}}
{{website}}

Connect with me:
LinkedIn: {{linkedIn}}
GitHub: {{github}}`
    },
    {
      name: 'Sales Signature',
      category: 'Signature',
      subject: '',
      body: `Best,

{{yourName}}
{{yourTitle}}
{{companyName}}

Let's connect!
📞 {{phone}}
📧 {{email}}
📅 Schedule a call: {{calendarLink}}
🌐 {{website}}`
    },
    {
      name: 'Support Signature',
      category: 'Signature',
      subject: '',
      body: `Thank you,

{{yourName}}
{{supportTeam}} Team
{{companyName}}

Need help? Contact us:
📧 {{supportEmail}}
📞 {{supportPhone}}
💬 Live Chat: {{chatLink}}
📚 Help Center: {{helpCenterLink}}`
    },
    {
      name: 'Executive Signature',
      category: 'Signature',
      subject: '',
      body: `Regards,

{{yourName}}
{{yourTitle}}
{{companyName}}

Office: {{officePhone}}
Mobile: {{mobilePhone}}
Email: {{email}}

{{companyTagline}}`
    },
    {
      name: 'Consultant Signature',
      category: 'Signature',
      subject: '',
      body: `Best regards,

{{yourName}}, {{credentials}}
{{consultingTitle}}

{{email}} | {{phone}}
{{website}}

Specializing in: {{specialization}}

Book a consultation: {{bookingLink}}`
    },
    {
      name: 'Minimal Signature',
      category: 'Signature',
      subject: '',
      body: `{{yourName}}
{{email}} | {{phone}}`
    }
  ],

  // Follow-up Templates
  followup: [
    {
      name: 'General Follow-up',
      category: 'Follow-up',
      subject: 'Following up: {{topic}}',
      body: `Hi {{name}},

I wanted to follow up on {{topic}} that we discussed on {{date}}.

{{context}}

Have you had a chance to {{action}}?

Please let me know if you need any additional information from me.

Best regards,
{{yourName}}`
    },
    {
      name: 'No Response Follow-up',
      category: 'Follow-up',
      subject: 'Re: {{originalSubject}}',
      body: `Hi {{name}},

I wanted to follow up on my previous email from {{originalDate}} regarding {{topic}}.

I understand you're busy, but I wanted to make sure my message didn't get lost.

{{briefSummary}}

Is this still a priority for you? If not, no problem - just let me know so I can plan accordingly.

Best regards,
{{yourName}}`
    }
  ]
};

// Export for use in template manager
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TEMPLATE_LIBRARY;
}

// Make available globally for extension pages
if (typeof window !== 'undefined') {
  window.TEMPLATE_LIBRARY = TEMPLATE_LIBRARY;
}
