import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Twitter, Github, Linkedin } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  display_name: z.string().max(100).nullable(),
  bio: z.string().max(500).nullable(),
  avatar_url: z.string().url("Must be a valid URL").regex(/^https:\/\//, "Must start with https://").max(500).nullable(),
  twitter: z.string().regex(/^[a-zA-Z0-9_]{1,50}$/, "Only letters, numbers, and underscores allowed").nullable(),
  github: z.string().regex(/^[a-zA-Z0-9_-]{1,39}$/, "Only letters, numbers, hyphens, and underscores allowed").nullable(),
  linkedin: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/, "Only letters, numbers, hyphens, and underscores allowed").nullable(),
});

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    if (profile && open) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
      setTwitter(profile.twitter ?? "");
      setGithub(profile.github ?? "");
      setLinkedin(profile.linkedin ?? "");
    }
  }, [profile, open]);

  const initials = (displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    const values = {
      display_name: displayName.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      twitter: twitter.trim() || null,
      github: github.trim() || null,
      linkedin: linkedin.trim() || null,
    };

    const result = profileSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      await updateProfile.mutateAsync(values);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
      onOpenChange(false);
    } catch {
      toast({ title: "Error", description: "Failed to update profile. Please try again.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-20 h-20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-display font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar-url">Avatar URL</Label>
            <Input
              id="avatar-url"
              placeholder="https://example.com/avatar.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">Paste a link to your profile picture (must start with https://)</p>
            {errors.avatar_url && <p className="text-xs text-destructive">{errors.avatar_url}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{bio.length}/500</p>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Social Links</Label>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="twitter username"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    maxLength={50}
                  />
                </div>
                {errors.twitter && <p className="text-xs text-destructive mt-1 ml-6">{errors.twitter}</p>}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="github username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    maxLength={39}
                  />
                </div>
                {errors.github && <p className="text-xs text-destructive mt-1 ml-6">{errors.github}</p>}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="linkedin username"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    maxLength={100}
                  />
                </div>
                {errors.linkedin && <p className="text-xs text-destructive mt-1 ml-6">{errors.linkedin}</p>}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
