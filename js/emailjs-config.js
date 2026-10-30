/* =====================================================================
   EMAILJS CONFIG  –  the ONLY file you need to edit for the forms.
   Used by: contact.html and the "Enquire Now" form on every program page.

   SETUP (5 minutes):
   1. Create a free account at https://www.emailjs.com
   2. Email Services  -> add your mail provider  -> copy the SERVICE ID
   3. Email Templates -> create a template        -> copy the TEMPLATE ID
   4. Account > General                           -> copy the PUBLIC KEY
   5. Paste the three values below. Nothing else needs to change.

   TEMPLATE VARIABLES – use these names inside your EmailJS template:
        {{from_name}}       Full Name
        {{mobile}}          Mobile No
        {{from_email}}      Email         (set this as "Reply-To" in the template)
        {{subject}}         Subject
        {{message}}         Requirement
        {{travel_support}}  Travel & Accommodation Support (Yes / No)
        {{program}}         Which page the enquiry came from
        {{page_url}}        Full URL of that page
   ===================================================================== */
window.EMAILJS_CONFIG = {
  publicKey:  'KMz0CeGkUnJobJMhK',
  serviceId:  'service_6yh7xh6',
  templateId: 'template_tdcdtb8',

  /* Messages shown under the Submit button */
  messages: {
    sending:       'Sending your enquiry…',
    success:       'Thank you! Your enquiry has been sent. We will get back to you shortly.',
    error:         'Sorry, something went wrong while sending. Please try again or email us directly.',
    notConfigured: 'The email service is not set up yet. Add your EmailJS keys in js/emailjs-config.js.',
    invalid:       'Please fill in all required fields correctly.'
  }
};
