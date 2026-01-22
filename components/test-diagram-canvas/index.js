const app = getApp();

Component({
  properties: {
    mode: {
      type: String,
      value: 'default', // peel-180, shear-static, tack-loop, viscosity, release
    },
    caption: {
      type: String,
      value: ''
    }
  },

  data: {
    width: 0,
    height: 0,
    dpr: 1
  },

  lifetimes: {
    ready() {
      this.initCanvas();
    }
  },

  methods: {
    initCanvas() {
      const query = this.createSelectorQuery();
      query.select('#diagramCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]) return;

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getSystemInfoSync().pixelRatio;

          // Set canvas dimensions considering dpr
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);

          this.setData({
            width: res[0].width,
            height: res[0].height,
            dpr: dpr
          });

          this.draw(ctx, res[0].width, res[0].height);
        });
    },

    draw(ctx, w, h) {
      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Theme Detection
      const theme = wx.getSystemInfoSync().theme || 'light';
      const isDark = theme === 'dark';

      // Engineering Style Settings
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const colors = {
        primary: '#6366f1',   // Indigo (Brand)
        secondary: isDark ? '#94a3b8' : '#64748b', // Slate 400/500
        accent: '#f43f5e',    // Rose
        steel: isDark ? '#475569' : '#cbd5e1',     // Slate 600/300 for metals
        text: isDark ? '#cbd5e1' : '#475569'       // Slate 300/600 for labels
      };

      // Draw specialized diagram based on mode
      switch(this.data.mode) {
        case 'peel-180':
          this.drawPeel180(ctx, w, h, colors);
          break;
        case 'shear-static':
          this.drawShear(ctx, w, h, colors);
          break;
        case 'tack-loop':
          this.drawLoopTack(ctx, w, h, colors);
          break;
        case 'viscosity':
          this.drawViscosity(ctx, w, h, colors);
          break;
        case 'release':
          this.drawRelease(ctx, w, h, colors);
          break;
        default:
          this.drawPlaceholder(ctx, w, h);
      }
    },

    // --- ALGORITHMIC ART DRAWING FUNCTIONS ---

    // 1. Peel 180 Test
    drawPeel180(ctx, w, h, c) {
      const centerX = w / 2;
      const centerY = h / 2;

      // Substrate (Steel Plate)
      ctx.fillStyle = c.steel;
      ctx.fillRect(centerX - 100, centerY + 20, 200, 10);

      // Tape (Bonded part)
      ctx.fillStyle = c.primary;
      ctx.fillRect(centerX, centerY + 20, 100, 4); // Right half bonded

      // Tape (Peeling part) - Vector Curve
      ctx.beginPath();
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 4;
      ctx.moveTo(centerX, centerY + 22); // Peel point
      // Bezier curve to simulate flexible tape bending back 180 degrees
      ctx.bezierCurveTo(
        centerX - 40, centerY + 22, // Control 1: Extend left
        centerX - 40, centerY - 20, // Control 2: Curve up
        centerX - 120, centerY - 20 // End: Pulling away to left
      );
      ctx.stroke();

      // Force Arrow
      this.drawArrow(ctx, centerX - 120, centerY - 20, -1, 0, c.accent, 'F', c);

      // Annotations
      this.drawLabel(ctx, 'Substrate', centerX + 50, centerY + 50, c);
      this.drawLabel(ctx, 'Tape', centerX - 60, centerY - 40, c);
    },

    // 2. Static Shear Test
    drawShear(ctx, w, h, c) {
      const cx = w / 2;
      const cy = h / 2 - 40;

      // Steel Panel (Vertical)
      ctx.fillStyle = c.steel;
      ctx.fillRect(cx - 20, cy - 80, 40, 120);

      // Tape (Bonded Area 25x25)
      ctx.fillStyle = c.primary;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(cx - 20, cy, 40, 40); // 25x25 area simulation
      ctx.globalAlpha = 1.0;

      // Tape Tail (Hanging down)
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 40);
      ctx.lineTo(cx, cy + 120); // Long tail
      ctx.stroke();

      // Weight (1kg)
      ctx.fillStyle = c.accent;
      ctx.fillRect(cx - 25, cy + 120, 50, 40);
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText('1kg', cx - 8, cy + 145);

      // Annotation
      this.drawLabel(ctx, '2° Tilt', cx + 40, cy - 60, c);
    },

    // 3. Loop Tack
    drawLoopTack(ctx, w, h, c) {
      const cx = w / 2;
      const cy = h / 2;

      // Fixture (Clamp)
      ctx.fillStyle = c.secondary;
      ctx.fillRect(cx - 30, cy - 80, 60, 20);

      // Tape Loop (Teardrop shape)
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy - 60); // Left clamp exit
      // Bezier for loop
      ctx.bezierCurveTo(
        cx - 15, cy + 40, // Control 1
        cx + 15, cy + 40, // Control 2
        cx + 15, cy - 60  // Right clamp exit
      );
      ctx.stroke();

      // Substrate (Probe)
      ctx.fillStyle = c.steel;
      ctx.fillRect(cx - 60, cy + 20, 120, 10); // Plate contacting loop bottom
      this.drawLabel(ctx, 'Contact Area', cx, cy + 50, c);
    },

    // 4. Viscosity (Brookfield)
    drawViscosity(ctx, w, h, c) {
      const cx = w / 2;
      const cy = h / 2 + 20;

      // Beaker
      ctx.strokeStyle = c.secondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy - 80);
      ctx.lineTo(cx - 50, cy + 60); // Left wall
      ctx.lineTo(cx + 50, cy + 60); // Bottom
      ctx.lineTo(cx + 50, cy - 80); // Right wall
      ctx.stroke();

      // Fluid Level
      ctx.fillStyle = c.primary;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(cx - 50, cy - 40, 100, 100);
      ctx.globalAlpha = 1.0;

      // Spindle (Rotary)
      ctx.fillStyle = c.steel;
      ctx.fillRect(cx - 5, cy - 100, 10, 120); // Shaft
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 25, 0, Math.PI * 2); // Disc
      ctx.fill();

      // Rotation Arrow
      ctx.strokeStyle = c.accent;
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 40, Math.PI, 0); // Half circle top
      ctx.stroke();
      this.drawArrowHead(ctx, cx + 40, cy - 20, Math.PI / 2, c.accent);
    },

    // 5. Release Test
    drawRelease(ctx, w, h, c) {
      const cx = w / 2;
      const cy = h / 2;

      // Liner (Bottom)
      ctx.fillStyle = c.secondary;
      ctx.fillRect(cx - 100, cy + 10, 200, 4);

      // Tape (Top, peeling)
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + 80, cy + 10);
      ctx.lineTo(cx - 20, cy + 10); // Adhered part
      ctx.lineTo(cx - 80, cy - 60); // Peeling up
      ctx.stroke();

      this.drawLabel(ctx, '180° / High Speed', cx, cy - 40, c);
    },

    // Helpler: Draw Arrow
    drawArrow(ctx, x, y, dirX, dirY, color, text, c) {
      const len = 40;
      const endX = x + dirX * len;
      const endY = y + dirY * len;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrow Head
      const angle = Math.atan2(dirY, dirX);
      this.drawArrowHead(ctx, endX, endY, angle, color);

      if (text) {
        ctx.fillStyle = color;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(text, x, y - 10);
      }
    },

    drawArrowHead(ctx, x, y, angle, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 10 * Math.cos(angle - Math.PI / 6), y - 10 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x - 10 * Math.cos(angle + Math.PI / 6), y - 10 * Math.sin(angle + Math.PI / 6));
      ctx.fill();
    },

    drawLabel(ctx, text, x, y, c) {
      ctx.fillStyle = c && c.text ? c.text : '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y);
    },

    drawPlaceholder(ctx, w, h) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(20, 20, w-40, h-40);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No Diagram Available', w/2, h/2);
    }
  }
});
