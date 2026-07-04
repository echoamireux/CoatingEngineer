/**
 * Formula Library
 * 集中管理 LaTeX 公式字符串，确保转义字符 (\\) 的正确性。
 * 使用双反斜杠 \\ 来表示 LaTeX 命令。
 */
module.exports = {
  // Process Control Formulas
  DIFFUSION: "D = D_0 \\cdot exp(-\\frac{Ea}{RT})",

  AREA_DENSITY: "RPM = K \\cdot V \\cdot \\frac{Target}{Pump}",

  CPK: "CPK = \\min \\frac{USL-\\mu}{3\\sigma}, \\frac{\\mu-LSL}{3\\sigma}",

  TAPER_TENSION: "F = F_0 \\times [1 - Taper % \\times \\frac{D - D_0}{D}]",

  // Coating Theory Formulas
  WET_FILM_THICKNESS: "H = \\frac{Q}{V \\times W}",

  CAPILLARY_NUMBER: "Ca = \\frac{\\eta \\times V}{\\sigma}",

  CRITICAL_THICKNESS: "H_{min} = 0.65 \\times G \\times Ca^{2/3}",

  SLOT_DIE_PRESSURE: "\\Delta P = \\frac{12\\eta QL}{W b^3}",

  GRAVURE_COATING: "W = V \\times \\rho \\times \\eta_t",

  FOX_EQUATION: "\\frac{1}{Tg} = \\sum \\frac{W_i}{Tg_i}",

  // Testing & Quality Formulas (V5.0)
  SHEAR_RATE_ISO: "\\dot{\\gamma} = \\frac{V}{h}",
  STORAGE_MODULUS: "G' = \\frac{\\sigma_0}{\\epsilon_0} \\cos \\delta",
  LOSS_MODULUS: "G'' = \\frac{\\sigma_0}{\\epsilon_0} \\sin \\delta",
  TAN_DELTA: "\\tan \\delta = \\frac{G''}{G'}",
  WLF_EQUATION: "\\log a_T = \\frac{-C_1 (T - T_r)}{C_2 + (T - T_r)}",
  CROSSLINK_DENSITY: "\\nu_e = \\frac{G'}{3RT}",
  GEL_FRACTION: "Gel\\% = \\frac{W_{gel}}{W_{initial}} \\times 100\\%",
  SOLID_CONTENT: "SC = \\frac{W_{dry}}{W_{wet}} \\times 100\\%",
  PEEL_STRENGTH: "F_{peel} = \\frac{F_{avg}}{Width}",
  HAZE_CALC: "Haze\\% = \\frac{T_{diffuse}}{T_{total}} \\times 100\\%",
  YI_CALC: "YI = \\frac{100(1.30X - 1.15Z)}{Y}"
};
