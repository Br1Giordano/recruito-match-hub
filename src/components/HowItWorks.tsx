import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Target, Clock, DollarSign, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import RecruiterAvatar from "./recruiter/RecruiterAvatar";
const HowItWorks = () => {
  const scrollToDemo = () => {
    console.log('scrollToDemo called from HowItWorks - looking for demo section');

    // Try multiple selectors to find the demo section
    let demoElement = document.querySelector('[data-demo-section]');
    if (!demoElement) {
      console.log('data-demo-section not found, trying #demo');
      demoElement = document.getElementById('demo');
    }
    if (!demoElement) {
      console.log('#demo not found, trying .demo-section');
      demoElement = document.querySelector('.demo-section');
    }
    if (demoElement) {
      console.log('Demo section found, scrolling...', demoElement);
      demoElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.error('Demo section not found with any selector');
      // Fallback: scroll to a reasonable position
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };
  return <section id="come-funziona" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Come funziona <span className="text-gradient">Recruito</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un processo semplice in 3 step che rivoluziona il modo di assumere delle PMI italiane
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          <div className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-recruito-blue to-recruito-teal rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Pubblica la tua ricerca
              </h3>
              <p className="text-gray-600 mb-6">
                Descrivi il profilo che cerchi in 5 minuti. Specifiche tecniche, 
                esperienza richiesta, RAL e modalità di lavoro.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Building2 className="h-5 w-5 text-recruito-blue" />
                  <span className="font-semibold text-gray-900">Senior Frontend Developer</span>
                </div>
                <div className="text-left space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>React, TypeScript</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>€45.000 - €55.000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Ibrido - Milano</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Arrow */}
            <div className="hidden lg:block absolute top-8 -right-4 text-gray-300">
              <ArrowRight className="h-8 w-8" />
            </div>
          </div>

          <div className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-recruito-teal to-recruito-green rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                I recruiter si attivano
              </h3>
              <p className="text-gray-600 mb-6">
                Almeno 3 recruiter specializzati nel tuo settore iniziano la ricerca 
                in parallelo, utilizzando i loro network e competenze.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 text-sm">Marco R.</div>
                      <div className="text-xs text-gray-600">Tech Recruiter</div>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">Attivo</div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 text-sm">Sara M.</div>
                      <div className="text-xs text-gray-600">IT Specialist</div>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">Attivo</div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 text-sm">Luca F.</div>
                      <div className="text-xs text-gray-600">Frontend Expert</div>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">Attivo</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Arrow */}
            <div className="hidden lg:block absolute top-8 -right-4 text-gray-300">
              <ArrowRight className="h-8 w-8" />
            </div>
          </div>

          <div className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-recruito-green to-recruito-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Scegli e assumi
              </h3>
              <p className="text-gray-600 mb-6">
                Ricevi profili pre-qualificati, intervista i candidati migliori 
                e assumi. Paghi solo quando l'assunzione va a buon fine.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <RecruiterAvatar name="Alessandro P." size="sm" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 text-sm">Alessandro P.</div>
                        <div className="text-xs text-gray-600">5 anni exp.</div>
                      </div>
                    </div>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Assunto!
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg opacity-50">
                    <div className="flex items-center space-x-3">
                      <RecruiterAvatar name="Giulia T." size="sm" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 text-sm">Giulia T.</div>
                        <div className="text-xs text-gray-600">4 anni exp.</div>
                      </div>
                    </div>
                    <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Intervistata
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Prima e dopo <span className="text-gradient">Recruito</span>
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Without Recruito */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <h4 className="text-2xl font-bold text-gray-900">Senza Recruito</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl">
                  <Clock className="h-6 w-6 text-red-500 mt-1" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Tempi lunghi</h5>
                    <p className="text-gray-600 text-sm">3-6 mesi per trovare il candidato giusto</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl">
                  <DollarSign className="h-6 w-6 text-red-500 mt-1" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Costi elevati</h5>
                    <p className="text-gray-600 text-sm">Fee del 18-20% + costi fissi e anticipi</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl">
                  <Target className="h-6 w-6 text-red-500 mt-1" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Qualità incerta</h5>
                    <p className="text-gray-600 text-sm">Profili generici senza pre-selezione accurata</p>
                  </div>
                </div>
              </div>
            </div>

            {/* With Recruito */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <h4 className="text-2xl font-bold text-gray-900">Con Recruito</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                  <Clock className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Velocità garantita</h5>
                    <p className="text-gray-600 text-sm">Prime proposte entro una settimana</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Solo a successo</h5>
                    <p className="text-gray-600 text-sm">15% della RAL, paghi solo se assumi</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                  <Target className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Qualità certificata</h5>
                    <p className="text-gray-600 text-sm">Recruiter specializzati e profili pre-qualificati</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="flex justify-center gap-4">
              
              
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;