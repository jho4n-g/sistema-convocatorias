import Select from 'react-select';

export default function MultiSelectComponent({
  label = 'Seleccione una o más opciones',
  placeholder = 'Buscar y seleccionar...',
  options = [],
  name,
  value = [],
  onChange,
  error,
  isDisabled = false,
}) {
  // Evita problemas cuando los IDs llegan como string o number
  const normalizedValues = Array.isArray(value)
    ? value.map((item) => String(item))
    : [];

  const selectedOptions = options.filter((option) =>
    normalizedValues.includes(String(option.value)),
  );

  const handleChange = (selected) => {
    const selectedValues = selected
      ? selected.map((option) => option.value)
      : [];

    onChange({
      target: {
        name,
        value: selectedValues,
      },
    });
  };

  const errorMessage = Array.isArray(error) ? error[0] : error;

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <Select
        isMulti
        options={options}
        name={name}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isSearchable
        isDisabled={isDisabled}
        closeMenuOnSelect={false}
        noOptionsMessage={() => 'No se encontraron opciones'}
        className="text-sm"
        classNamePrefix="elegant-multiselect"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: '46px',
            borderRadius: '14px',
            borderColor: errorMessage
              ? '#ef4444'
              : state.isFocused
                ? '#2563eb'
                : '#cbd5e1',
            boxShadow: state.isFocused
              ? '0 0 0 3px rgba(37, 99, 235, 0.15)'
              : 'none',
            '&:hover': {
              borderColor: errorMessage ? '#ef4444' : '#2563eb',
            },
          }),

          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? '#2563eb'
              : state.isFocused
                ? '#eff6ff'
                : 'white',
            color: state.isSelected ? 'white' : '#0f172a',
            cursor: 'pointer',
          }),

          menu: (base) => ({
            ...base,
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
            zIndex: 100,
          }),

          multiValue: (base) => ({
            ...base,
            borderRadius: '8px',
            backgroundColor: '#dbeafe',
          }),

          multiValueLabel: (base) => ({
            ...base,
            color: '#1e3a8a',
            fontWeight: '500',
          }),

          multiValueRemove: (base) => ({
            ...base,
            color: '#1e40af',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#2563eb',
              color: 'white',
            },
          }),
        }}
      />

      {errorMessage && (
        <p className="mt-2 text-sm font-medium text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
