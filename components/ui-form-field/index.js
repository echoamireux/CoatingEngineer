Component({
  options: {
    multipleSlots: true
  },
  properties: {
    label: { type: String, value: '' },
    value: { type: String, optionalTypes: [Number], value: '' },
    placeholder: { type: String, value: '' },
    type: { type: String, value: 'digit' }, // digit, text, number
    unit: { type: String, value: '' },
    isError: { type: Boolean, value: false },
    fieldName: { type: String, value: '' }, // Useful for event bubbling
    customStyle: { type: String, value: '' }
  },

  data: {
    isFocused: false
  },

  methods: {
    onInput(e) {
      const val = e.detail.value;
      this.triggerEvent('input', { value: val, field: this.data.fieldName });
    },
    onFocus() {
      this.setData({ isFocused: true });
      this.triggerEvent('focus', { field: this.data.fieldName });
    },
    onBlur() {
      this.setData({ isFocused: false });
      this.triggerEvent('blur', { field: this.data.fieldName });
    }
  }
})
