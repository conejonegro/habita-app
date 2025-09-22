import { StyleSheet } from "react-native";
import { UberColors, UberTypography, UberSpacing, UberShadows, UberBorderRadius } from "./uberTheme";

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: UberColors.backgroundSecondary 
  },
  header: {
    backgroundColor: UberColors.backgroundSecondary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: UberSpacing.lg,
  },
  headerTitle: {
    fontSize: UberTypography.fontSize['3xl'],
    fontWeight: '700',
    color: UberColors.textPrimary,
    textAlign: 'left',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  welcomeMessage: {
    fontSize: UberTypography.fontSize.xl,
    fontFamily: UberTypography.fontFamilyMedium,
    color: UberColors.textPrimary,
    marginBottom: UberSpacing.lg,
    marginHorizontal: UberSpacing.lg,
    marginTop: UberSpacing.lg,
  },
  userName: {
    fontFamily: UberTypography.fontFamilyBold,
    color: UberColors.primaryBlue,
  },
  card: {
    padding: UberSpacing.lg,
    borderRadius: UberBorderRadius.lg,
    backgroundColor: UberColors.white,
    marginBottom: UberSpacing.md,
    marginHorizontal: UberSpacing.lg,
    ...UberShadows.small,
  },
  cardTitle: { 
    fontSize: UberTypography.fontSize.xl, 
    fontWeight: '700',
    marginBottom: UberSpacing.sm,
    color: UberColors.textPrimary,
    letterSpacing: -0.3,
  },
  status: { 
    fontSize: UberTypography.fontSize.lg, 
    fontFamily: UberTypography.fontFamilySemiBold,
    color: UberColors.textPrimary,
  },
  date: { 
    fontSize: UberTypography.fontSize.sm, 
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary, 
    marginTop: UberSpacing.sm 
  },
  button: {
    marginTop: UberSpacing.md,
    paddingVertical: UberSpacing.md,
    paddingHorizontal: UberSpacing.lg,
    borderRadius: UberBorderRadius['3xl'],
    backgroundColor: UberColors.buttonPrimary,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: UberColors.buttonText,
    fontFamily: UberTypography.fontFamilySemiBold,
    fontSize: UberTypography.fontSize.base,
  },
  eventContainer: {
    // transition: 'transform 0.5s ease-in-out',
  },
  listContainer: {
    marginTop: UberSpacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: UberSpacing.md,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UberColors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: UberSpacing.md,
  },
  paymentMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: UberSpacing.sm,
  },
  paymentIcon: {
    marginRight: UberSpacing.sm,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: UberTypography.fontSize.base,
    fontFamily: UberTypography.fontFamilyBold,
    color: UberColors.textPrimary,
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: UberTypography.fontSize.sm,
    fontFamily: UberTypography.fontFamily,
    color: UberColors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: UberColors.borderLight,
    marginLeft: 56, // 40 (icon width) + 16 (margin)
  },
  paymentStatusBadge: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  alignSelf: 'flex-start',
  marginTop: 8,
},
paymentStatusText: {
  fontSize: UberTypography.fontSize.base,
  fontFamily: UberTypography.fontFamilySemiBold,
},
statusPaid: {
  backgroundColor: '#E6F4EA', // verde claro de fondo
  borderWidth: 1,
  borderColor: '#34A853', // verde Google
},
statusPaidText: {
  color: '#1E7D32',
},
statusPending: {
  backgroundColor: '#FDECEA', // rojo claro de fondo
  borderWidth: 1,
  borderColor: '#D93025', // rojo Google
},
statusPendingText: {
  color: '#B00020',
},

});

export default styles;