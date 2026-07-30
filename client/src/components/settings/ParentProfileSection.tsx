import { useEffect, useRef, useState } from "react";
import { Camera, Check, Pencil, X } from "lucide-react";

interface StoredUser {
  name?: string;
  email?: string;
  createdAt?: string;
}

interface StoredFamily {
  name?: string;
}

function getInitialProfile() {
  let user: StoredUser = {};
  let family: StoredFamily = {};

  try {
    user = JSON.parse(localStorage.getItem("user") ?? "{}") as StoredUser;
    family = JSON.parse(
      localStorage.getItem("family") ?? "{}",
    ) as StoredFamily;
  } catch {
    // Invalid local data falls back to neutral account labels.
  }

  return {
    fullName: user.name ?? "Parent",
    familyName: family.name ?? "",
    email: user.email ?? "",
    phone: "",
    createdAt: user.createdAt,
  };
}

export default function ParentProfileSection() {
  const [profile, setProfile] = useState(getInitialProfile);
  const [draft, setDraft] = useState(getInitialProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function syncFamilyProfile() {
      const nextProfile = getInitialProfile();
      setProfile(nextProfile);
      setDraft(nextProfile);
    }

    window.addEventListener("family-changed", syncFamilyProfile);
    return () => window.removeEventListener("family-changed", syncFamilyProfile);
  }, []);

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setProfile(draft);
    setEditing(false);
    setSaved(true);
  }

  function cancelEditing() {
    setDraft(profile);
    setEditing(false);
    setSaved(false);
  }

  function changeAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Please choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        setAvatarError("");
      }
    };
    reader.onerror = () => setAvatarError("The selected image could not be loaded.");
    reader.readAsDataURL(file);
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-gray-900">Parent Profile</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setSaved(false);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>

      <div className="mb-5 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 overflow-hidden rounded-2xl bg-indigo-100 text-2xl font-black text-indigo-700">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${profile.fullName} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="m-auto">
                {profile.fullName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            aria-label="Choose parent profile photo"
            className="absolute -right-2 -bottom-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={changeAvatar}
            className="hidden"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold text-gray-900">{profile.fullName}</div>
          <div className="truncate text-sm text-gray-500">{profile.email}</div>
          <div className="mt-0.5 text-xs text-gray-400">
            {profile.createdAt
              ? `Member since ${new Date(profile.createdAt).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}`
              : "Parent account"}
          </div>
        </div>
      </div>

      {avatarError && (
        <p className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
          {avatarError}
        </p>
      )}

      {saved && (
        <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
          Profile updated locally. Backend saving can be connected later.
        </p>
      )}

      <form onSubmit={saveProfile}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { key: "fullName", label: "Full Name", type: "text" },
            { key: "familyName", label: "Family Name", type: "text" },
            { key: "email", label: "Login Email", type: "email" },
            { key: "phone", label: "Phone", type: "tel" },
          ].map((field) => (
            <label key={field.key}>
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-400 uppercase">{field.label}</span>
              <input
                type={field.type}
                value={String(draft[field.key as keyof typeof draft] ?? "")}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [field.key]: event.target.value }))
                }
                disabled={!editing || field.key === "email"}
                required={field.key === "fullName" || field.key === "email"}
                placeholder={
                  field.key === "familyName"
                    ? "Available after your next login"
                    : field.key === "phone"
                      ? "Optional"
                      : undefined
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:cursor-default disabled:text-gray-600"
              />
              {field.key === "email" && (
                <span className="mt-1 block text-[11px] text-gray-400">
                  This email address is fixed and is not editable.
                </span>
              )}
            </label>
          ))}
        </div>

        {editing && (
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={cancelEditing} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button type="submit" className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
              <Check className="h-4 w-4" /> Save
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
