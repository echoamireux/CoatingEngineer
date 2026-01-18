
import math

def format_num(n):
    return "{:.2f}".format(n)

print("=== 1. VERIFYING COATING (COMPOSITE) ===")
# Input
comp_i = 76.2 # 3 inch
comp_c = 10.0
comp_L = 1000.0 # m
# Layer: 1000mm width, 100um thickness, 1.5 g/cc density
layer_w = 1000.0
layer_t = 100.0
layer_d = 1.5

# Code Logic
t_total = layer_t # 100
# D = sqrt( (i+2c)^2 + (4 * L * t_total) / PI )
# Units: mm^2 + (m * um)/PI ?
# Check: 4 * 1000(m) * 100(um) = 400,000 unit-product.
# We established L_m * t_um = mm^2.
# 400,000 / PI = 127323 mm^2.
# Core^2 = (96.2)^2 = 9254.
# Total = 136577. Sqrt = 369.56 mm.
# Is this realistic?
# 1000m of 100um film is a solid thickness of 100mm (0.1m).
# Annulus area ~ PI * (R_out^2 - 48.1^2) = 1m * 0.1mm * width? No.
# Volume Material = 1000m * 1m * 0.1mm = 0.1 m^3 = 100,000,000 mm^3.
# Area Cross Section = Volume / Width = 100,000 mm^2.
# Formula term (4/PI) * 100,000 ~ 1.27 * 100,000 = 127,000. Matches.
D = math.sqrt( pow(comp_i + 2*comp_c, 2) + (4 * comp_L * t_total) / math.pi )
print(f"Calculated Diameter: {D:.2f} mm (Expected ~370mm for 1000m/100um)")

# Code Logic M
# total = w * t * d (sum)
# M = (L * total) / 1000000
total_term = layer_w * layer_t * layer_d # 1000 * 100 * 1.5 = 150000
M = (comp_L * total_term) / 1000000
# 1000 * 150000 = 150,000,000 / 1e6 = 150 kg.
# Check: Volume = 0.1 m^3. Density 1.5 g/cc = 1500 kg/m^3.
# Mass = 0.1 * 1500 = 150 kg.
print(f"Calculated Weight: {M:.2f} kg (Expected 150kg)")

print("\n=== 2. VERIFYING COATING (PROCESS) ===")
# Input
glue_v = 50.0 # m/min
glue_W = 1000.0 # mm
glue_t_dry = 100.0 # um
glue_rho_dry = 1.5 # g/cc
glue_S = 50.0 # %
glue_rho_wet = 1.2 # g/cc
glue_Dp = 100.0 # cc/rev
glue_L = 1000.0 # m

# m_dry (g/m^2) = t_dry * rho_dry
m_dry = glue_t_dry * glue_rho_dry # 150 g/m^2
print(f"Dry Loading: {m_dry} g/m^2")

# Q (cc/min via formula)
# Q = (v * W * m_dry) / (10 * S * rho_wet)
# Formula derivation check:
# Mass_dry/min = 50 * 1 * 150 = 7500 g/min
# Mass_wet/min = 7500 / 0.5 = 15000 g/min
# Vol_wet/min = 15000 / 1.2 = 12500 cc/min
# Formula: (50 * 1000 * 150) / (10 * 50 * 1.2) = 7,500,000 / 600 = 12,500. Matches.
Q_calc = (glue_v * glue_W * m_dry) / (10 * glue_S * glue_rho_wet)
pump_speed = Q_calc / glue_Dp # 12500 / 100 = 125
print(f"Pump Speed: {pump_speed:.2f} rpm (Expected 125.00)")

# Wet Weight M
# M = (m_dry * L * W) / (10000 * S)
# Check: Dry Total = 150 g/m^2 * 1000m * 1m = 150,000g = 150kg.
# Wet Total = 150 / 0.5 = 300kg.
# Formula: (150 * 1000 * 1000) / (10000 * 50) = 150,000,000 / 500,000 = 300. Matches.
Mw = (m_dry * glue_L * glue_W) / (10000 * glue_S)
print(f"Wet Weight: {Mw:.2f} kg (Expected 300.00)")


print("\n=== 3. VERIFYING FLUID (PIPE) ===")
# Input
rho_wet = 1.2 # g/cc -> 1200 kg/m^3
viscosity = 5000.0 # cP -> 5 Pa.s (Newtonian for simplicity)
K_val = 5.0 # Pa.s
n_val = 1.0
isPowerLaw = False # Use viscosity
pipe_Q = 20.0 # L/min
pipe_D = 25.0 # mm
pipe_L = 10.0 # m
pipe_dz = 0.0
pipe_K_loss = 0.0

# Conversions in code
rho = rho_wet * 1000 # 1200
K = viscosity / 1000 # 5
n = 1
Q = pipe_Q / 60000 # 20 / 60000 = 1/3000 = 0.000333 m^3/s
D = pipe_D / 1000 # 0.025 m
L = pipe_L
dz = 0
Kl = 0

# Factor
factor = (3*n + 1) / (4*n) # 1
shear = factor * (32 * Q) / (math.pi * pow(D, 3))
# 32 * 0.0003333 / (3.14159 * 0.000015625)
# 0.01066 / 0.000049 = 217.5 s^-1
print(f"Shear Rate: {shear:.2f} s^-1")

mu_eff = K * pow(shear, n-1) # 5 * 1 = 5 Pa.s

# Pressure Drop
# dp = (128 * mu_eff * L * Q) / (PI * D^4)
# 128 * 5 * 10 * 0.0003333 / (3.14 * 3.9e-7)
# 2.133 / 1.22e-6 = 1,748,000 Pa approx.
# 1748 kPa.
dp = (128 * mu_eff * L * Q) / (math.pi * pow(D, 4))
plus_terms = rho * 9.81 * dz + Kl * 0.5 * rho * 0 # v is ignored here for K check
total_dp_kpa = dp / 1000
print(f"Pressure Drop: {total_dp_kpa:.2f} kPa")

print("\n=== 4. VERIFYING FLUID (SLOT) ===")
slot_W = 1000.0 # mm
slot_H = 500.0 # um
slot_Ls = 50.0 # mm (lip land)

W = slot_W / 1000 # 1m
H = slot_H / 1e6 # 0.0005 m
Ls = slot_Ls / 1000 # 0.05 m

# Shear
# 6Q / WH^2
# 6 * 0.0003333 / (1 * 2.5e-7)
# 0.002 / 2.5e-7 = 8000 s^-1
slot_shear = (6 * Q) / (W * H * H)
print(f"Slot Shear: {slot_shear:.2f} s^-1")

# DP
# 12 * mu * Ls * Q / W H^3
# 12 * 5 * 0.05 * 0.000333 / (1 * 1.25e-10)
# 0.001 / 1.25e-10 = 8,000,000 Pa = 8000 kPa.
# High pressure due to small gap/viscosity.
slot_dp = (12 * mu_eff * Ls * Q) / (W * pow(H, 3))
slot_dp_kpa = slot_dp / 1000
print(f"Slot DP: {slot_dp_kpa:.2f} kPa")

