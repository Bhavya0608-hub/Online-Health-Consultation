G21 ; Set units to mm
G90 ; Absolute positioning
G1 F23 ; Set feed rate
M3 S43 ; Start spindle
G0 X0 Y0 ; Move to start position
G1 X0 Y0 Z-1 ; Start cutting
G1 X23.0 Y0 ; Cut along X axis
G1 X23.0 Y32.0 ; Cut along Y axis
G1 X0 Y32.0 ; Cut along negative X axis
G1 X0 Y0 ; Finish cut
M5 ; Stop spindle
G0 Z10 ; Lift tool
M30 ; End of program