/**
 * Formula Library
 * 集中管理 LaTeX 公式字符串，确保转义字符 (\\) 的正确性。
 * 使用双反斜杠 \\ 来表示 LaTeX 命令。
 */
module.exports = {
  // Process Control Formulas
  DIFFUSION: "D = D_0 \\cdot exp(-Ea/RT)",

  AREA_DENSITY: "RPM = K \\cdot V \\cdot \\frac{Target}{Pump}",

  CPK: "CPK = \\min \\frac{USL-\\mu}{3\\sigma}, \\frac{\\mu-LSL}{3\\sigma}",

  TAPER_TENSION: "F = F_0 \\times [1 - Taper\\% \\times \\frac{D - D_0}{D}]",

  // Coating Theory Formulas
  WET_FILM_THICKNESS: "H = \\frac{Q}{V \\times W}",

  CAPILLARY_NUMBER: "Ca = \\frac{\\eta \\times V}{\\sigma}",

  CRITICAL_THICKNESS: "H_{min} = 0.65 \\times G \\times Ca^{2/3}",

  SLOT_DIE_PRESSURE: "\\Delta P = \\frac{12\\eta QL}{W b^3}",

  GRAVURE_COATING: "W = V \\times \\rho \\times \\eta_t",

  FOX_EQUATION: "1/Tg = \\sum (W_i/Tg_i)"
};
