Component({
  properties: {
    title: { type: String, value: '' },
    customStyle: { type: String, value: '' }
  },
  options: {
    multipleSlots: true // Enable slots for content and header-actions
  }
})
