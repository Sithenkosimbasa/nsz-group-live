'use strict';

/* WhatsApp and email redirect logic */

function handleFormRedirect(formData) {
  const contactMethodValue = formData.get('contact_method');
  const name = formData.get('full_name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const packageName = formData.get('package');
  const category = formData.get('category');
  const price = formData.get('price');
  const message = formData.get('notes') || '';

  if (contactMethodValue === 'whatsapp' && phone) {
    // Build WhatsApp message
    const whatsappMessage = `Hi NSZ Group 👋

I've selected a package from your website!

📦 Package: ${packageName}
💰 Price: ${price}
👤 Name: ${name}
🏢 Business: ${formData.get('business') || 'N/A'}
📧 Email: ${email}
📞 Phone: ${phone}
🕐 Best time to reach me: ${formData.get('contact_time') || 'Anytime'}

Notes: ${message}`;

    const whatsappUrl = `https://wa.me/27634337174?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  } else if (contactMethodValue === 'email' && email) {
    // Build email
    const subject = `New Enquiry — ${packageName} — ${name}`;
    const body = `Hi NSZ Group,

I've selected a package from your website!

Package: ${packageName}
Price: ${price}
Name: ${name}
Business: ${formData.get('business') || 'N/A'}
Email: ${email}
Phone: ${phone}
Best time to reach me: ${formData.get('contact_time') || 'Anytime'}

Notes: ${message}

Best regards,
${name}`;

    const emailUrl = `mailto:mandlmabasa53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
  }
}