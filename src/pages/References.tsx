import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, LayoutGrid, Calculator, MessageSquare, Phone } from 'lucide-react';

const References = () => {
  const projects = [
    { 
      title: "Exklusiver Online-Weinshop", 
      customer: "Vierkorken",
      category: "E-Commerce", 
      tags: ["Webdesign", "Frontend", "React"],
      desc: "Individueller E-Commerce-Shop mit Fokus auf Premium-Weine und automatisierte Lagerverwaltung.", 
      img: "/referenzen/vierkorken.png",
      url: "https://vierkorken.ch"
    },
    { 
      title: "Moderne Metallbau-Präsenz", 
      customer: "Metallwerk",
      category: "Webdesign", 
      tags: ["Webdesign", "Portfolio", "SEO"],
      desc: "Präsentation von anspruchsvollen Metallbau-Projekten mit Fokus auf Design und technische Exzellenz.", 
      img: "/referenzen/metallwerk-swiss.png",
      url: "https://gygmor.github.io/Metallwerk/"
    },
    { 
      title: "Traditionelle Handwerkskunst", 
      customer: "Käserei Seetal",
      category: "Webentwicklung", 
      tags: ["Webentwicklung", "Local SEO", "CMS"],
      desc: "Digitale Präsenz für eine traditionelle Schweizer Käserei zur Bewerbung regionaler Produkte.", 
      img: "/referenzen/kaeserei-seetal.png",
      url: "https://gygmor.github.io/kaeserei-seetal/"
    },
    { 
      title: "Professionelle Reinigungssysteme", 
      customer: "Baumann Reinigungssysteme",
      category: "Frontend", 
      tags: ["Frontend", "UX/UI", "Service App"],
      desc: "Moderne Webseite für einen Reinigungsbetrieb mit interaktivem Buchungsformular und Leistungsübersicht.", 
      img: "/referenzen/bamann.png",
      url: "https://gygmor.github.io/clean-flow/"
    }
  ];

  return (
    <div className="page-references">
      <section className="hero">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="hero-tag">Portfolio</span>
            <h1 className="hero-title">Unsere <span className="premium-gradient">Referenzen</span></h1>
            <p className="hero-desc" style={{ margin: '0 auto' }}>Wir verwandeln Visionen in digitale Realität. Entdecken Sie eine Auswahl unserer neuesten Projekte.</p>
          </motion.div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="items-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            {projects.map((p, i) => (
              <motion.div 
                key={i} 
                className="reference-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="reference-image">
                  <img src={p.img} alt={p.title} />
                  <div className="reference-overlay">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-visit">
                      Zur Webseite <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
                
                <div className="reference-content">
                  <div className="reference-tags">
                    {p.tags.map(tag => <span key={tag} className="ref-tag">{tag}</span>)}
                  </div>
                  <span className="ref-customer">Kunde: {p.customer}</span>
                  <h3 className="ref-title">{p.title}</h3>
                  <p className="ref-desc">{p.desc}</p>
                  
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-visit lg-hidden">
                    Projekt ansehen <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default References;
