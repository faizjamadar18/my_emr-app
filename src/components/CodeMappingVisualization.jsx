import React, { useState } from "react";
import { Globe, Stethoscope, Code, Eye } from "lucide-react";

const CodeMappingVisualization = ({ diagnosis }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Code Mapping Visualization</h3>
        <button onClick={() => setShowDetails(!showDetails)} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {showDetails ? "Hide" : "Show"} Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NAMASTE */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">NAMASTE</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{diagnosis.namasteCode}</div>
            <div className="text-blue-700">{diagnosis.namasteTerm}</div>
          </div>
        </div>

        {/* WHO Ayurveda */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">WHO Ayurveda</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{diagnosis.whoAyurvedaCode}</div>
            <div className="text-green-700">{diagnosis.whoAyurvedaTerm}</div>
          </div>
        </div>

        {/* ICD-11 */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">ICD-11</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">{diagnosis.icd11BiomedicineCode}</div>
            <div className="text-purple-700">{diagnosis.biomedicalTerm}</div>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{diagnosis.description}</p>
          <div className="mt-2 text-xs text-gray-600">
            <strong>TM2 Code:</strong> {diagnosis.icd11TM2Code} - {diagnosis.icd11TM2Term}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeMappingVisualization;
