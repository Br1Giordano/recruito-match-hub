import { Separator } from "@/components/ui/separator";
const Footer = () => {
  return <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/d3a069d3-8d13-43da-8ec3-997d3a92cdb6.png" alt="Recruito Symbol" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">Recruito</span>
            </div>
            <p className="text-gray-400">
              La piattaforma che connette PMI italiane con i migliori recruiter freelance.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Per le Aziende</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Come funziona</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prezzi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Caso di successo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Per i Recruiter</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Diventa Partner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Requisiti</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guadagni</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Supporto</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contatti</h4>
            <ul className="space-y-2 text-gray-400">
              <li>contact.recruito@gmail.com</li>
              <li>+39 3440554181</li>
              <li>Milano, Italia</li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-gray-700 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Recruito. Tutti i diritti riservati.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Termini di Servizio
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;