import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Send, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
      
      // Debug logging (remove in production)
      console.log('Formspree endpoint:', formspreeEndpoint);
      
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
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      toast({
        title: 'Message sent!',
        description: 'Thank you for reaching out. I\'ll get back to you soon.',
        variant: 'default',
      });

      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again or contact me directly via email.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            I'm currently open to new opportunities. Whether you have a question 
            or just want to say hi, I'll get back to you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Let's Connect</h3>
            
            <div className="space-y-6">
              <ContactItem
                icon={<Mail className="text-primary" size={24} />}
                label="Email"
                value="hassanrj245@gmail.com"
                href="mailto:hassanrj245@gmail.com"
              />
              <ContactItem
                icon={<Phone className="text-primary" size={24} />}
                label="Phone"
                value="+91 8710030521"
                href="tel:+918710030521"
              />
              <ContactItem
                icon={<MapPin className="text-primary" size={24} />}
                label="Location"
                value="India"
              />
            </div>

            <div className="pt-6">
              <h4 className="text-lg font-medium mb-4">Find me on</h4>
              <div className="flex gap-4">
                <SocialLink
                  href="https://www.linkedin.com/in/hassan0777/"
                  icon={<Linkedin size={22} />}
                  label="LinkedIn"
                />
                <SocialLink
                  href="https://github.com/hassarch"
                  icon={<Github size={22} />}
                  label="GitHub"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl hover-glow transition-all duration-500">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="name" className="mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="message" className="mb-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  className="bg-secondary/50 border-border focus:border-primary focus:ring-primary resize-none"
                  placeholder="Your message..."
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full group" 
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
                    <Send className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactItem = ({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) => (
  <div className="flex items-center gap-4 group">
    <div className="p-3 rounded-xl glass-card group-hover:border-primary/50 transition-all duration-300">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {href ? (
        <a
          href={href}
          className="text-foreground hover:text-primary transition-colors duration-300"
        >
          {value}
        </a>
      ) : (
        <p className="text-foreground">{value}</p>
      )}
    </div>
  </div>
);

const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="p-3 rounded-xl glass-card text-muted-foreground hover:text-primary hover:border-primary/50 hover-glow transition-all duration-300"
  >
    {icon}
  </a>
);

export default ContactSection;
