import { useState } from "react";
import { defaultSettings } from "../data/mockData";

export function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState("");

  const updateSetting = (name, value) => {
    setSettings((current) => ({ ...current, [name]: value }));
    setMessage("");
  };

  return (
    <section className="page">
      <h1 className="page-title">Workspace Settings</h1>
      <p className="page-subtitle">
        Control localization, communication, and visual preferences.
      </p>

      <form
        data-testid="settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("Settings saved successfully.");
        }}
      >
        <div className="settings-grid">
          <div className="field">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              data-testid="currency-select"
              value={settings.currency}
              onChange={(event) =>
                updateSetting("currency", event.target.value)
              }
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              data-testid="timezone-select"
              value={settings.timezone}
              onChange={(event) =>
                updateSetting("timezone", event.target.value)
              }
            >
              <option value="UTC">UTC</option>
              <option value="IST">IST</option>
              <option value="EST">EST</option>
            </select>
          </div>
        </div>

        <div className="controls-row">
          <label className="switch-row" htmlFor="notifications">
            <span>Enable Notifications</span>
            <input
              id="notifications"
              data-testid="notifications-toggle"
              type="checkbox"
              checked={settings.notifications}
              onChange={(event) =>
                updateSetting("notifications", event.target.checked)
              }
            />
          </label>

          <label className="switch-row" htmlFor="theme">
            <span>Theme Mode</span>
            <select
              id="theme"
              data-testid="theme-toggle"
              value={settings.theme}
              onChange={(event) => updateSetting("theme", event.target.value)}
            >
              <option value="light">Light</option>
              <option value="contrast">High Contrast</option>
            </select>
          </label>
        </div>

        <div className="controls-row">
          <button
            type="submit"
            className="button primary"
            data-testid="save-settings-button"
          >
            Save Settings
          </button>
          <button
            type="button"
            className="button"
            data-testid="reset-settings-button"
            onClick={() => {
              setSettings(defaultSettings);
              setMessage("Settings reset to defaults.");
            }}
          >
            Reset Settings
          </button>
        </div>
      </form>

      <p className="inline-note" data-testid="settings-feedback">
        {message}
      </p>
    </section>
  );
}
