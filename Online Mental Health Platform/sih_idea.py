# Simple G-Code generator for 2D rectangular parts

class GCodeGenerator:
    def __init__(self, width, height, tool_diameter, feed_rate, spindle_speed):
        self.width = width
        self.height = height
        self.tool_diameter = tool_diameter
        self.feed_rate = feed_rate
        self.spindle_speed = spindle_speed
        self.gcode = []

    def generate_gcode(self):
        self.gcode.append(f"G21 ; Set units to mm")
        self.gcode.append(f"G90 ; Absolute positioning")
        self.gcode.append(f"G1 F{self.feed_rate} ; Set feed rate")
        self.gcode.append(f"M3 S{self.spindle_speed} ; Start spindle")

        # Move to start position
        self.gcode.append("G0 X0 Y0 ; Move to start position")

        # Cutting the rectangle
        self.gcode.append(f"G1 X0 Y0 Z-1 ; Start cutting")
        self.gcode.append(f"G1 X{self.width} Y0 ; Cut along X axis")
        self.gcode.append(f"G1 X{self.width} Y{self.height} ; Cut along Y axis")
        self.gcode.append(f"G1 X0 Y{self.height} ; Cut along negative X axis")
        self.gcode.append(f"G1 X0 Y0 ; Finish cut")

        # End program
        self.gcode.append("M5 ; Stop spindle")
        self.gcode.append("G0 Z10 ; Lift tool")
        self.gcode.append("M30 ; End of program")

    def save_gcode(self, filename):
        with open(filename, 'w') as file:
            file.write("\n".join(self.gcode))

def main():
    print("Welcome to Simple G-Code Generator!")
    # Get user inputs
    width = float(input("Enter the width of the workpiece (mm): "))
    height = float(input("Enter the height of the workpiece (mm): "))
    tool_diameter = float(input("Enter the tool diameter (mm): "))
    feed_rate = int(input("Enter the feed rate (mm/min): "))
    spindle_speed = int(input("Enter the spindle speed (RPM): "))

    # Initialize GCodeGenerator
    generator = GCodeGenerator(width, height, tool_diameter, feed_rate, spindle_speed)
    generator.generate_gcode()

    # Save to file
    filename = input("Enter filename to save G-Code (e.g., output.nc): ")
    generator.save_gcode(filename)
    print(f"G-Code saved to {filename}")

if __name__ == "__main__":
    main()
