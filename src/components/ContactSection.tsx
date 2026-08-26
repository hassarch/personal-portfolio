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
import TerminalFrame from './TerminalFrame';
import { EMAIL, PHONE, LOCATION, LINKEDIN_URL, GITHUB_URL, X_URL } from '@/constants/profile';

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
        title: '[✓] Message sent!',
        description: 'Thank you for reaching out. I\'ll get back to you soon.',
      });
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: '[✗] Error',
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
      <TerminalFrame title="~/contact">
        <div className="section-content mx-auto">
          {/* Terminal command header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className="mb-8"
          >
            <p className="font-mono text-xs sm:text-sm text-foreground opacity-60 mb-4">
              $ send_message --interactive
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground uppercase tracking-tight">
              Contact
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '6rem' }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-1 bg-foreground mt-4"
            />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="contact-grid"
          >
            {/* Contact info */}
            <motion.div variants={itemVariants} className="contact-info">
              <div className="space-y-6">
                <ContactItem icon={<Mail size={18} />} label="--email" value={EMAIL} href={`mailto:${EMAIL}`} />
                <ContactItem icon={<Phone size={18} />} label="--phone" value={PHONE} href={`tel:${PHONE.replace(/\s/g, '')}`} />
                <ContactItem icon={<MapPin size={18} />} label="--location" value={LOCATION} />
              </div>

              <div className="pt-4">
                <h4 className="text-xs font-bold mb-4 uppercase tracking-widest font-mono">[ --social ]</h4>
                <div className="flex gap-4">
                  <SocialLink href={LINKEDIN_URL} icon={<Linkedin size={20} />} label="LinkedIn" />
                  <SocialLink href={GITHUB_URL} icon={<Github size={20} />} label="GitHub" />
                  <SocialLink
                    href={X_URL}
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

            {/* Form */}
            <motion.div variants={itemVariants} className="retro-card">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Label htmlFor="name" className="contact-label font-mono">--name:</Label>
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
                  <Label htmlFor="email" className="contact-label font-mono">--email:</Label>
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
                  <Label htmlFor="message" className="contact-label font-mono">--message:</Label>
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
                      $ send --now
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </TerminalFrame>
    </section>
  );
};

const ContactItem = ({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string; }) => (
  <motion.div 
    className="contact-item group"
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <motion.div 
      className="contact-item-box"
      whileHover={{ y: -2, boxShadow: '3px 3px 0 0 currentColor' }}
    >
      {icon}
    </motion.div>
    <div>
      <p className="text-xs text-foreground font-bold uppercase tracking-widest opacity-60 mb-1 font-mono">{label}:</p>
      {href ? (
        <a href={href} className="text-foreground hover:underline transition-all duration-200 text-sm font-mono font-bold">
          {value}
        </a>
      ) : (
        <p className="text-foreground text-sm font-mono font-bold">{value}</p>
      )}
    </div>
  </motion.div>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string; }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="contact-item-box inline-flex items-center justify-center"
    whileHover={{ 
      y: -4, 
      scale: 1.1,
      boxShadow: '3px 3px 0 0 currentColor' 
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    {icon}
  </motion.a>
);

export default ContactSection;
