// todo: write documentation for colors and palette in own markdown file and add links from here

export const palette = {
  neutral100: "#ffffff",
  neutral200: "#f4f2f1",
  neutral300: "#d7cec9",
  neutral400: "#b6aca6",
  neutral500: "#978f8a",
  neutral600: "#564e4a",
  neutral700: "#3c3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#f4e0d9",
  primary200: "#e8c1b4",
  primary300: "#dda28e",
  primary400: "#d28468",
  primary500: "#c76542",
  primary600: "#a54f31",

  secondary100: "#dcdde9",
  secondary200: "#bcc0d6",
  secondary300: "#9196b9",
  secondary400: "#626894",
  secondary500: "#41476e",

  accent100: "#ffeed4",
  accent200: "#ffe1b2",
  accent300: "#fdd495",
  accent400: "#fbc878",
  accent500: "#ffbb50",

  angry100: "#f2d6cd",
  angry500: "#c03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * the palette is available to use, but prefer using the name.
   * this is only included for rare, one-off cases. try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * a helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * the default text color in many components.
   */
  text: palette.neutral800,
  /**
   * secondary text information.
   */
  textdim: palette.neutral600,
  /**
   * the default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * the default border color.
   */
  border: palette.neutral400,
  /**
   * the main tinting color.
   */
  tint: palette.primary500,
  /**
   * a subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * error messages.
   */
  error: palette.angry500,
  /**
   * error background.
   *
   */
  errorbackground: palette.angry100,
}
