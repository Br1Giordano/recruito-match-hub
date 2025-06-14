
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Users, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyRegister = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    contactName: "",
    email: "",
    phone: "",
    position: "",
    description: "",
    urgency: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Company registration data:", formData);
    // TODO: Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/2b14001c-d6fa-47cf-84de-a64fba53c4fb.png" 
                alt="Recruito Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Building2 className="h-16 w-16 text-recruito-blue mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registrazione Azienda
            </h1>
            <p className="text-gray-600">
              Inizia a trovare i migliori talenti con l'aiuto dei nostri recruiter partner
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informazioni Azienda</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Nome Azienda *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Settore *</Label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                      required
                    >
                      <option value="">Seleziona settore</option>
                      <option value="tech">Tecnologia</option>
                      <option value="finance">Finanza</option>
                      <option value="consulting">Consulenza</option>
                      <option value="manufacturing">Manifatturiero</option>
                      <option value="retail">Retail</option>
                      <option value="healthcare">Sanità</option>
                      <option value="other">Altro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="companySize">Dimensione Azienda *</Label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    required
                  >
                    <option value="">Seleziona dimensione</option>
                    <option value="1-10">1-10 dipendenti</option>
                    <option value="11-50">11-50 dipendenti</option>
                    <option value="51-200">51-200 dipendenti</option>
                    <option value="201-500">201-500 dipendenti</option>
                    <option value="500+">500+ dipendenti</option>
                  </select>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Persona di Contatto
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Nome e Cognome *</Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Ruolo in Azienda *</Label>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Esigenze di Recruiting</h3>
                  
                  <div>
                    <Label htmlFor="description">Descrivi le tue esigenze di recruiting</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Che tipo di profili stai cercando? Quali sono le tue priorità?"
                      rows={4}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="urgency">Tempistiche *</Label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                      required
                    >
                      <option value="">Seleziona tempistiche</option>
                      <option value="immediate">Immediatamente</option>
                      <option value="1-month">Entro 1 mese</option>
                      <option value="3-months">Entro 3 mesi</option>
                      <option value="flexible">Flessibile</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-recruito text-white border-0 hover:opacity-90" size="lg">
                  Inizia il tuo recruiting
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
