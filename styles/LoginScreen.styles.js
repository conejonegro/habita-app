import { StyleSheet } from "react-native";
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from "./uberTheme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: UberSpacing.lg,
    backgroundColor: UberColors.background,
  },
  logo: { 
    width: 80, 
    height: 80, 
    marginBottom: UberSpacing.lg 
  },
  title: { 
    fontSize: UberTypography.fontSize['4xl'], 
    fontWeight: '700',
    marginBottom: UberSpacing.sm,
    color: UberColors.textPrimary,
    letterSpacing: -0.8,
  },
  subtitle: { 
    fontSize: UberTypography.fontSize['2xl'], 
    fontWeight: '700',
    marginBottom: UberSpacing.sm,
    color: UberColors.textPrimary,
    letterSpacing: -0.5,
  },
  text: { 
    fontSize: UberTypography.fontSize.base, 
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary, 
    marginBottom: UberSpacing.xl, 
    textAlign: "center",
    lineHeight: UberTypography.lineHeight.relaxed * UberTypography.fontSize.base,
  },
  input: {
    width: "100%",
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    borderWidth: 1,
    borderColor: UberColors.border,
    borderRadius: UberBorderRadius.lg,
    marginBottom: UberSpacing.md,
    backgroundColor: UberColors.white,
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textPrimary,
    ...UberShadows.small,
  },
  loginBtn: {
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    borderRadius: UberBorderRadius['3xl'],
    alignSelf: 'center',
    backgroundColor: UberColors.buttonPrimary,
    marginBottom: UberSpacing.md,
    ...UberShadows.small,
  },
  loginText: {
    color: UberColors.buttonText,
    fontFamily: UberTypography.fontFamilySemiBold,
    fontSize: UberTypography.fontSize.base,
  },
  googleBtn: {
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    borderWidth: 1,
    borderColor: UberColors.border,
    borderRadius: UberBorderRadius['3xl'],
    alignSelf: 'center',
    backgroundColor: UberColors.white,
    ...UberShadows.small,
  },
  googleText: {
    color: UberColors.textPrimary,
    fontFamily: UberTypography.fontFamilySemiBold,
    fontSize: UberTypography.fontSize.base,
  },
  footer: { 
    fontSize: UberTypography.fontSize.sm, 
    fontFamily: UberTypography.fontFamily,
    marginTop: UberSpacing.xl, 
    color: UberColors.textSecondary 
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: UberSpacing.lg,
  },
  separatorLine: {
    width: "40%",
    height: 1,
    backgroundColor: UberColors.border,
  },
  separatorText: {
    marginHorizontal: UberSpacing.md,
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
  },
});

export default styles;
