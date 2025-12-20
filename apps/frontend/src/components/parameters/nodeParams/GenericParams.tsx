import { useState, useEffect } from "react";

interface GenericParamsProps {
  data: any;
  setData: (updater: any) => void;
}

export default function GenericParams({ data, setData }: GenericParamsProps) {
  const [params, setParams] = useState<Record<string, any>>(() => data?.parameters || {});
  const [credentialId, setCredentialId] = useState<string>(data?.credentialsId || "");

  useEffect(() => {
    setData((prev: any) => ({
      ...prev,
      parameters: { ...params },
      credentialsId: credentialId || undefined,
    }));
  }, [params, credentialId, setData]);

  const handleParamChange = (key: string, value: any) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const handleAddField = () => {
    let newKeyBase = "field";
    let idx = 1;
    while (params.hasOwnProperty(`${newKeyBase}${idx}`)) idx += 1;
    const newKey = `${newKeyBase}${idx}`;
    setParams((p) => ({ ...p, [newKey]: "" }));
  };

  const handleRemoveField = (key: string) => {
    const { [key]: _omit, ...rest } = params;
    setParams(rest);
  };

  const renderValueInput = (key: string, value: any) => {
    const valueType = typeof value;
    if (valueType === "number") {
      return (
        <input
          type="number"
          className="w-full px-2 py-1 border rounded text-sm bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={String(value)}
          onChange={(e) => handleParamChange(key, Number(e.target.value))}
        />
      );
    }
    if (valueType === "boolean") {
      return (
        <select
          className="w-full px-2 py-1 border rounded text-sm bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={value ? "true" : "false"}
          onChange={(e) => handleParamChange(key, e.target.value === "true")}
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      );
    }
    return (
      <input
        type="text"
        className="w-full px-2 py-1 border rounded text-sm bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={value ?? ""}
        onChange={(e) => handleParamChange(key, e.target.value)}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Credentials ID</label>
        <input
          type="text"
          className="w-full px-2 py-1 border rounded text-sm bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Optional credentials id"
          value={credentialId}
          onChange={(e) => setCredentialId(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Parameters</h3>
        <button
          type="button"
          onClick={handleAddField}
          className="px-2 py-1 text-xs rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white"
        >
          + Add field
        </button>
      </div>

      <div className="space-y-2">
        {Object.keys(params).length === 0 && (
          <div className="text-xs text-gray-500">No parameters. Use "Add field".</div>
        )}

        {Object.entries(params).map(([key, value]) => (
          <div key={key} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <input
                type="text"
                className="w-full px-2 py-1 border rounded text-sm"
                value={key}
                onChange={(e) => {
                  const newKey = e.target.value;
                  if (!newKey) return;
                  // rename key while preserving order
                  const entries = Object.entries(params);
                  const idx = entries.findIndex(([k]) => k === key);
                  if (idx >= 0) {
                    entries[idx][0] = newKey;
                    setParams(Object.fromEntries(entries));
                  }
                }}
              />
            </div>
            <div className="col-span-7">{renderValueInput(key, value)}</div>
            <div className="col-span-1 text-right">
              <button
                type="button"
                onClick={() => handleRemoveField(key)}
                className="px-2 py-1 text-xs rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-600"
                aria-label={`Remove ${key}`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


