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
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

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
    <section id="contact" className="relative py-32 md:py-40 px-6 scroll-mt-28 sm:scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground relative inline-block">
            Get In Touch
            <span className="absolute inset-0 animate-shimmer pointer-events-none"></span>
          </h2>
          <div className="w-20 h-1 bg-foreground mx-auto rounded-full mb-8" />
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            I'm currently open to new opportunities. Whether you have a question 
            or just want to say hi, I'll get back to you!
          </p>
        </div>

        <div 
          ref={contentRef}
          className={`grid md:grid-cols-2 gap-16 transition-all duration-1000 delay-200 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="space-y-10">
            <h3 className="text-2xl md:text-3xl font-semibold mb-8">Let's Connect</h3>
            
            <div className="space-y-8">
              <ContactItem
                icon={<Mail size={20} />}
                label="Email"
                value="hassanrj245@gmail.com"
                href="mailto:hassanrj245@gmail.com"
              />
              <ContactItem
                icon={<Phone size={20} />}
                label="Phone"
                value="+91 8710030521"
                href="tel:+918710030521"
              />
              <ContactItem
                icon={<MapPin size={20} />}
                label="Location"
                value="India"
              />
            </div>

            <div className="pt-8">
              <h4 className="text-lg md:text-xl font-medium mb-6">Find me on</h4>
              <div className="flex gap-5">
                <SocialLink
                  href="https://www.linkedin.com/in/hassan0777/"
                  icon={<Linkedin size={20} />}
                  label="LinkedIn"
                />
                <SocialLink
                  href="https://github.com/hassarch"
                  icon={<Github size={20} />}
                  label="GitHub"
                />
                <SocialLink
                  href="https://x.com/sanxshade"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  }
                  label="X"
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-8 rounded-lg hover:shadow-lg hover:border-foreground/50 transition-all duration-300 animate-pulse-slow">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="name" className="mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="bg-background"
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
                  className="bg-background"
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
                  className="bg-background resize-none"
                  placeholder="Your message..."
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                )}
              </div>
              <Button 
                variant="default" 
                size="lg" 
                className="w-full hover:scale-105 transition-transform duration-300" 
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
                    <Send className="ml-2" size={16} />
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
    <div className="p-3 rounded-lg border border-border text-foreground group-hover:border-foreground group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {href ? (
        <a
          href={href}
          className="text-foreground hover:underline transition-all duration-300"
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
    className="p-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:scale-110 hover:shadow-md transition-all duration-300"
  >
    {icon}
  </a>
);

export default ContactSection;
