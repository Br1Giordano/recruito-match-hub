
import { Wrench, Clock, Mail } from "lucide-react";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-recruito-blue/5 via-recruito-teal/5 to-recruito-green/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-recruito-blue to-recruito-teal rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Sito in Manutenzione
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Stiamo lavorando per migliorare la tua esperienza su Recruito. 
              Il sito tornerà online a breve.
            </p>

            <div className="flex items-center justify-center gap-2 text-recruito-blue">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Tempo stimato: 30 minuti</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Per urgenze, contattaci:
            </p>
            <div className="flex items-center justify-center gap-2 text-recruito-teal">
              <Mail className="h-5 w-5" />
              <a 
                href="mailto:contact.recruito@gmail.com" 
                className="font-medium hover:underline"
              >
                contact.recruito@gmail.com
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-sm text-gray-500">
            Grazie per la pazienza! 🚀
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
