import { useSettings } from '@/api/hooks/useSettings';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function PublicContactPage() {
  const { data: settings, isLoading } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/v1/operations/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: formData.name,
          senderEmail: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      console.error('Failed to submit message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Contact</span>
          </p>
          <h1 className="font-heading text-[48px] lg:text-[80px] xl:text-[100px] font-bold text-foreground leading-[0.95]">
            Contact Us
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Have questions? Send us a message and we'll get back to you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
            {/* Form */}
            <div>
              {submitted ? (
                <div className="py-20 text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <h2 className="font-heading text-2xl font-bold">Message Sent!</h2>
                  <p className="text-muted-foreground">
                    Thank you for contacting us. We'll respond shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-[12px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2"
                      >
                        Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this about?"
                      className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Your message..."
                      className="w-full border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white px-8 py-3 text-[12px] font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Your message will be reviewed by authorized Center personnel and used solely to
                    respond to your inquiry. We do not share personal information with third
                    parties.
                  </p>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Contact Information
                </p>
                <div className="space-y-5">
                  {settings?.officialPhone && (
                    <div className="flex items-start gap-4">
                      <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                          Phone
                        </p>
                        <p className="text-sm">{settings.officialPhone}</p>
                      </div>
                    </div>
                  )}
                  {settings?.officialEmail && (
                    <div className="flex items-start gap-4">
                      <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                          Email
                        </p>
                        <p className="text-sm">{settings.officialEmail}</p>
                      </div>
                    </div>
                  )}
                  {settings?.physicalAddress && (
                    <div className="flex items-start gap-4">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                          Address
                        </p>
                        <p className="text-sm">{settings.physicalAddress}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                        Office Hours
                      </p>
                      <p className="text-sm">Monday – Friday, 8:00 AM – 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <PlaceholderImage label="Map Location" aspectRatio="video" className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
