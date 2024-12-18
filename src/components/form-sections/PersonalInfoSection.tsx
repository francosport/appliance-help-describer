import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoProps {
  firstName: string;
  lastName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection = ({ firstName, lastName, onChange }: PersonalInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={onChange}
          className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={onChange}
          className="transition-all duration-200 focus:ring-2 focus:ring-form-400"
          required
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;