import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/Switch";
import {
  Save,
  X,
  Building,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CreateAudienceModel,
  UpdateAudienceModel,
} from "@/dal/models/audience.model";
import type {
  AudienceFormData,
  AudienceFormErrors,
  AudienceFormProps,
} from "@/types/mailchimp/audience";
import { validateAudienceForm } from "@/schemas/mailchimp/audience-form.schema";



const initialFormData: AudienceFormData = {
  name: "",
  contact: {
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
  },
  permission_reminder: "You signed up for our newsletter",
  campaign_defaults: {
    from_name: "",
    from_email: "",
    subject: "",
    language: "en",
  },
  email_type_option: false,
  use_archive_bar: true,
  visibility: "pub",
};

export function AudienceForm({
  audience,
  mode,
  loading = false,
  onSubmit,
  onCancel,
  className,
}: AudienceFormProps) {
  const [formData, setFormData] = useState<AudienceFormData>({
    ...initialFormData,
    ...audience,
    contact: {
      ...initialFormData.contact,
      ...audience?.contact,
    },
    campaign_defaults: {
      ...initialFormData.campaign_defaults,
      ...audience?.campaign_defaults,
    },
  });

  const [errors, setErrors] = useState<AudienceFormErrors>({});

  const validateForm = (): boolean => {
    const { errors, isValid } = validateAudienceForm(formData);
    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData =
      mode === "edit" && audience?.id
        ? ({ ...formData, id: audience.id } as UpdateAudienceModel)
        : (formData as CreateAudienceModel);

    onSubmit(submitData);
  };

  const updateFormData = (path: string, value: string | boolean) => {
    setFormData((prev) => {
      const keys = path.split(".");
      if (keys.length === 1) {
        return { ...prev, [keys[0]]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev[keys[0] as keyof AudienceFormData] as Record<string, unknown>),
            [keys[1]]: value,
          },
        };
      }
      return prev;
    });

    // Clear error when user starts typing
    if (errors[path]) {
      setErrors((prev) => ({
        ...prev,
        [path]: "",
      }));
    }
  };

  const getFieldError = (path: string) => errors[path];

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>
              {mode === "create" ? "Create New Audience" : "Edit Audience"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close form"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Set up the basic details for your audience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Audience Name *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="e.g., Newsletter Subscribers"
                  className={cn(getFieldError("name") && "border-red-500")}
                  aria-describedby={
                    getFieldError("name") ? "name-error" : undefined
                  }
                />
                {getFieldError("name") && (
                  <p
                    id="name-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("name")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="visibility"
                  className="block text-sm font-medium mb-2"
                >
                  Visibility
                </label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: "pub" | "prv") =>
                    updateFormData("visibility", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pub">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>Public</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="prv">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        <span>Private</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Email Type Option
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Allow subscribers to choose HTML or text emails
                    </p>
                  </div>
                  <Switch
                    checked={formData.email_type_option}
                    onCheckedChange={(checked) =>
                      updateFormData("email_type_option", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Use Archive Bar
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Show archive bar at bottom of emails
                    </p>
                  </div>
                  <Switch
                    checked={formData.use_archive_bar}
                    onCheckedChange={(checked) =>
                      updateFormData("use_archive_bar", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Contact Information
              </h3>
              <p className="text-sm text-muted-foreground">
                Required contact information for your organization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium mb-2"
                >
                  Company Name *
                </label>
                <Input
                  id="company"
                  value={formData.contact.company}
                  onChange={(e) =>
                    updateFormData("contact.company", e.target.value)
                  }
                  placeholder="Your Company Name"
                  className={cn(
                    getFieldError("contact.company") && "border-red-500",
                  )}
                />
                {getFieldError("contact.company") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("contact.company")}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address1"
                  className="block text-sm font-medium mb-2"
                >
                  Address Line 1 *
                </label>
                <Input
                  id="address1"
                  value={formData.contact.address1}
                  onChange={(e) =>
                    updateFormData("contact.address1", e.target.value)
                  }
                  placeholder="123 Main Street"
                  className={cn(
                    getFieldError("contact.address1") && "border-red-500",
                  )}
                />
                {getFieldError("contact.address1") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("contact.address1")}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address2"
                  className="block text-sm font-medium mb-2"
                >
                  Address Line 2
                </label>
                <Input
                  id="address2"
                  value={formData.contact.address2 || ""}
                  onChange={(e) =>
                    updateFormData("contact.address2", e.target.value)
                  }
                  placeholder="Suite, apartment, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-2"
                >
                  City *
                </label>
                <Input
                  id="city"
                  value={formData.contact.city}
                  onChange={(e) =>
                    updateFormData("contact.city", e.target.value)
                  }
                  placeholder="City"
                  className={cn(
                    getFieldError("contact.city") && "border-red-500",
                  )}
                />
                {getFieldError("contact.city") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("contact.city")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium mb-2"
                >
                  State/Province *
                </label>
                <Input
                  id="state"
                  value={formData.contact.state}
                  onChange={(e) =>
                    updateFormData("contact.state", e.target.value)
                  }
                  placeholder="State or Province"
                  className={cn(
                    getFieldError("contact.state") && "border-red-500",
                  )}
                />
                {getFieldError("contact.state") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("contact.state")}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-medium mb-2">
                  ZIP/Postal Code *
                </label>
                <Input
                  id="zip"
                  value={formData.contact.zip}
                  onChange={(e) =>
                    updateFormData("contact.zip", e.target.value)
                  }
                  placeholder="12345"
                  className={cn(
                    getFieldError("contact.zip") && "border-red-500",
                  )}
                />
                {getFieldError("contact.zip") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("contact.zip")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium mb-2"
                >
                  Country *
                </label>
                <Select
                  value={formData.contact.country}
                  onValueChange={(value) =>
                    updateFormData("contact.country", value)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      getFieldError("contact.country") && "border-red-500",
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                    <SelectItem value="IT">Italy</SelectItem>
                    <SelectItem value="NL">Netherlands</SelectItem>
                    <SelectItem value="SE">Sweden</SelectItem>
                  </SelectContent>
                </Select>
                {getFieldError("contact.country") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("contact.country")}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={formData.contact.phone || ""}
                  onChange={(e) =>
                    updateFormData("contact.phone", e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Campaign Defaults */}
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Campaign Defaults
              </h3>
              <p className="text-sm text-muted-foreground">
                Default values for campaigns sent to this audience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fromName"
                  className="block text-sm font-medium mb-2"
                >
                  From Name *
                </label>
                <Input
                  id="fromName"
                  value={formData.campaign_defaults.from_name}
                  onChange={(e) =>
                    updateFormData(
                      "campaign_defaults.from_name",
                      e.target.value,
                    )
                  }
                  placeholder="Your Company"
                  className={cn(
                    getFieldError("campaign_defaults.from_name") &&
                      "border-red-500",
                  )}
                />
                {getFieldError("campaign_defaults.from_name") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("campaign_defaults.from_name")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fromEmail"
                  className="block text-sm font-medium mb-2"
                >
                  From Email *
                </label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={formData.campaign_defaults.from_email}
                  onChange={(e) =>
                    updateFormData(
                      "campaign_defaults.from_email",
                      e.target.value,
                    )
                  }
                  placeholder="newsletter@yourcompany.com"
                  className={cn(
                    getFieldError("campaign_defaults.from_email") &&
                      "border-red-500",
                  )}
                />
                {getFieldError("campaign_defaults.from_email") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("campaign_defaults.from_email")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Default Subject *
                </label>
                <Input
                  id="subject"
                  value={formData.campaign_defaults.subject}
                  onChange={(e) =>
                    updateFormData("campaign_defaults.subject", e.target.value)
                  }
                  placeholder="Weekly Newsletter"
                  className={cn(
                    getFieldError("campaign_defaults.subject") &&
                      "border-red-500",
                  )}
                />
                {getFieldError("campaign_defaults.subject") && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError("campaign_defaults.subject")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium mb-2"
                >
                  Language
                </label>
                <Select
                  value={formData.campaign_defaults.language}
                  onValueChange={(value) =>
                    updateFormData("campaign_defaults.language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Permission Reminder */}
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <h3 className="text-lg font-semibold mb-2">
                Permission Reminder
              </h3>
              <p className="text-sm text-muted-foreground">
                Remind subscribers how they got on your list.
              </p>
            </div>

            <div>
              <label
                htmlFor="permissionReminder"
                className="block text-sm font-medium mb-2"
              >
                Permission Reminder *
              </label>
              <Input
                id="permissionReminder"
                value={formData.permission_reminder}
                onChange={(e) =>
                  updateFormData("permission_reminder", e.target.value)
                }
                placeholder="You signed up for our newsletter on our website"
                className={cn(
                  getFieldError("permission_reminder") && "border-red-500",
                )}
              />
              {getFieldError("permission_reminder") && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {getFieldError("permission_reminder")}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                This appears in every email campaign and is required by law in
                many countries.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>
                    {mode === "create" ? "Create Audience" : "Save Changes"}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

AudienceForm.displayName = "AudienceForm";
