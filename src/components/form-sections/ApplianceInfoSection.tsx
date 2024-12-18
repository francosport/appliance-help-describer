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
  address,
  addressSuggestions,
  applianceType,
  problem,
  onAddressChange,
  onAddressSelect,
  onApplianceTypeChange,
  onProblemChange,
}: ApplianceInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2 relative">
        <Label htmlFor="address">Address</Label>
        <input
          id="address"
          name="address"
          value={address}
          onChange={onAddressChange}
          className="w-full min-h-[40px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
        {addressSuggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-form-200">
            {addressSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-form-50 cursor-pointer transition-colors"
                onClick={() => onAddressSelect(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
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