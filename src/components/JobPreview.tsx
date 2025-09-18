import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Euro } from "lucide-react";

const JobPreview = () => {
  const jobs = [
    {
      title: "Senior Frontend Developer",
      company: "TechStart Milano",
      location: "Milano, Hybrid",
      salary: "45-65k",
      type: "Full-time",
      posted: "2 ore fa",
      recruiterCount: 8
    },
    {
      title: "Marketing Manager",
      company: "InnovateCorp",
      location: "Roma, Remote",
      salary: "35-50k",
      type: "Full-time", 
      posted: "5 ore fa",
      recruiterCount: 12
    },
    {
      title: "Data Scientist",
      company: "AI Solutions",
      location: "Torino, On-site",
      salary: "50-70k",
      type: "Full-time",
      posted: "1 giorno fa",
      recruiterCount: 6
    }
  ];

  const topRecruiters = [
    { name: "Marco R.", rating: 4.9, placements: 23, avatar: "MR" },
    { name: "Sofia L.", rating: 4.8, placements: 19, avatar: "SL" },
    { name: "Alessandro P.", rating: 4.7, placements: 31, avatar: "AP" },
    { name: "Giulia M.", rating: 4.9, placements: 27, avatar: "GM" }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Job Listings */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Ruoli Aperti</h2>
              <Badge variant="secondary">24 posizioni attive</Badge>
            </div>
            
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <Card key={index} className="border-0 shadow-startup hover-startup">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {job.recruiterCount} recruiter
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{job.posted}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Recruiters */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Top Recruiter</h2>
              <Badge variant="secondary">Rating medio 4.8</Badge>
            </div>
            
            <div className="space-y-4">
              {topRecruiters.map((recruiter, index) => (
                <Card key={index} className="border-0 shadow-startup hover-startup">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="gradient-primary text-white font-semibold">
                          {recruiter.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{recruiter.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>⭐ {recruiter.rating}</span>
                          <span>{recruiter.placements} placement</span>
                        </div>
                      </div>
                      <Badge variant="outline">Top 10</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobPreview;