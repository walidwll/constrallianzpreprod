import React, { useState } from "react"; 
import Select from 'react-select';
import { ChevronDown } from "lucide-react";

const Disponibilite = ({
    formData,
    setFormData,
    placeholder = 'Select an option',
}) => {
  const regionsEspagne = [
    'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country',
          'Canary Islands', 'Cantabria', 'Castile and Leon', 'Castile-La Mancha',
          'Catalonia', 'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarre',
          'La Rioja', 'Valencian Community',
  ];

  const formattedOptions = regionsEspagne.map((region) => ({ value: region, label: region }));

  return (
    <div className="space-y-6">
      {/* Dropdown Disponibilité */}
      <div className="flex gap-4 items-center">
        <label htmlFor="disponibilite" className="text-gray-700">
          DISPONIBILITY
        </label>
        <div className="flex-1 relative">
        <select
          id="disponibility"
          name="disponibility"
          className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
          onChange={(e) =>
            setFormData({ ...formData, subCompany: { ...formData.subCompany, disponibility: e.target.value, regions: [], }, })
          }
          value={formData.subCompany?.disponibility || ""}
        >
          <option value="" disabled>
            Sélectionnez la disponibilité
          </option>
          <option value="international">International 🌍</option>
          <option value="national">National 🇪🇸</option>
          <option value="regional">Régional 📍</option>
        </select>
        <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
			<ChevronDown className="w-4 h-4 text-gray-500" />
		</span>
        </div>
      </div>

      {/* Multichoix Régions (Affichage conditionnel) */}
      {formData.subCompany?.disponibility === "regional" && (
        <div>
          <label htmlFor="regions" className="text-gray-700">
            Sélectionnez les régions d'Espagne
          </label>
          <Select
            isMulti
            options={formattedOptions}
            value={formData.subCompany?.regions || []}
            onChange={(selectedRegions) =>setFormData({ ...formData, subCompany: { ...formData.subCompany, regions: selectedRegions, }, })}
            placeholder={placeholder}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
      )}
    </div>
  );
};

export default Disponibilite;
