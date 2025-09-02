"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGlobeAmericas, FaKeyboard } from "react-icons/fa";
import { motion } from "framer-motion";

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
}

export const TimezoneSelector = ({
  value,
  onChange,
}: TimezoneSelectorProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTimezone, setCustomTimezone] = useState("");
  const timezones = [
    { label: "New York (EST)", value: "America/New_York" },
    { label: "Los Angeles (PST)", value: "America/Los_Angeles" },
    { label: "Chicago (CST)", value: "America/Chicago" },
    { label: "London (GMT)", value: "Europe/London" },
    { label: "Paris (CET)", value: "Europe/Paris" },
    { label: "Tokyo (JST)", value: "Asia/Tokyo" },
    { label: "Sydney (AEST)", value: "Australia/Sydney" },
    { label: "Dubai (GST)", value: "Asia/Dubai" },
    { label: "Moscow (MSK)", value: "Europe/Moscow" },
    { label: "Beijing (CST)", value: "Asia/Shanghai" },
    { label: "Mumbai (IST)", value: "Asia/Kolkata" },
    { label: "São Paulo (BRT)", value: "America/Sao_Paulo" },
    { label: "Cairo (EET)", value: "Africa/Cairo" },
    { label: "Seoul (KST)", value: "Asia/Seoul" },
    { label: "Bangkok (ICT)", value: "Asia/Bangkok" },
  ];

  const getCurrentTimezoneLabel = () => {
    const timezone = timezones.find((tz) => tz.value === value);
    return timezone ? timezone.label : value || "Select Timezone";
  };

  const isInList = !!timezones.find((tz) => tz.value === value);

  const handleCustomTimezone = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTimezone.trim()) {
      onChange(customTimezone.trim());
      setCustomTimezone("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FaGlobeAmericas className="text-primary w-5 h-5" />

      {showCustomInput ? (
        <motion.form
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          onSubmit={handleCustomTimezone}
          className="flex gap-2"
        >
          <Input
            type="text"
            value={customTimezone}
            onChange={(e) => setCustomTimezone(e.target.value)}
            placeholder="e.g., America/New_York"
            className="w-64"
          />
          <Button type="submit" size="sm">
            Set
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomInput(false)}
          >
            Cancel
          </Button>
        </motion.form>
      ) : (
        <>
          <Select value={value || undefined} onValueChange={onChange}>
            <SelectTrigger className="w-64 bg-card/60 border-border text-white placeholder:text-gray-400 hover:bg-card/80 hover:text-white/90 transition-colors">
              <SelectValue placeholder={getCurrentTimezoneLabel()} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-white max-h-48 overflow-auto">
              {!isInList && value && (
                <SelectItem
                  key={value}
                  value={value}
                  className="hover:bg-muted/60 focus:bg-muted/60 hover:text-white cursor-pointer text-gray-300"
                >
                  {value} (detected)
                </SelectItem>
              )}
              {timezones.map((timezone) => (
                <SelectItem
                  key={timezone.value}
                  value={timezone.value}
                  className="hover:bg-muted/60 focus:bg-muted/60 hover:text-white cursor-pointer text-gray-300"
                >
                  {timezone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomInput(true)}
            className="p-2"
            title="Enter custom timezone"
          >
            <FaKeyboard className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};
