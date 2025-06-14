
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Award, Briefcase, Target } from "lucide-react";
import { Link } from "react-router-dom";

const RecruiterRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedinProfile: "",
    experience: "",
    specializations: [] as string[],
    workMode: "",
    availability: "",
    portfolio: "",
    motivation: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const checked = e.target.checked;
    
    if (checked) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, value]
      });
    } else {
      setFormData({
        ...formData,
        specializations: formData.specializations.filter(spec => spec !== value)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recruiter registration data:", formData);
    // TODO: Handle form submission
  };

  const specializationOptions = [
    { value: "tech", label: "Tecnologia & IT" },
    { value: "sales", label: "Vendite & Commerciale" },
    { value: "marketing", label: "Marketing & Digital" },
    { value: "finance", label: "Finanza & Amministrazione" },
    { value: "hr", label: "Risorse Umane" },
    { value: "operations", label: "Operations & Logistica" },
    { value: "engineering", label: "Ingegneria" },
    { value: "healthcare", label: "Sanità" }
  ];

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
            <Target className="h-16 w-16 text-recruito-green mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Diventa Recruiter Partner
            </h1>
            <p className="text-gray-600">
              Unisciti alla rete dei migliori recruiter freelance d'Italia
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informazioni Personali</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Cognome *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="linkedinProfile">Profilo LinkedIn *</Label>
                  <Input
                    id="linkedinProfile"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/tuo-profilo"
                    required
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Esperienza Professionale
                  </h3>
                  
                  <div>
                    <Label htmlFor="experience">Anni di esperienza nel recruiting *</Label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                      required
                    >
                      <option value="">Seleziona esperienza</option>
                      <option value="1-2">1-2 anni</option>
                      <option value="3-5">3-5 anni</option>
                      <option value="6-10">6-10 anni</option>
                      <option value="10+">10+ anni</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <Label className="text-base font-medium">Specializzazioni *</Label>
                    <p className="text-sm text-gray-600 mb-3">Seleziona i settori in cui hai maggiore esperienza</p>
                    <div className="grid grid-cols-2 gap-3">
                      {specializationOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={option.value}
                            value={option.value}
                            checked={formData.specializations.includes(option.value)}
                            onChange={handleSpecializationChange}
                            className="h-4 w-4 text-recruito-blue border-gray-300 rounded focus:ring-recruito-blue"
                          />
                          <Label htmlFor={option.value} className="text-sm font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Modalità di Lavoro
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="workMode">Preferenza di lavoro *</Label>
                      <select
                        id="workMode"
                        name="workMode"
                        value={formData.workMode}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        required
                      >
                        <option value="">Seleziona modalità</option>
                        <option value="part-time">Part-time</option>
                        <option value="full-time">Full-time</option>
                        <option value="project-based">A progetto</option>
                        <option value="flexible">Flessibile</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="availability">Disponibilità *</Label>
                      <select
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        required
                      >
                        <option value="">Seleziona disponibilità</option>
                        <option value="immediate">Immediata</option>
                        <option value="2-weeks">Entro 2 settimane</option>
                        <option value="1-month">Entro 1 mese</option>
                        <option value="flexible">Flessibile</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="portfolio">Portfolio/Casi di successo</Label>
                  <Textarea
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="Descrivi alcuni dei tuoi successi nel recruiting (optional)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="motivation">Perché vuoi diventare Partner Recruito? *</Label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="Spiegaci le tue motivazioni e come pensi di contribuire al nostro network"
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full gradient-recruito text-white border-0 hover:opacity-90" size="lg">
                  Invia candidatura
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterRegister;
