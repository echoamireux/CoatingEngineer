Component({
  properties: {
    name: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: 'var(--text)'
    },
    size: {
      type: Number,
      value: 40 // Default 40rpx
    }
  },

  data: {
    // Icons moved from CSS to JS for better stability (avoid mask-image issues if possible, or use background-image)
    // Using simple mapping to classes or inline styles
  },

  methods: {}
})
