import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/all";
import { Label } from "@/components/ui/all";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Form() {
  const [buttonText, setButtonText] = useState('Submit');
  const [buttonColor, setButtonColor] = useState(''); // Default color

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    const form = event.currentTarget;
    const isValid = form.checkValidity();

    if (isValid) {
      setTimeout(() => {
        setButtonText('Submitted');
        setButtonColor('green');
      }, 1500);

      setTimeout(() => {
        setButtonText('Submit');
        setButtonColor('');
        form.reset(); // Reset the form after submission
      }, 2000);
    }
  };

  return (
    <div className="bg-[#faf8f8] flex flex-row items-center justify-center right-0 top-0 max-h-full w-50 bg-background p-5 shadow-lg rounded-lg">
      <nav className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Contact Form</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to submit your request.
          </p>
        </div>
        <form className="space-y-4 border-t-2 border-card-foreground" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Number</Label>
            <Input id="number" type="tel" placeholder="Enter your phone number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problem">Problem</Label>
            <Textarea id="problem" placeholder="Describe your problem" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Enter your address" required />
          </div>
          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </Button>
        </form>
      </nav>
    </div>
  );
}