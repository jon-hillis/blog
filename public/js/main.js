document.addEventListener('DOMContentLoaded', () => {
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                alert('Error sending message. Please try again.');
                console.error(error);
            }
        });
    }

    // ConvertKit form handling
    const convertKitForms = document.querySelectorAll('form[data-convertkit="true"]');
    convertKitForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;

            try {
                const response = await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        api_key: 'YOUR_API_KEY',
                        email: email
                    })
                });

                if (response.ok) {
                    alert('Successfully subscribed!');
                    form.reset();
                } else {
                    throw new Error('Failed to subscribe');
                }
            } catch (error) {
                alert('Error subscribing. Please try again.');
                console.error(error);
            }
        });
    });
}); 