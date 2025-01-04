import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplianceInfoProps {
  address: string;
  addressSuggestions: string[];
  applianceType: string;
  problem: string;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressSelect: (address: string) => void;
  onApplianceTypeChange: (value: string) => void;
  onProblemChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ApplianceInfoSection = ({
  applianceType,
  problem,
  onApplianceTypeChange,
  onProblemChange,
}: ApplianceInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="applianceType">Appliance Type</Label>
        <Select onValueChange={onApplianceTypeChange} value={applianceType}>
          <SelectTrigger>
            <SelectValue placeholder="Select appliance type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="refrigerator">Refrigerator</SelectItem>
            <SelectItem value="washer">Washer</SelectItem>
            <SelectItem value="dryer">Dryer</SelectItem>
            <SelectItem value="dishwasher">Dishwasher</SelectItem>
            <SelectItem value="oven">Oven</SelectItem>
            <SelectItem value="microwave">Microwave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="problem">Problem Description</Label>
        <textarea
          id="problem"
          name="problem"
          value={problem}
          onChange={onProblemChange}
          className="w-full min-h-[100px] p-3 rounded-md border border-form-200 focus:ring-2 focus:ring-form-400 focus:outline-none transition-all duration-200"
          required
        />
      </div>
    </div>
  );
};

export default ApplianceInfoSection;