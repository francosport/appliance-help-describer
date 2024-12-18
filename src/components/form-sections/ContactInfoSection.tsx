import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoProps {
  mobilePhone: string;
  homePhone: string;
  otherPhone: string;
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactInfoSection = ({ mobilePhone, homePhone, otherPhone, email, onChange }: ContactInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mobilePhone">Mobile Phone</Label>
        <Input
          id="mobilePhone"
          name="mobilePhone"
          value={mobilePhone}
          onChange={onChange}
          className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="homePhone">Home Phone</Label>
        <Input
          id="homePhone"
          name="homePhone"
          value={homePhone}
          onChange={onChange}
          className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="otherPhone">Other Phone</Label>
        <Input
          id="otherPhone"
          name="otherPhone"
          value={otherPhone}
          onChange={onChange}
          className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={onChange}
          className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
          required
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;