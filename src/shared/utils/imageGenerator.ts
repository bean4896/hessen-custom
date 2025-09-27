export const generatePlaceholderDataUrl = (
    width: number = 1200,
    height: number = 800,
    bgColor: string = 'D2B48C',
    textColor: string = '000000',
    text: string = 'Hessen Bed Frame'
  ): string => {
    // Convert hex colors to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 210, g: 180, b: 140 };
    };
  
    const bg = hexToRgb(bgColor);
    const textRgb = hexToRgb(textColor);
  
    // Create SVG data URL
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="texture" patternUnits="userSpaceOnUse" width="100" height="100">
            <rect width="100" height="100" fill="rgb(${bg.r},${bg.g},${bg.b})"/>
            <circle cx="20" cy="20" r="1" fill="rgba(0,0,0,0.1)"/>
            <circle cx="80" cy="60" r="1" fill="rgba(0,0,0,0.1)"/>
            <circle cx="50" cy="90" r="1" fill="rgba(0,0,0,0.1)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#texture)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
              text-anchor="middle" dominant-baseline="middle" 
              fill="rgb(${textRgb.r},${textRgb.g},${textRgb.b})"
              opacity="0.8">
          ${text}
        </text>
      </svg>
    `;
  
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };
  