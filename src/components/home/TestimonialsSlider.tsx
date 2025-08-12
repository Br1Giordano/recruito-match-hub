import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  approved?: boolean;
}

const TestimonialsSlider: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    (supabase as any)
      .from("testimonials")
      .select("id, name, role, company, quote, approved")
      .eq("approved", true)
      .then(({ data, error }: any) => {
        if (!mounted) return;
        if (error) {
          console.warn("testimonials error", error.message);
          setItems([]);
          return;
        }
        setItems((data as Testimonial[]) || []);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;

  const current = items[index];

  return (
    <section aria-label="Testimonianze" className="py-20">
      <div className="container-startup">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-navy">Cosa dicono di noi</h2>
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass p-8 rounded-2xl shadow-startup text-center"
            >
              <p className="text-xl md:text-2xl leading-relaxed">“{current.quote}”</p>
              <footer className="mt-4 text-muted-foreground">
                <strong className="text-foreground">{current.name}</strong>
                {current.role ? ` · ${current.role}` : ""}
                {current.company ? ` @ ${current.company}` : ""}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
