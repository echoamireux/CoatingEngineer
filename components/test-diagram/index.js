// components/test-diagram/index.js
Component({
  properties: {
    mode: {
      type: String,
      value: 'peel-180' // peel-180, shear, tack-loop, viscosity, release
    },
    caption: {
      type: String,
      value: ''
    }
  }
})
