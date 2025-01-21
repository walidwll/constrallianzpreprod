import React, { useState } from 'react';
import Select from 'react-select';

const MultiSelectDropdown = ({
    options = [],
    formData,
    setFormData,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
}) => {
  const formattedOptions = options.map(option => ({
    label: option.SUBACT_name,  
    value: option.id_SubAct,   
  }));
    return(
  <Select
    isMulti
    name="subactivities"
    options={formattedOptions}
    value={formData.subCompany?.subActivities || []}
    onChange={(selectedSubActivities) => setFormData({ ...formData, subCompany: { ...formData.subCompany, subActivities: selectedSubActivities, }, })}
    placeholder={placeholder}
    className="basic-multi-select"
    classNamePrefix="select"
    noOptionsMessage={() => searchPlaceholder}
  />
    );
};

export default MultiSelectDropdown;