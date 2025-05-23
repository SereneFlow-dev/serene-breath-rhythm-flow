
import { useState } from "react";
import { ArrowLeft, BookOpen, Heart, Brain, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { breathingTechniques } from "@/data/breathingTechniques";

const Learn = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string>("");

  const benefits = [
    {
      icon: Heart,
      title: "Stress Reduction",
      description: "Conscious breathing activates the parasympathetic nervous system, reducing cortisol and promoting relaxation."
    },
    {
      icon: Brain,
      title: "Mental Clarity",
      description: "Proper breathing increases oxygen flow to the brain, enhancing focus, concentration, and cognitive function."
    },
    {
      icon: Zap,
      title: "Energy & Balance",
      description: "Breathwork balances your nervous system, providing natural energy while maintaining inner calm."
    }
  ];

  const tips = [
    {
      title: "Find Your Comfortable Position",
      content: "Sit or lie down comfortably with your spine straight but not rigid. Place one hand on your chest and one on your belly to feel the breath movement."
    },
    {
      title: "Start Slowly",
      content: "Begin with shorter sessions (2-5 minutes) and gradually increase duration as you become more comfortable with the techniques."
    },
    {
      title: "Focus on the Process",
      content: "Don't worry about perfection. If your mind wanders, gently return attention to your breath without judgment."
    },
    {
      title: "Consistency Over Intensity",
      content: "Regular practice, even just 5 minutes daily, is more beneficial than occasional longer sessions."
    },
    {
      title: "Listen to Your Body",
      content: "Never strain or force your breathing. If you feel dizzy or uncomfortable, return to natural breathing and rest."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
              Learn
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Master the art of mindful breathing
            </p>
          </div>
        </div>

        {/* Benefits of Breathwork */}
        <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-200">
              <BookOpen className="h-5 w-5 mr-2 text-serene-teal" />
              Benefits of Breathwork
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-serene-teal/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <benefit.icon className="h-4 w-4 text-serene-teal" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Practice Tips */}
        <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
              Tips for Effective Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Accordion type="single" collapsible>
              {tips.map((tip, index) => (
                <AccordionItem key={index} value={`tip-${index}`}>
                  <AccordionTrigger className="text-left text-slate-700 dark:text-slate-300">
                    {tip.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400">
                    {tip.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Technique Details */}
        <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
              Breathing Techniques Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Accordion type="single" collapsible>
              {breathingTechniques.map((technique) => (
                <AccordionItem key={technique.id} value={technique.id}>
                  <AccordionTrigger className="text-left">
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-slate-200">
                        {technique.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {technique.difficulty} • {technique.category.join(", ")}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-slate-600 dark:text-slate-400">
                        {technique.description}
                      </p>
                      
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                          How to Practice:
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          {technique.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                          Benefits:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {technique.benefits.map((benefit, index) => (
                            <span
                              key={index}
                              className="text-xs bg-serene-teal/20 text-serene-teal px-2 py-1 rounded-full"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          size="sm"
                          className="bg-serene-teal hover:bg-serene-teal/90 text-white"
                          onClick={() => navigate(`/session/${technique.id}`)}
                        >
                          Try {technique.name}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Safety Guidelines */}
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800 dark:text-amber-200">
              Safety Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
              <p>• Practice in a safe, comfortable environment</p>
              <p>• Never practice advanced techniques while driving or operating machinery</p>
              <p>• Stop immediately if you feel dizzy, lightheaded, or uncomfortable</p>
              <p>• Consult a healthcare provider if you have respiratory conditions</p>
              <p>• Start slowly and gradually increase session length</p>
              <p>• Remember: breathing should never be forced or strained</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Learn;
