import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  text: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  loginBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#007BFF",
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  googleBtn: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  googleText: {
    color: "#555",
    fontWeight: "bold",
  },
  footer: { fontSize: 13, marginTop: 20, color: "#555" },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  separatorLine: {
    width: "40%",
    height: 2,
    backgroundColor: "#aaa",
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#555",
  },
});

export default styles;
