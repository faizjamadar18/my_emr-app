import React, { useState } from "react";
import { FileText, Code, Save, AlertCircle, X } from "lucide-react";
import CodeMappingVisualization from "./CodeMappingVisualization";
import { mockPatient } from "../data/mockData";

const ProblemList = ({ diagnoses, onRemoveDiagnosis }) => {
  const [fhirResource, setFhirResource] = useState(null);
  const [showFhir, setShowFhir] = useState(false);

  const generateFhirProblemList = () => {
    const fhir = {
      resourceType: "List",
      id: "problem-list-" + Date.now(),
      status: "current",
      mode: "working",
      title: "Problem List",
      subject: {
        reference: `Patient/${mockPatient.id}`,
        display: mockPatient.name
      },
      date: new Date().toISOString(),
      entry: diagnoses.map((diagnosis, index) => ({
        item: {
          reference: `Condition/condition-${index}`,
          display: diagnosis.namasteTerm
        },
        extension: [{
          url: "http://namaste-emr.org/fhir/StructureDefinition/dual-coding",
          extension: [
            {
              url: "namaste-code",
              valueCodeableConcept: {
                coding: [{
                  system: "http://namaste.gov.in/terminology",
                  code: diagnosis.namasteCode,
                  display: diagnosis.namasteTerm
                }]
              }
            },
            {
              url: "who-ayurveda-code",
              valueCodeableConcept: {
                coding: [{
                  system: "http://who.int/ayurveda-terminology",
                  code: diagnosis.whoAyurvedaCode,
                  display: diagnosis.whoAyurvedaTerm
                }]
              }
            },
            {
              url: "icd11-biomedicine",
              valueCodeableConcept: {
                coding: [{
                  system: "http://id.who.int/icd/release/11/mms",
                  code: diagnosis.icd11BiomedicineCode,
                  display: diagnosis.biomedicalTerm
                }]
              }
            }
          ]
        }]
      }))
    };
    setFhirResource(fhir);
    setShowFhir(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Problem List
        </h2>
        <div className="flex gap-2">
          <button
            onClick={generateFhirProblemList}
            disabled={diagnoses.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
          >
            <Code className="w-4 h-4" />
            Generate FHIR
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200">
            <Save className="w-4 h-4" />
            Save to EMR
          </button>
        </div>
      </div>

      {diagnoses.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No diagnoses added yet</p>
          <p className="text-sm text-gray-400">Search and select diagnoses to build the problem list</p>
        </div>
      ) : (
        <div className="space-y-4">
          {diagnoses.map((diagnosis, index) => (
            <div key={diagnosis.namasteCode} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded">#{index + 1}</span>
                    <h3 className="font-semibold text-gray-900">{diagnosis.namasteTerm}</h3>
                  </div>

                  <CodeMappingVisualization diagnosis={diagnosis} />
                </div>

                <button onClick={() => onRemoveDiagnosis(diagnosis.namasteCode)} className="text-red-500 hover:text-red-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FHIR Resource Modal */}
      {showFhir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">FHIR Problem List Resource</h3>
              <button onClick={() => setShowFhir(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{JSON.stringify(fhirResource, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemList;
