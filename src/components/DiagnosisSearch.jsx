import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, CheckCircle } from "lucide-react";
import { mockNamasteData } from "../data/mockData";

const DiagnosisSearch = ({ onSelectDiagnosis, selectedDiagnoses }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchDiagnoses = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      const filtered = mockNamasteData.filter((item) =>
        item.namasteTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namasteCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.whoAyurvedaTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.biomedicalTerm.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
      setShowResults(true);
    }, 400);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchDiagnoses(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (diagnosis) => {
    onSelectDiagnosis(diagnosis);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const isSelected = (diagnosis) => selectedDiagnoses.some((d) => d.namasteCode === diagnosis.namasteCode);

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search diagnoses (NAMASTE, WHO Ayurveda, ICD-11)..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          onFocus={() => query && setShowResults(true)}
        />
        {isSearching && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />}
      </div>

      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.length === 0 && !isSearching ? (
            <div className="p-4 text-gray-500 text-center">No diagnoses found matching your search</div>
          ) : (
            results.map((diagnosis) => (
              <div
                key={diagnosis.namasteCode}
                onClick={() => !isSelected(diagnosis) && handleSelect(diagnosis)}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                  isSelected(diagnosis) ? "bg-gray-100 opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-indigo-600">{diagnosis.namasteCode}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm font-medium text-gray-900">{diagnosis.namasteTerm}</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>WHO: {diagnosis.whoAyurvedaCode} - {diagnosis.whoAyurvedaTerm}</div>
                      <div>ICD-11: {diagnosis.icd11BiomedicineCode} - {diagnosis.biomedicalTerm}</div>
                    </div>
                  </div>
                  {isSelected(diagnosis) && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosisSearch;
