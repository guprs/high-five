import { useState } from "react";
import { X } from "lucide-react";

import api from "../../services/api";
import { KID_THEMES } from "../../data/themes";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddChildModal({
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState(KID_THEMES[0].id);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/api/children", {
        name,
        age: Number(age),
        theme,
      });

      onCreated();
    } catch (err) {
      console.error(err);
      alert("Failed to create child.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
      "
    >
      <div
        className="
        bg-white
        rounded-2xl
        shadow-xl
        w-full
        max-w-md
        p-6
        "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Add Child
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>

            <input
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="
              w-full
              border
              rounded-xl
              px-4
              py-2
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Age
            </label>

            <input
              required
              type="number"
              min={1}
              max={18}
              value={age}
              onChange={(e) =>
                setAge(e.target.value)
              }
              className="
              w-full
              border
              rounded-xl
              px-4
              py-2
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Theme
            </label>

            <select
              value={theme}
              onChange={(e) =>
                setTheme(e.target.value)
              }
              className="
              w-full
              border
              rounded-xl
              px-4
              py-2
              "
            >
              {KID_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}

              <option>
                Jungle
              </option>

              <option>
                Ocean
              </option>
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="
              px-4
              py-2
              rounded-xl
              border
              "
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="
              px-5
              py-2
              rounded-xl
              bg-indigo-600
              text-white
              hover:bg-indigo-700
              disabled:opacity-50
              "
            >
              {loading
                ? "Creating..."
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}