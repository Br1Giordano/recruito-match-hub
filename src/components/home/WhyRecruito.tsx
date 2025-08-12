import React from "react";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Success fee a risultato",
    desc: "Paghi solo quando assumi il candidato giusto.",
  },
  {
    title: "Trasparenza totale",
    desc: "Processo chiaro, comunicazioni tracciate, feedback costanti.",
  },
  {
    title: "Network selezionato",
    desc: "Recruiter verificati e specializzati nei principali settori.",
  },
];

const WhyRecruito: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container-startup">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-navy">
          Perché Recruito
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-2xl p-6 shadow-startup hover-startup"
            >
              <h3 className="text-xl font-semibold mb-2 text-navy">{c.title}</h3>
              <p className="text-muted-foreground">{c.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRecruito;
