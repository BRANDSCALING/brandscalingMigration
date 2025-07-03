import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import BusinessClarity from "@/pages/business-clarity";
import Wizard from "@/pages/wizard";
import WizardStep2 from "@/pages/wizard-step2";
import WizardStep3 from "@/pages/wizard-step3";
import WizardStep4 from "@/pages/wizard-step4";
import WizardStep5 from "@/pages/wizard-step5";
import WizardStep6 from "@/pages/wizard-step6";
import WizardStep7 from "@/pages/wizard-step7";
import WizardStep8 from "@/pages/wizard-step8";
import WizardStep9 from "@/pages/wizard-step9";
import WizardStep10 from "@/pages/wizard-step10";
import ModelOutput from "@/pages/model-output";
import ProductDesign from "@/pages/product-design";
import GoToMarket from "@/pages/go-to-market";
import FeedbackLoop from "@/pages/feedback-loop";
import ProgressTracker from "@/pages/progress-tracker";
import Dashboard from "@/pages/dashboard";
import ResumeWizardPage from "@/pages/resume-wizard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={BusinessClarity} />
      <Route path="/home" component={Home} />
      <Route path="/wizard" component={Wizard} />
      <Route path="/wizard/step2" component={WizardStep2} />
      <Route path="/wizard/step3" component={WizardStep3} />
      <Route path="/wizard/step4" component={WizardStep4} />
      <Route path="/wizard/step5" component={WizardStep5} />
      <Route path="/wizard/step6" component={WizardStep6} />
      <Route path="/wizard/step7" component={WizardStep7} />
      <Route path="/wizard/step8" component={WizardStep8} />
      <Route path="/wizard/step9" component={WizardStep9} />
      <Route path="/wizard/step10" component={WizardStep10} />
      <Route path="/model-output" component={ModelOutput} />
      <Route path="/product-design" component={ProductDesign} />
      <Route path="/go-to-market" component={GoToMarket} />
      <Route path="/feedback-loop" component={FeedbackLoop} />
      <Route path="/progress-tracker" component={ProgressTracker} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/wizard/resume/:modelId" component={ResumeWizardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
