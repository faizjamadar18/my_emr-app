import React, { useState } from "react";
import AuthProvider from "./components/AuthProvider";
import DiagnosisSearch from "./components/DiagnosisSearch";
import ProblemList from "./components/ProblemList";
import { Stethoscope, User } from "lucide-react";
import { mockPatient } from "./data/mockData";

const EMRApp = () => {
  const [user, setUser] = useState(null);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);

  const handleSelectDiagnosis = (diagnosis) => {
    if (!selectedDiagnoses.some((d) => d.namasteCode === diagnosis.namasteCode)) {
      setSelectedDiagnoses([...selectedDiagnoses, diagnosis]);
    }
  };

  const handleRemoveDiagnosis = (namasteCode) => {
    setSelectedDiagnoses(selectedDiagnoses.filter((d) => d.namasteCode !== namasteCode));
  };

  return (
    <AuthProvider onLogin={setUser}>
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-8 h-8 text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">EMR System</h1>
                <span className="text-sm text-gray-500">NAMASTE & ICD-11 Integration</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-500">{user?.role}</div>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Patient Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <div className="font-medium">{mockPatient.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <div className="font-medium">{mockPatient.age} years</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <div className="font-medium">{mockPatient.gender}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">ABHA ID:</span>
                    <div className="font-medium">{mockPatient.abhaId}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" />
                Diagnosis Search
              </h2>
              <DiagnosisSearch
                onSelectDiagnosis={handleSelectDiagnosis}
                selectedDiagnoses={selectedDiagnoses}
              />

              {selectedDiagnoses.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Selected Diagnoses ({selectedDiagnoses.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiagnoses.map((diagnosis) => (
                      <span
                        key={diagnosis.namasteCode}
                        className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                      >
                        {diagnosis.namasteTerm}
                        <button
                          onClick={() => handleRemoveDiagnosis(diagnosis.namasteCode)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Problem List Panel */}
            <div>
              <ProblemList
                diagnoses={selectedDiagnoses}
                onRemoveDiagnosis={handleRemoveDiagnosis}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default EMRApp;

