import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Send, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
      
      if (!formspreeEndpoint || formspreeEndpoint.includes('YOUR_FORM_ID') || !formspreeEndpoint.startsWith('https://formspree.io')) {
        toast({
          title: 'Form Not Configured',
          description: 'The contact form is not properly configured. Please contact me directly at hassanrj245@gmail.com',
          variant: 'destructive',
        });
        reset();
        setIsSubmitting(false);
        return;
      }
      
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      toast({
        title: 'Message sent!',
        description: 'Thank you for reaching out. I\'ll get back to you soon.',
      });
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section id="contact" className="section-base">
      <div className="section-content">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
          className="section-header-wrapper"
        >
          <h2 className="section-header">
            Contact
          </h2>
          <p className="section-subtitle">
            [ Open for opportunities & collaboration ]
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="contact-grid"
        >
          <motion.div variants={itemVariants} className="contact-info">
            <div className="space-y-6">
              <ContactItem icon={<Mail size={18} />} label="Email" value="hassanrj245@gmail.com" href="mailto:hassanrj245@gmail.com" />
              <ContactItem icon={<Phone size={18} />} label="Phone" value="+91 8710030521" href="tel:+918710030521" />
              <ContactItem icon={<MapPin size={18} />} label="Location" value="India" />
            </div>

            <div className="pt-4">
              <h4 className="text-xs font-bold mb-4 uppercase tracking-widest">[ Social ]</h4>
              <div className="flex gap-4">
                <SocialLink href="https://www.linkedin.com/in/hassan0777/" icon={<Linkedin size={20} />} label="LinkedIn" />
                <SocialLink href="https://github.com/hassarch" icon={<Github size={20} />} label="GitHub" />
                <SocialLink
                  href="https://x.com/sanxshade"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  }
                  label="X"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="retro-card">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="name" className="contact-label">Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="contact-input"
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-xs text-destructive font-bold mt-2 font-mono uppercase">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="contact-label">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="contact-input"
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-xs text-destructive font-bold mt-2 font-mono uppercase">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="message" className="contact-label">Message</Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  rows={4}
                  className="contact-textarea"
                  placeholder="Initialize communication..."
                  disabled={isSubmitting}
                />
                {errors.message && <p className="text-xs text-destructive font-bold mt-2 font-mono uppercase">{errors.message.message}</p>}
              </div>
              <Button 
                className="retro-button w-full text-sm py-6 uppercase tracking-widest bg-foreground text-background hover:bg-background hover:text-foreground" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ContactItem = ({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string; }) => (
  <div className="contact-item group">
    <div className="contact-item-box group-hover:-translate-y-1">
      {icon}
    </div>
    <div>
      <p className="text-xs text-foreground font-bold uppercase tracking-widest opacity-60 mb-1">{label}</p>
      {href ? (
        <a href={href} className="text-foreground hover:underline transition-all duration-200 text-sm font-mono font-bold">
          {value}
        </a>
      ) : (
        <p className="text-foreground text-sm font-mono font-bold">{value}</p>
      )}
    </div>
  </div>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string; }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="contact-item-box hover:-translate-y-1 inline-flex items-center justify-center"
  >
    {icon}
  </a>
);

export default ContactSection;
